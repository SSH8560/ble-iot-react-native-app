import {useBLECharacteristic} from '@/providers/BLEProvider';
import useBLEUUIDs from './useBLEUUIDs';
import {bytesToString} from '@/libs/utils';
import {useState} from 'react';

interface useBLEDistanceServiceProps {
  peripheralId: string;
}

const useBLEDistanceService = ({peripheralId}: useBLEDistanceServiceProps) => {
  const {
    distanceServiceUUID,
    distanceCharacteristicUUID,
    distanceChangeThresholdCharacteristicUUID,
  } = useBLEUUIDs();
  const {read, write, startNotification, stopNotification} =
    useBLECharacteristic();
  const [distance, setDistance] = useState<number | null>(null);
  const [isNotifyingDist, setIsNotifyingDist] = useState<boolean>(false);

  const startNotifyDistance = async (onNotify?: (distance: number) => void) => {
    await startNotification({
      peripheralId,
      serviceUUID: distanceServiceUUID,
      characteristicUUID: distanceCharacteristicUUID,
      onNotify: bytes => {
        const recievedDist = +bytesToString(bytes);
        onNotify && onNotify(recievedDist);
        setDistance(recievedDist);
      },
    });
    setIsNotifyingDist(true);
  };
  const stopNotifyDistance = async () => {
    await stopNotification({
      peripheralId,
      serviceUUID: distanceServiceUUID,
      characteristicUUID: distanceCharacteristicUUID,
    });
    setIsNotifyingDist(false);
  };
  const readDistance = async () => {
    const recievedDist = +bytesToString(
      await read({
        peripheralId,
        serviceUUID: distanceServiceUUID,
        characteristicUUID: distanceCharacteristicUUID,
      }),
    );
    setDistance(recievedDist);
    return recievedDist;
  };

  return {
    distance,
    isNotifyingDist,
    startNotifyDistance,
    stopNotifyDistance,
    readDistance,
  };
};

export default useBLEDistanceService;
