import {useCallback, useEffect, useRef, useState} from 'react';
import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import BleManager, {Peripheral} from 'react-native-ble-manager';
import {hasBluetoothPermissions} from '@/libs/permissions';
import {useBLEContext} from '@/providers/BLEProvider';

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

const useBLEManager = () => {
  const {handlerMap} = useBLEContext();
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
        const handlerKey = createKey({peripheral, service, characteristic});
        const handler = handlerMap.current.get(handlerKey);

        if (!handler)
          throw new Error(
            `실행할 함수가 없습니다. 
            key:${handlerKey}`,
          );

        handler(value);
      } catch (e) {
        console.log(e);
        console.log(handlerMap.current);
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

  return {
    isScanning,
    connectedPeripherals,
    scannedPeripherals,
    startScan,
    stopScan,
    connect,
    disconnect,
    retrieveServices,
  };
};

export default useBLEManager;
