import {useEffect, useState, useCallback} from 'react';
import useBLE from '@/hooks/useBLE';
import {PeripheralInfo} from 'react-native-ble-manager';
import {produce} from 'immer';
import {createKey} from '@/libs/utils';

export const useBLEDevice = (peripheral_id: string) => {
  const {
    startScan,
    stopScan,
    scannedPeripherals,
    connectedPeripherals,
    startNotification,
    stopNotification,
    retrieveServices,
    connect,
    read,
    disconnect,
  } = useBLE();

  const [characteristicValues, setCharacteristicValues] = useState<{
    [key: string]: number[] | undefined;
  }>({});
  const [notifiedCharacteristic, setNotifiedCharacteristic] = useState<
    string[]
  >([]);
  const [peripheralInfo, setPeripheralInfo] = useState<PeripheralInfo | null>(
    null,
  );

  const peripheralId = peripheral_id;
  const isScanned = scannedPeripherals.has(peripheral_id);
  const isConnected = connectedPeripherals.includes(peripheral_id);

  useEffect(() => {
    if (!isConnected && !isScanned) {
      startScan(10);
    } else {
      stopScan();
    }
    if (!isScanned && isConnected) {
      connect(peripheral_id);
    }
  }, [isScanned, isConnected, startScan, stopScan, connect, peripheral_id]);

  useEffect(() => {
    if (isConnected) {
      retrieveServices(peripheral_id).then(setPeripheralInfo);
    }
  }, [isConnected, retrieveServices, peripheral_id]);

  const handlePressNotification = useCallback(
    ({
      notified,
      serviceUUID,
      characteristicUUID,
    }: {
      notified: boolean;
      serviceUUID: string;
      characteristicUUID: string;
    }) => {
      const key = createKey(serviceUUID, characteristicUUID);
      if (notified) {
        setNotifiedCharacteristic(prevState =>
          prevState.filter(notifiedKey => notifiedKey !== key),
        );
        stopNotification({
          peripheralId,
          serviceUUID,
          characteristicUUID,
        });
      } else {
        setNotifiedCharacteristic(prevState => [...prevState, key]);
        startNotification({
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
      }
    },
    [peripheralId, startNotification, stopNotification],
  );

  const handlePressRead = useCallback(
    async ({
      serviceUUID,
      characteristicUUID,
    }: {
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
    },
    [peripheralId, read],
  );

  return {
    isScanned,
    isConnected,
    peripheralInfo,
    characteristicValues,
    notifiedCharacteristic,
    handlePressNotification,
    handlePressRead,
    connect,
    disconnect,
  };
};
