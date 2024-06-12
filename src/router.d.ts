export type RootStackParams = {
  MainTab: undefined;
  BleScan: undefined;
  BleManage: undefined;
  DeviceRegistration: undefined;
  ScaleDeviceDetail: {
    device_id: string;
  };
};

export type MainTabParams = {
  MyDevice: undefined;
  Setting: undefined;
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
