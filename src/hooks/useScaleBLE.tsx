import {useCallback, useEffect, useState} from 'react';
import useBLE from './useBLE';
import {CHARACTERISTIC_UUIDS, SERVICE_UUIDS} from '@/libs/ble';
import {Buffer} from 'buffer';

const useScaleBLE = (peripheralId: string) => {
  const {
    connect,
    disconnect,
    connectedPeripheral,
    scanPeripheral,
    scannedPeripherals,
    startNotification,
    stopNotification,
    retrieveServices,
  } = useBLE();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [scaleValue, setScaleValue] = useState<number | null>(null);

  useEffect(() => {
    scanPeripheral(10);

    return () => {
      if (isConnected) {
        stopNotification({
          peripheralId,
          serviceUUID: SERVICE_UUIDS.SERVICE_UUID,
          characteristicUUID: CHARACTERISTIC_UUIDS.CHARACTERISTIC_UUID,
        });
        disconnect(peripheralId);
      }
    };
  }, []);

  useEffect(() => {
    if (isConnected) return;

    if (scannedPeripherals.has(peripheralId)) {
      console.log(scannedPeripherals.has(peripheralId));
      connect(peripheralId);
    }
  }, [scannedPeripherals, isConnected]);

  useEffect(() => {
    if (connectedPeripheral === peripheralId) {
      setIsConnected(true);
      onConnect();
    } else {
      setIsConnected(false);
    }
  }, [connectedPeripheral, peripheralId, startNotification, onConnect]);

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

  return {scaleValue, isConnected};
};

export default useScaleBLE;
