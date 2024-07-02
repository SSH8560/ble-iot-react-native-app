import BleManager from 'react-native-ble-manager';
import {useBLEContext} from '@/providers/BLEProvider';
import useBLEUUIDs from './useBLEUUIDs';
import {bytesToNumber, createHandlerKey, stringToBytes} from '@/libs/utils';

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
  const {handlerMap} = useBLEContext();

  const readWeight = async () => {
    return bytesToNumber(
      await BleManager.read(
        peripheralId,
        loadCellServiceUUID,
        weightCharacteristic,
      ),
    );
  };
  const notifyWeight = async (onNotify: (weight: number) => void) => {
    await BleManager.startNotification(
      peripheralId,
      loadCellServiceUUID,
      weightCharacteristic,
    );
    handlerMap.set(
      createHandlerKey({
        peripheral: peripheralId,
        service: loadCellServiceUUID,
        characteristic: weightCharacteristic,
      }),
      bytes => onNotify(bytesToNumber(bytes)),
    );
  };
  const tare = async () => {
    await BleManager.read(
      peripheralId,
      loadCellServiceUUID,
      tareCharacteristic,
    );
  };
  const readCalibration = async () => {
    return bytesToNumber(
      await BleManager.read(
        peripheralId,
        loadCellServiceUUID,
        calibrationCharacteristic,
      ),
    );
  };
  const writeCalibration = async (calibration: number) => {
    await BleManager.write(
      peripheralId,
      loadCellServiceUUID,
      calibrationCharacteristic,
      stringToBytes(String(calibration)),
    );
  };
  const notifyCalibration = async (onNotify: (calibration: number) => void) => {
    await BleManager.startNotification(
      peripheralId,
      loadCellServiceUUID,
      calibrationCharacteristic,
    );
    handlerMap.set(
      createHandlerKey({
        peripheral: peripheralId,
        service: loadCellServiceUUID,
        characteristic: calibrationCharacteristic,
      }),

      bytes => onNotify(bytesToNumber(bytes)),
    );
  };

  return {
    readWeight,
    notifyWeight,
    tare,
    readCalibration,
    writeCalibration,
    notifyCalibration,
  };
};

export default useBLELoadCellService;
