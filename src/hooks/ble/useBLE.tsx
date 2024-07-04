import {useCallback, useEffect, useRef, useState} from 'react';
import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import BleManager, {Peripheral} from 'react-native-ble-manager';
import {hasBluetoothPermissions} from '@/libs/permissions';
import {createHandlerKey} from '@/libs/utils';

type BLECharacteristicIdentifier = {
  peripheralId: string;
  serviceUUID: string;
  characteristicUUID: string;
};

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const useBLE = () => {
  const handlerMap = useRef<Map<string, (bytes: number[]) => void>>(new Map());
  const emitterSubscriptions = useRef<EmitterSubscription[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedPeripherals, setScannedPeripherals] = useState<
    Map<string, Peripheral>
  >(new Map());
  const [connectedPeripherals, setConnectedPeripherals] = useState<string[]>(
    [],
  );

  const handleDisconnectPeripheral = useCallback(
    ({peripheral}: {peripheral: string}) => {
      setConnectedPeripherals(prevState =>
        prevState.filter(
          connectedPeripheralId => connectedPeripheralId !== peripheral,
        ),
      );
    },
    [],
  );
  const handleConnectPeripheral = useCallback(
    ({peripheral}: {peripheral: string}) => {
      setConnectedPeripherals(prevState => [...prevState, peripheral]);
    },
    [],
  );
  const handleDiscoverPeripheral = useCallback((peripheral: Peripheral) => {
    setScannedPeripherals(prevState =>
      prevState.has(peripheral.id)
        ? prevState
        : new Map(prevState.set(peripheral.id, peripheral)),
    );
  }, []);
  const handleStopScan = useCallback(({}: {status: number}) => {
    setIsScanning(false);
  }, []);
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
        const handlerKey = createHandlerKey({
          peripheral,
          service,
          characteristic,
        });
        const handler = handlerMap.current.get(handlerKey);
        if (!handler) return;

        handler(value);
      } catch (e) {
        console.log(e);
      }
    },
    [],
  );

  useEffect(() => {
    const addedEmitterSubscriptions = emitterSubscriptions.current;
    console.log('init ble');
    init();
    async function init() {
      if (!(await hasBluetoothPermissions())) return;

      await BleManager.start({showAlert: false});

      BleManager.getConnectedPeripherals().then(value => {
        const peripheralIds = value.map(peripheral => peripheral.id);
        setConnectedPeripherals(peripheralIds);
      });
      addedEmitterSubscriptions.push(
        bleManagerEmitter.addListener(
          'BleManagerDiscoverPeripheral',
          handleDiscoverPeripheral,
        ),
        bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
        bleManagerEmitter.addListener(
          'BleManagerDisconnectPeripheral',
          handleDisconnectPeripheral,
        ),
        bleManagerEmitter.addListener(
          'BleManagerConnectPeripheral',
          handleConnectPeripheral,
        ),
        bleManagerEmitter.addListener(
          'BleManagerDidUpdateValueForCharacteristic',
          handleUpdateValueForCharacteristic,
        ),
      );
    }

    return () => {
      addedEmitterSubscriptions.forEach(sub => sub.remove());
      BleManager.getConnectedPeripherals().then(value => {
        value
          .map(peripheral => peripheral.id)
          .forEach(peripheralId => BleManager.disconnect(peripheralId));
      });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = useCallback(async (peripheralId: string) => {
    try {
      await BleManager.connect(peripheralId);
    } catch (e) {
      throw e;
    }
  }, []);
  const disconnect = useCallback(async (peripheralId: string) => {
    await BleManager.disconnect(peripheralId);
  }, []);
  const retrieveServices = useCallback(async (peripheralId: string) => {
    return await BleManager.retrieveServices(peripheralId);
  }, []);
  const startScan = useCallback(
    async (serviceUUIDs: string[], duration: number) => {
      if (isScanning) return;

      console.log('Start scanning...');
      setIsScanning(true);
      setScannedPeripherals(new Map());
      BleManager.scan(serviceUUIDs, duration, false);
    },
    [isScanning],
  );
  const stopScan = useCallback(async () => {
    await BleManager.stopScan();
  }, []);
  const startNotification = useCallback(
    async ({
      peripheralId,
      serviceUUID,
      characteristicUUID,
      onNotify,
    }: BLECharacteristicIdentifier & {
      onNotify: (bytes: number[]) => void;
    }) => {
      await BleManager.startNotification(
        peripheralId,
        serviceUUID,
        characteristicUUID,
      );
      handlerMap.current.set(
        createHandlerKey({
          peripheral: peripheralId,
          service: serviceUUID,
          characteristic: characteristicUUID,
        }),
        onNotify,
      );
    },
    [],
  );
  const stopNotification = useCallback(
    async ({
      peripheralId,
      serviceUUID,
      characteristicUUID,
    }: BLECharacteristicIdentifier) => {
      await BleManager.stopNotification(
        peripheralId,
        serviceUUID,
        characteristicUUID,
      );
    },
    [],
  );
  const read = useCallback(
    async ({
      peripheralId,
      serviceUUID,
      characteristicUUID,
    }: BLECharacteristicIdentifier) => {
      return await BleManager.read(
        peripheralId,
        serviceUUID,
        characteristicUUID,
      );
    },
    [],
  );
  const write = useCallback(
    async ({
      peripheralId,
      serviceUUID,
      characteristicUUID,
      value,
    }: BLECharacteristicIdentifier & {value: number[]}) => {
      await BleManager.write(
        peripheralId,
        serviceUUID,
        characteristicUUID,
        value,
      );
    },
    [],
  );

  return {
    isScanning,
    connectedPeripherals,
    scannedPeripherals,
    startScan,
    stopScan,
    connect,
    disconnect,
    retrieveServices,
    startNotification,
    stopNotification,
    read,
    write,
  };
};

export default useBLE;
