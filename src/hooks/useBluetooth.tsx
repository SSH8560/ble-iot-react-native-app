import {useCallback, useEffect, useRef, useState} from 'react';
import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import BleManager, {Peripheral} from 'react-native-ble-manager';
import {hasBluetoothPermissions} from '@/libs/permissions';
import {SERVICE_UUIDS} from '@/libs/ble';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const useBLE = () => {
  const discoverListener = useRef<EmitterSubscription>();
  const stopScanListenerRef = useRef<EmitterSubscription>();
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
    }

    return () => {
      discoverListener.current?.remove();
      stopScanListenerRef.current?.remove();
      addedListeners.forEach(listener => listener.remove());
    };
  }, []);

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    console.log('Scanned : ', peripheral);
    setScannedPeripherals(
      state => new Map(state.set(peripheral.id, peripheral)),
    );
  };
  const handleStopScan = ({}: {status: number}) => {
    console.log('End scanning');
    setIsScanning(false);
  };
  const handleDisconnectPeripheral = ({peripheral}: {peripheral: string}) => {
    if (connectedPeripheral === peripheral) setConncetedPeripheral(null);
  };

  const connect = async (peripheralId: string) => {
    try {
      await BleManager.connect(peripheralId);
      setConncetedPeripheral(peripheralId);
    } catch (e) {
      throw e;
    }
  };
  const getServices = async (peripheralId: string) => {
    return await BleManager.retrieveServices(peripheralId);
  };
  const notifyCharacteristic = async ({
    peripheralId,
    serviceUUID,
    characteristicUUID,
    onUpdateValue,
  }: {
    peripheralId: string;
    serviceUUID: string;
    characteristicUUID: string;
    onUpdateValue: ({
      value,
      peripheral,
      characteristic,
      service,
    }: {
      value: number[];
      peripheral: string;
      characteristic: string;
      service: string;
    }) => void;
  }) => {
    await BleManager.startNotification(
      peripheralId,
      serviceUUID,
      characteristicUUID,
    );

    listeners.current.push(
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        onUpdateValue,
      ),
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
    await BleManager.write(peripheralId, serviceUUID, characteristicUUID, data);
  };
  const scanPeripheral = useCallback(
    async (duration: number) => {
      if (isScanning) return;

      setIsScanning(true);
      BleManager.scan(Object.values(SERVICE_UUIDS), duration, false);
    },
    [isScanning],
  );

  return {
    isScanning,
    connectedPeripheral,
    scannedPeripherals,
    scanPeripheral,
    connect,
    getServices,
    notifyCharacteristic,
    write,
  };
};

export default useBLE;
