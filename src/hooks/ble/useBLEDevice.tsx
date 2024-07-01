import {useState, useCallback} from 'react';
import useBLE from '@/hooks/ble/useBLE';
import {produce} from 'immer';
import {createKey} from '@/libs/utils';

export const useBLEDevice = () => {
  const {
    isScanning,
    startScan,
    stopScan,
    scannedPeripherals,
    connectedPeripherals,
    startNotification,
    stopNotification,
    retrieveServices,
    connect,
    read,
    write,
    disconnect,
  } = useBLE();

  const [characteristicValues, setCharacteristicValues] = useState<{
    [key: string]: number[] | undefined;
  }>({});
  const [notifiedCharacteristic, setNotifiedCharacteristic] = useState<
    string[]
  >([]);

  const handlePressNotification = useCallback(
    async ({
      peripheralId,
      serviceUUID,
      characteristicUUID,
    }: {
      peripheralId: string;
      serviceUUID: string;
      characteristicUUID: string;
    }) => {
      const key = createKey(serviceUUID, characteristicUUID);
      const isNotifying = notifiedCharacteristic.includes(key);
      if (isNotifying) {
        await stopNotification({
          peripheralId,
          serviceUUID,
          characteristicUUID,
        });
        setNotifiedCharacteristic(
          notifiedCharacteristic.filter(notifiedKey => notifiedKey !== key),
        );
      } else {
        await startNotification({
          peripheralId,
          serviceUUID,
          characteristicUUID,
          onUpdate(bytes) {
            setCharacteristicValues(prevState =>
              produce(prevState, draft => {
                draft[key] = bytes;
              }),
            );
          },
        });
        setNotifiedCharacteristic([...notifiedCharacteristic, key]);
      }
    },
    [notifiedCharacteristic, startNotification, stopNotification],
  );
  const handlePressRead = useCallback(
    async ({
      peripheralId,
      serviceUUID,
      characteristicUUID,
    }: {
      peripheralId: string;
      serviceUUID: string;
      characteristicUUID: string;
    }) => {
      const bytes = await read({peripheralId, characteristicUUID, serviceUUID});
      const key = createKey(serviceUUID, characteristicUUID);
      setCharacteristicValues(prevState =>
        produce(prevState, draft => {
          draft[key] = bytes;
        }),
      );
      return bytes;
    },
    [read],
  );
  const handlePressWrite = useCallback(
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
      await write({peripheralId, serviceUUID, characteristicUUID, data});
    },
    [write],
  );

  return {
    isScanning,
    startScan,
    stopScan,
    scannedPeripherals,
    connectedPeripherals,
    retrieveServices,
    characteristicValues,
    notifiedCharacteristic,
    handlePressNotification,
    handlePressRead,
    handlePressWrite,
    connect,
    disconnect,
  };
};
