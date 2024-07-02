import BleManager from 'react-native-ble-manager';
import useBLEUUIDs from './useBLEUUIDs';
import {bytesToString, createHandlerKey, stringToBytes} from '@/libs/utils';
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
  } = useBLEUUIDs();
  const readWifiCredential = async () => {
    const bytes = await BleManager.read(
      peripheralId,
      settingServiceUUID,
      wifiCredentialCharacteristicUUID,
    );

    const [wifiUUID, wifiPassword] = bytesToString(bytes).split(',');
    return {wifiUUID, wifiPassword};
  };
  const writeWifiCredential = async ({
    ssid,
    password,
  }: {
    ssid: string;
    password?: string;
  }) => {
    await BleManager.write(
      peripheralId,
      settingServiceUUID,
      wifiCredentialCharacteristicUUID,
      stringToBytes(`${ssid},${password}`),
    );
  };
  const startNotifyWifiCredential = async (
    onNotify: (ssid: string, password: string) => void,
  ) => {
    await BleManager.startNotification(
      peripheralId,
      settingServiceUUID,
      wifiCredentialCharacteristicUUID,
    );
    handlerMap.set(
      createHandlerKey({
        peripheral: peripheralId,
        service: settingServiceUUID,
        characteristic: wifiCredentialCharacteristicUUID,
      }),
      bytes => {
        const [ssid, password] = bytesToString(bytes).split(',');
        onNotify(ssid, password);
      },
    );
  };
  const stopNotifyWifiCredential = async () => {
    await BleManager.stopNotification(
      peripheralId,
      settingServiceUUID,
      wifiCredentialCharacteristicUUID,
    );
  };
  const readConnection = async () => {
    return bytesToString(
      await BleManager.read(
        peripheralId,
        settingServiceUUID,
        connectionCharacteristicUUID,
      ),
    );
  };
  const notifyConnection = async (onNotify: (status: string) => void) => {
    await BleManager.startNotification(
      peripheralId,
      settingServiceUUID,
      connectionCharacteristicUUID,
    );
    handlerMap.set(
      createHandlerKey({
        peripheral: peripheralId,
        service: settingServiceUUID,
        characteristic: connectionCharacteristicUUID,
      }),
      bytes => {
        onNotify(bytesToString(bytes));
      },
    );
  };
  const readDeviceInfo = async () => {
    const [deviceUUID, deviceType] = bytesToString(
      await BleManager.read(
        peripheralId,
        settingServiceUUID,
        deviceInfoCharacteristicUUID,
      ),
    ).split(',');

    return {deviceUUID, deviceType};
  };

  return {
    readWifiCredential,
    writeWifiCredential,
    startNotifyWifiCredential,
    stopNotifyWifiCredential,
    readConnection,
    notifyConnection,
    readDeviceInfo,
  };
};

export default useBLESettingService;
