import {useCallback, useEffect, useRef, useState} from 'react';
import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import BleManager, {Peripheral} from 'react-native-ble-manager';
import {hasBluetoothPermissions} from '@/libs/permissions';

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
      );
      addedEmitterSubscriptions.push(
        bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
      );
      addedEmitterSubscriptions.push(
        bleManagerEmitter.addListener(
          'BleManagerDisconnectPeripheral',
          handleDisconnectPeripheral,
        ),
      );
      addedEmitterSubscriptions.push(
        bleManagerEmitter.addListener(
          'BleManagerConnectPeripheral',
          handleConnectPeripheral,
        ),
      );
      addedEmitterSubscriptions.push(
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
  const read = useCallback(
    async ({
      peripheralId,
      serviceUUID,
      characteristicUUID,
    }: {
      peripheralId: string;
      serviceUUID: string;
      characteristicUUID: string;
    }) => {
      return await BleManager.read(
        peripheralId,
        serviceUUID,
        characteristicUUID,
      );
    },
    [],
  );
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
      await BleManager.stopNotification(
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
  const write = useCallback(
    async ({
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
    },
    [],
  );
  const startScan = useCallback(
    async (duration: number) => {
      if (isScanning) return;

      console.log('Start scanning...');
      setIsScanning(true);
      setScannedPeripherals(new Map());
      BleManager.scan([], duration, false);
    },
    [isScanning],
  );
  const stopScan = useCallback(async () => {
    await BleManager.stopScan();
  }, []);

  return {
    isScanning,
    connectedPeripherals,
    scannedPeripherals,
    startScan,
    stopScan,
    connect,
    disconnect,
    retrieveServices,
    write,
    read,
    stopNotification,
    startNotification,
  };
};

export default useBLE;
