export type RootStackParams = {
  MainTab: undefined;
  BleScan: undefined;
  BleManage: undefined;
  DeviceRegistration: undefined;
};

export type MainTabParams = {
  Home: undefined;
};

export type DeviceRegistrationParams = {
  FindDevice: undefined;
  Wifi: {
    peripheralId: string;
  };
  Pairing: {
    peripheralId: string;
    wifiSsid: string;
    wifiPassword: string;
  };
};
