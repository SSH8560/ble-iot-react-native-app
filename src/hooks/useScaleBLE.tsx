import {useCallback, useEffect, useState} from 'react';
import useBLE from './useBLE';
import {CHARACTERISTIC_UUIDS, SERVICE_UUIDS} from '@/libs/ble';
import {Buffer} from 'buffer';

const useScaleBLE = (peripheralId: string) => {
  const {
    connect,
    disconnect,
    connectedPeripherals,
    scannedPeripherals,
    startNotification,
    stopNotification,
    retrieveServices,
    startScan,
    stopScan,
  } = useBLE();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [scaleValue, setScaleValue] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      stopNotification({
        peripheralId,
        serviceUUID: SERVICE_UUIDS.SERVICE_UUID,
        characteristicUUID: CHARACTERISTIC_UUIDS.CHARACTERISTIC_UUID,
      });
      disconnect(peripheralId);
    };
  }, []);

  const onConnect = useCallback(async () => {
    await retrieveServices(peripheralId);
    startNotification({
      peripheralId,
      serviceUUID: SERVICE_UUIDS.SERVICE_UUID,
      characteristicUUID: CHARACTERISTIC_UUIDS.CHARACTERISTIC_UUID,
      onUpdate(bytes) {
        const value = Buffer.from(bytes).readFloatLE();
        setScaleValue(value);
      },
    });
  }, []);

  const connectDevice = async () => {
    startScan(10, peripheral => {
      console.log(peripheral);
      if (peripheral.id === peripheralId) {
        connect(peripheralId);
        stopScan();
      }
    });
  };
  const disconnectDevice = async () => {
    console.log('1');
    disconnect(peripheralId);
  };

  return {
    scaleValue,
    isConnected,
    scannedPeripherals,
    connectDevice,
    disconnectDevice,
  };
};

export default useScaleBLE;
