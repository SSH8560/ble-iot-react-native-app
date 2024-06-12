import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import BleManager, {Peripheral} from 'react-native-ble-manager';
import {hasBluetoothPermissions} from '@/libs/permissions';
import {BleContextType} from './BleProvider.d';
import {CHARACTERISTIC_UUIDS, SERVICE_UUIDS} from '@/libs/ble';
import {Buffer} from 'buffer';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const BleContext = createContext<BleContextType | null>(null);

const createKey = ({
  peripheral,
  service,
  characteristic,
}: {
  peripheral: string;
  service: string;
  characteristic: string;
}): string => {
  return `${peripheral}_${service}_${characteristic}`;
};

export const BleProvider = ({children}: PropsWithChildren) => {
  const handlerMapRef = useRef(new Map<string, (bytes: number[]) => void>());
  const discoverListener = useRef<EmitterSubscription>();
  const stopScanListenerRef = useRef<EmitterSubscription>();
  const connectListenerRef = useRef<EmitterSubscription>();
  const disconnectListenerRef = useRef<EmitterSubscription>();
  const listeners = useRef<EmitterSubscription[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedPeripherals, setScannedPeripherals] = useState<
    Map<string, Peripheral>
  >(new Map());
  const [connectedPeripheral, setConncetedPeripheral] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const addedListeners = listeners.current;
    console.log('init ble');
    init();
    async function init() {
      if (!(await hasBluetoothPermissions())) return;

      await BleManager.start({showAlert: false}).then(() =>
        console.log('init'),
      );
      const connectedPeripherals = await BleManager.getConnectedPeripherals();
      if (connectedPeripherals) {
        connectedPeripherals.forEach(peripheral =>
          BleManager.disconnect(peripheral.id),
        );
      }

      discoverListener.current = bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      );
      stopScanListenerRef.current = bleManagerEmitter.addListener(
        'BleManagerStopScan',
        handleStopScan,
      );
      disconnectListenerRef.current = bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectPeripheral,
      );
      connectListenerRef.current = bleManagerEmitter.addListener(
        'BleManagerConnectPeripheral',
        handleConnectPeripheral,
      );
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        onUpdateValueForCharacteristic,
      );
    }

    return () => {
      console.log('free');
      discoverListener.current?.remove();
      stopScanListenerRef.current?.remove();
      addedListeners.forEach(listener => listener.remove());
    };
  }, []);

  const onUpdateValueForCharacteristic = useCallback(
    ({
      value,
      peripheral,
      characteristic,
      service,
    }: {
      value: number[];
      peripheral: string;
      characteristic: string;
      service: string;
    }) => {
      try {
        const handler = handlerMapRef.current.get(
          createKey({peripheral, service, characteristic}),
        );

        if (!handler)
          throw new Error(
            `실행할 함수가 없습니다. 
            peripheral: ${peripheral},
            service: ${service},
            characteristic: ${characteristic},`,
          );

        handler(value);
      } catch (e) {
        console.log(e);
        console.log(handlerMapRef.current);
      }
    },
    [],
  );

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    setScannedPeripherals(
      state => new Map(state.set(peripheral.id, peripheral)),
    );
  };
  const handleStopScan = ({}: {status: number}) => {
    console.log('End scanning');
    setIsScanning(false);
  };
  const handleDisconnectPeripheral = useCallback(({}: {peripheral: string}) => {
    setConncetedPeripheral(null);
  }, []);
  const handleConnectPeripheral = ({peripheral}: {peripheral: string}) => {
    setConncetedPeripheral(peripheral);
  };
  const connect = async (peripheralId: string) => {
    try {
      await BleManager.connect(peripheralId);
    } catch (e) {
      throw e;
    }
  };
  const disconnect = async (peripheralId: string) => {
    await BleManager.disconnect(peripheralId);
  };
  const retrieveServices = useCallback(async (peripheralId: string) => {
    return await BleManager.retrieveServices(peripheralId);
  }, []);

  const stopNotification = useCallback(
    async ({
      peripheralId,
      serviceUUID,
      characteristicUUID,
    }: {
      peripheralId: string;
      serviceUUID: string;
      characteristicUUID: string;
    }) => {
      BleManager.stopNotification(
        peripheralId,
        serviceUUID,
        characteristicUUID,
      );
    },
    [],
  );
  const startNotificateSettingStatus = async (
    peripheralId: string,
    onUpdate: (bytes: number[]) => void,
  ) => {
    const serviceUUID = SERVICE_UUIDS.SETTING_SERVICE_UUD;
    const characteristicUUID = CHARACTERISTIC_UUIDS.SETTING_CHARACTERISTIC_UUID;

    await BleManager.startNotification(
      peripheralId,
      serviceUUID,
      characteristicUUID,
    );
    console.log('1');
    handlerMapRef.current.set(
      createKey({
        peripheral: peripheralId,
        service: serviceUUID,
        characteristic: characteristicUUID,
      }),
      onUpdate,
    );
  };
  const write = async ({
    peripheralId,
    serviceUUID,
    characteristicUUID,
    data,
  }: {
    peripheralId: string;
    serviceUUID: string;
    characteristicUUID: string;
    data: number[];
  }) => {
    await BleManager.write(
      peripheralId,
      serviceUUID,
      characteristicUUID,
      data,
      247,
    );
  };
  const sendWiFiCredentials = async ({
    peripheralId,
    wifiPassword,
    wifiSsid,
  }: {
    peripheralId: string;
    wifiSsid: string;
    wifiPassword: string;
  }) => {
    write({
      peripheralId,
      serviceUUID: SERVICE_UUIDS.SETTING_SERVICE_UUD,
      characteristicUUID: CHARACTERISTIC_UUIDS.SETTING_CHARACTERISTIC_UUID,
      data: Array.from(Buffer.from(`${wifiSsid},${wifiPassword}`)),
    });
  };
  const scanPeripheral = async (duration: number) => {
    if (isScanning) return;

    console.log('Start scanning...');
    setIsScanning(true);
    setScannedPeripherals(new Map());
    BleManager.scan(Array.from(Object.values(SERVICE_UUIDS)), duration, false);
  };
  const readDeviceInfo = async (peripheralId: string) => {
    const data = await BleManager.read(
      peripheralId,
      SERVICE_UUIDS.SETTING_SERVICE_UUD,
      CHARACTERISTIC_UUIDS.SETTING_CHARACTERISTIC_UUID,
    );
    const [id, type] = String.fromCharCode(...data).split(',');
    return {id, type};
  };

  return (
    <BleContext.Provider
      value={{
        isScanning,
        connectedPeripheral,
        scannedPeripherals,
        scanPeripheral,
        connect,
        disconnect,
        startNotificateSettingStatus,
        retrieveServices,
        stopNotification,
        write,
        sendWiFiCredentials,
        readDeviceInfo,
      }}>
      {children}
    </BleContext.Provider>
  );
};

export const useBLE = () => {
  const context = useContext(BleContext);
  if (!context) throw new Error('BleProvider안에서 사용해주세요');

  return context;
};
