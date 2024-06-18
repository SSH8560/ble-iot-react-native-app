import {UserDevice} from './apis/supabase/userDevices';

export type RootStackParams = {
  Splash: undefined;
  SignIn: undefined;
  MainTab: undefined;
  BleScan: undefined;
  BleManage: undefined;
  DeviceRegistration: undefined;
  ScaleDeviceDetail: {
    device: UserDevice;
  };
  ScaleDeviceSetting: {
    device: UserDevice;
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
