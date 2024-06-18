import {useCallback, useEffect, useRef, useState} from 'react';
import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import BleManager, {Peripheral} from 'react-native-ble-manager';
import {hasBluetoothPermissions} from '@/libs/permissions';
import {CHARACTERISTIC_UUIDS, SERVICE_UUIDS} from '@/libs/ble';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

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

const useBLE = () => {
  const handlerMapRef = useRef(new Map<string, (bytes: number[]) => void>());
  const discoverListener = useRef<EmitterSubscription>();
  const stopScanListenerRef = useRef<EmitterSubscription>();
  const connectListenerRef = useRef<EmitterSubscription>();
  const disconnectListenerRef = useRef<EmitterSubscription>();
  const updateValueForCharacteristicListenerRef = useRef<EmitterSubscription>();
  const listeners = useRef<EmitterSubscription[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedPeripherals, setScannedPeripherals] = useState<
    Map<string, Peripheral>
  >(new Map());
  const [connectedPeripheral, setConncetedPeripheral] = useState<string | null>(
    null,
  );

  const handleDisconnectPeripheral = useCallback(({}: {peripheral: string}) => {
    setConncetedPeripheral(null);
  }, []);
  const handleConnectPeripheral = useCallback(
    ({peripheral}: {peripheral: string}) => {
      setConncetedPeripheral(peripheral);
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
  const handleUpdateValueForCharacteristic = useCallback(
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
        console.log(handlerMapRef.current);
        const handlerKey = createKey({peripheral, service, characteristic});
        const handler = handlerMapRef.current.get(handlerKey);

        if (!handler)
          throw new Error(
            `실행할 함수가 없습니다. 
            key:${handlerKey}`,
          );

        handler(value);
      } catch (e) {
        console.log(e);
        console.log(handlerMapRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const addedListeners = listeners.current;
    console.log('init ble');
    init();
    async function init() {
      if (!(await hasBluetoothPermissions())) return;

      await BleManager.start({showAlert: false}).then(() =>
        console.log('BleManager started'),
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
      updateValueForCharacteristicListenerRef.current =
        bleManagerEmitter.addListener(
          'BleManagerDidUpdateValueForCharacteristic',
          handleUpdateValueForCharacteristic,
        );
    }

    return () => {
      discoverListener.current?.remove();
      stopScanListenerRef.current?.remove();
      disconnectListenerRef.current?.remove();
      connectListenerRef.current?.remove();
      updateValueForCharacteristicListenerRef.current?.remove();
      addedListeners.forEach(listener => listener.remove());
    };
  }, []);

  const connect = useCallback(async (peripheralId: string) => {
    try {
      await BleManager.connect(peripheralId);
    } catch (e) {
      throw e;
    }
  }, []);
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
  const startNotification = useCallback(
    async ({
      peripheralId,
      serviceUUID,
      characteristicUUID,
      onUpdate,
    }: {
      peripheralId: string;
      serviceUUID: string;
      characteristicUUID: string;
      onUpdate: (bytes: number[]) => void;
    }) => {
      await BleManager.startNotification(
        peripheralId,
        serviceUUID,
        characteristicUUID,
      );
      handlerMapRef.current.set(
        createKey({
          peripheral: peripheralId,
          service: serviceUUID,
          characteristic: characteristicUUID,
        }),
        onUpdate,
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

  return {
    isScanning,
    connectedPeripheral,
    scannedPeripherals,
    scanPeripheral,
    connect,
    disconnect,
    retrieveServices,
    stopNotification,
    write,
    readDeviceInfo,
    sendWiFiCredentials,
    startNotificateSettingStatus,
    startNotification,
  };
};

export default useBLE;
