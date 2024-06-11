import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/HomeScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import BleScanScreen from './screens/BleScanScreen';
import BleManageScreen from './screens/BleManageScreen';
import {BleProvider} from './providers/BleProvider';
import {MainTabParams, RootStackParams} from '@/router.d';
import FindDeviceScreen from './screens/Wifi/FindDeviceScreen';
import WifiScreen from './screens/Wifi/WifiScreen';
import PairingScreen from './screens/Wifi/PairingScreen';

const Stack = createNativeStackNavigator<RootStackParams>();
const BleStack = createNativeStackNavigator();
const DeviceRegistrationStack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator<MainTabParams>();

const Ble = () => {
  return (
    <BleProvider>
      <BleStack.Navigator>
        <BleStack.Screen name="BleScan" component={BleScanScreen} />
        <BleStack.Screen name="BleManage" component={BleManageScreen} />
      </BleStack.Navigator>
    </BleProvider>
  );
};

const DeviceRegistration = () => {
  return (
    <BleProvider>
      <DeviceRegistrationStack.Navigator>
        <DeviceRegistrationStack.Screen
          name="FindDevice"
          component={FindDeviceScreen}
        />
        <DeviceRegistrationStack.Screen name="Wifi" component={WifiScreen} />
        <DeviceRegistrationStack.Screen
          name="Pairing"
          component={PairingScreen}
        />
      </DeviceRegistrationStack.Navigator>
    </BleProvider>
  );
};

const MainTab = () => {
  return (
    <BottomTab.Navigator screenOptions={{headerShown: false}}>
      <BottomTab.Screen name="Home" component={HomeScreen} />
      <BottomTab.Screen name="Settings" component={SettingsScreen} />
    </BottomTab.Navigator>
  );
};

const Router = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTab" component={MainTab} />
      <Stack.Screen name="Ble" component={Ble} />
      <Stack.Screen name="DeviceRegistration" component={DeviceRegistration} />
    </Stack.Navigator>
  );
};

export default Router;
