import {useBLEManager} from '@/providers/BLEProvider';
import useBLEUUIDs from './useBLEUUIDs';

const useBLERegistration = () => {
  const bleManager = useBLEManager();
  const {settingServiceUUID} = useBLEUUIDs();

  const startScanDevice = async () => {
    await bleManager.startScan([settingServiceUUID], 5);
  };
  const stopScanDevice = async () => {
    await bleManager.stopScan();
  };
  const connectDevice = async (peripheralId: string) => {
    try {
      await bleManager.connect(peripheralId);
      await bleManager.retrieveServices(peripheralId);
    } catch (e) {
      throw e;
    }
  };

  return {
    isScanning: bleManager.isScanning,
    deviceList: Array.from(bleManager.scannedPeripherals.values()),
    startScanDevice,
    stopScanDevice,
    connectDevice,
  };
};

export default useBLERegistration;
