import React from 'react';
import {View} from 'react-native';
import BleManager from 'react-native-ble-manager';
interface useSettingBLEProps {}

const useSettingBLE = ({}: useSettingBLEProps) => {
  const readDeviceInfo = async (peripheralId: string) => {
    const data = await BleManager.read(
      peripheralId,
      SERVICE_UUIDS.SETTING_SERVICE_UUD,
      CHARACTERISTIC_UUIDS.SETTING_CHARACTERISTIC_UUID,
    );
    const [id, type] = String.fromCharCode(...data).split(',');
    return {id, type};
  };
  const sendWiFiCredentials = async ({
    peripheralId,
    wifiPassword,
    wifiSsid,
  }: {
    peripheralId: string;
    wifiSsid: string;
    wifiPassword: string;
  }) => {
    write({
      peripheralId,
      serviceUUID: SERVICE_UUIDS.SETTING_SERVICE_UUD,
      characteristicUUID: CHARACTERISTIC_UUIDS.SETTING_CHARACTERISTIC_UUID,
      data: Array.from(Buffer.from(`${wifiSsid},${wifiPassword}`)),
    });
  };
  const startNotificateSettingStatus = async (
    peripheralId: string,
    onUpdate: (bytes: number[]) => void,
  ) => {
    const serviceUUID = SERVICE_UUIDS.SETTING_SERVICE_UUD;
    const characteristicUUID = CHARACTERISTIC_UUIDS.SETTING_CHARACTERISTIC_UUID;

    await BleManager.startNotification(
      peripheralId,
      serviceUUID,
      characteristicUUID,
    );
    console.log('1');
    handlerMapRef.current.set(
      createKey({
        peripheral: peripheralId,
        service: serviceUUID,
        characteristic: characteristicUUID,
      }),
      onUpdate,
    );
  };
};

export default useSettingBLE;
