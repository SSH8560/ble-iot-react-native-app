import {useBLECharacteristic} from '@/providers/BLEProvider';
import useBLEUUIDs from './useBLEUUIDs';
import {bytesToNumber, stringToBytes} from '@/libs/utils';
import {useCallback, useState} from 'react';

interface useBLELoadCellProps {
  peripheralId: string;
}

const useBLELoadCellService = ({peripheralId}: useBLELoadCellProps) => {
  const {
    loadCellServiceUUID,
    weightCharacteristic,
    tareCharacteristic,
    calibrationCharacteristic,
  } = useBLEUUIDs();
  const {read, write, startNotification, stopNotification} =
    useBLECharacteristic();
  const [weight, setWeight] = useState<string>('');
  const [calibration, setCalibration] = useState<string>('');
  const [isNotifyingWeight, setIsNotifyingWeight] = useState<boolean>(false);

  const readWeight = async () => {
    const bytes = await read({
      peripheralId,
      serviceUUID: loadCellServiceUUID,
      characteristicUUID: weightCharacteristic,
    });
    const recievedWeight = bytesToNumber(bytes).toFixed(2);
    setWeight(recievedWeight);
    return recievedWeight;
  };
  const startNotifyWeight = useCallback(
    async (onNotify?: (weight: number) => void) => {
      await startNotification({
        peripheralId,
        serviceUUID: loadCellServiceUUID,
        characteristicUUID: weightCharacteristic,
        onNotify: bytes => {
          const recievedWeight = bytesToNumber(bytes);
          console.log(recievedWeight);
          setWeight(recievedWeight.toFixed(2));
          onNotify && onNotify(recievedWeight);
        },
      });
      setIsNotifyingWeight(true);
    },
    [],
  );
  const stopNotifyWeight = async () => {
    await stopNotification({
      peripheralId,
      serviceUUID: loadCellServiceUUID,
      characteristicUUID: weightCharacteristic,
    });
    setIsNotifyingWeight(false);
  };
  const tare = async () => {
    await read({
      peripheralId,
      serviceUUID: loadCellServiceUUID,
      characteristicUUID: tareCharacteristic,
    });
  };
  const readCalibration = async () => {
    return bytesToNumber(
      await read({
        peripheralId,
        serviceUUID: loadCellServiceUUID,
        characteristicUUID: calibrationCharacteristic,
      }),
    );
  };
  const writeCalibration = async (newCalibration: number) => {
    await write({
      peripheralId,
      serviceUUID: loadCellServiceUUID,
      characteristicUUID: calibrationCharacteristic,
      value: stringToBytes(String(newCalibration)),
    });
  };
  const startNotifyCalibration = async (
    onNotify?: (calibration: number) => void,
  ) => {
    await startNotification({
      peripheralId,
      serviceUUID: loadCellServiceUUID,
      characteristicUUID: calibrationCharacteristic,
      onNotify: bytes => {
        onNotify && onNotify(bytesToNumber(bytes));
      },
    });
  };
  const stopNotifyCalibration = async () => {
    await stopNotification({
      peripheralId,
      serviceUUID: loadCellServiceUUID,
      characteristicUUID: calibrationCharacteristic,
    });
  };

  return {
    weight,
    isNotifyingWeight,
    readWeight,
    startNotifyWeight,
    stopNotifyWeight,
    tare,
    calibration,
    readCalibration,
    writeCalibration,
    startNotifyCalibration,
    stopNotifyCalibration,
  };
};

export default useBLELoadCellService;
