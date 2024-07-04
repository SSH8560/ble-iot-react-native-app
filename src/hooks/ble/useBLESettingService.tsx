import useBLEUUIDs from './useBLEUUIDs';
import {bytesToString, stringToBytes} from '@/libs/utils';
import {useBLECharacteristic} from '@/providers/BLEProvider';
import {useState} from 'react';

interface useBLESettingServiceProps {
  peripheralId: string;
}

const useBLESettingService = ({peripheralId}: useBLESettingServiceProps) => {
  const {
    settingServiceUUID,
    wifiCredentialCharacteristicUUID,
    connectionCharacteristicUUID,
    deviceInfoCharacteristicUUID,
  } = useBLEUUIDs();
  const {read, write, startNotification, stopNotification} =
    useBLECharacteristic();
  const [wifiCredential, setWifiCredential] = useState<{
    ssid: string;
    password: string;
  }>({ssid: '', password: ''});
  const [connection, setConnection] = useState<string>('');
  const [deviceInfo, setDeviceInfo] = useState<{
    uuid: string;
    type: string;
  }>({
    uuid: '',
    type: '',
  });
  const [isNotifyingWifiCredential, setIsNotifyingWifiCredential] =
    useState<boolean>(false);
  const [isNotifyingConnection, setIsNotifyingConnection] =
    useState<boolean>(false);

  const readWifiCredential = async () => {
    const bytes = await read({
      peripheralId,
      serviceUUID: settingServiceUUID,
      characteristicUUID: wifiCredentialCharacteristicUUID,
    });

    const [ssid, password] = bytesToString(bytes).split(',');
    setWifiCredential({
      ssid,
      password,
    });
    return {ssid, password};
  };
  const writeWifiCredential = async ({
    ssid,
    password,
  }: {
    ssid: string;
    password?: string;
  }) => {
    await write({
      peripheralId,
      serviceUUID: settingServiceUUID,
      characteristicUUID: wifiCredentialCharacteristicUUID,
      value: stringToBytes(`${ssid},${password}`),
    });
  };
  const startNotifyWifiCredential = async (
    onNotify?: (ssid: string, password: string) => void,
  ) => {
    await startNotification({
      peripheralId,
      serviceUUID: settingServiceUUID,
      characteristicUUID: wifiCredentialCharacteristicUUID,
      onNotify: bytes => {
        const [ssid, password] = bytesToString(bytes).split(',');
        onNotify && onNotify(ssid, password);
        setWifiCredential({ssid, password});
      },
    });
    setIsNotifyingWifiCredential(true);
  };
  const stopNotifyWifiCredential = async () => {
    await stopNotification({
      peripheralId,
      serviceUUID: settingServiceUUID,
      characteristicUUID: wifiCredentialCharacteristicUUID,
    });
    setIsNotifyingWifiCredential(false);
  };
  const readConnection = async () => {
    const bytes = await read({
      peripheralId,
      serviceUUID: settingServiceUUID,
      characteristicUUID: connectionCharacteristicUUID,
    });
    const recievedConnection = bytesToString(bytes);

    setConnection(recievedConnection);
    return recievedConnection;
  };
  const startNotifyConnection = async (onNotify?: (status: string) => void) => {
    await startNotification({
      peripheralId,
      serviceUUID: settingServiceUUID,
      characteristicUUID: connectionCharacteristicUUID,
      onNotify: bytes => {
        const recievedConnection = bytesToString(bytes);
        onNotify && onNotify(recievedConnection);
        setConnection(recievedConnection);
      },
    });
    setIsNotifyingConnection(true);
  };
  const stopNotifyConnection = async () => {
    await stopNotification({
      peripheralId,
      serviceUUID: settingServiceUUID,
      characteristicUUID: connectionCharacteristicUUID,
    });
    setIsNotifyingConnection(false);
  };
  const readDeviceInfo = async () => {
    const [uuid, type] = bytesToString(
      await read({
        peripheralId,
        serviceUUID: settingServiceUUID,
        characteristicUUID: deviceInfoCharacteristicUUID,
      }),
    ).split(',');

    setDeviceInfo({uuid, type});
    return {uuid, type};
  };

  return {
    wifiCredential,
    connection,
    deviceInfo,
    isNotifyingConnection,
    isNotifyingWifiCredential,
    readWifiCredential,
    writeWifiCredential,
    startNotifyWifiCredential,
    stopNotifyWifiCredential,
    readConnection,
    startNotifyConnection,
    stopNotifyConnection,
    readDeviceInfo,
  };
};

export default useBLESettingService;
