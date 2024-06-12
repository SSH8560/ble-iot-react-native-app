import {Peripheral, PeripheralInfo} from 'react-native-ble-manager';

type startNotificateSettingStatus = (
  peripheralId: string,
  onUpdate: (bytes: number[]) => void,
) => Promise<void>;

export interface BleContextType {
  isScanning: boolean;
  connectedPeripheral: string | null;
  scannedPeripherals: Map<string, Peripheral>;
  scanPeripheral: (duration: number) => Promise<void>;
  connect: (peripheralId: string) => Promise<void>;
  disconnect: (peripheralId: string) => Promise<void>;
  retrieveServices: (peripheralId: string) => Promise<PeripheralInfo>;
  stopNotification: (params: {
    peripheralId: string;
    serviceUUID: string;
    characteristicUUID: string;
  }) => Promise<void>;
  write: (params: {
    peripheralId: string;
    serviceUUID: string;
    characteristicUUID: string;
    data: number[];
  }) => Promise<void>;
  sendWiFiCredentials: ({
    peripheralId,
    wifiPassword,
    wifiSsid,
  }: {
    peripheralId: string;
    wifiSsid: string;
    wifiPassword: string;
  }) => Promise<void>;
  startNotificateSettingStatus: startNotificateSettingStatus;
  readDeviceId: (peripheralId: string) => Promise<string>;
}
