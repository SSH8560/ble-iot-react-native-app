import BleManager, {Peripheral} from 'react-native-ble-manager';
import useUUIDs from './useUUIDs';
import {bytesToString, stringToBytes} from '@/libs/utils';
import {BleException} from '@/libs/errors';
import {useBLEContext} from '@/providers/BLEProvider';

interface useBLESettingServiceProps {
  peripheralId: string;
}

const useBLESettingService = ({peripheralId}: useBLESettingServiceProps) => {
  const {handlerMap} = useBLEContext();
  const {
    settingServiceUUID,
    wifiCredentialCharacteristicUUID,
    connectionCharacteristicUUID,
    deviceInfoCharacteristicUUID,
  } = useUUIDs();
  const readWifiCredential = async () => {
    try {
      const bytes = await BleManager.read(
        peripheralId,
        settingServiceUUID,
        wifiCredentialCharacteristicUUID,
      );

      const [wifiUUID, wifiPassword] = bytesToString(bytes).split(',');
      return {wifiUUID, wifiPassword};
    } catch (e) {
      throw new BleException('에러가 발생했습니다');
    }
  };
  const writeWifiCredential = async ({
    ssid,
    password,
  }: {
    ssid: string;
    password?: string;
  }) => {
    try {
      await BleManager.write(
        peripheralId,
        settingServiceUUID,
        wifiCredentialCharacteristicUUID,
        stringToBytes(`${ssid},${password}`),
      );
    } catch (e) {
      throw new BleException('에러 발생');
    }
  };
  const startNotifyWifiCredential = async (
    onNotify: (ssid, password) => void,
  ) => {
    try {
      await BleManager.startNotification(peripheralId, ser);
      use;
    } catch (e) {}
  };
  const stopNotifyWifiCredential = async () => {};
  const readConnection = () => {};
  const notifyConnection = () => {};
  const readDeviceInfo = () => {};

  return {readWifiCredential, writeWifiCredential};
};

export default useBLESettingService;
