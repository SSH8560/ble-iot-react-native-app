import React, {useCallback} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import MyDeviceScreen from '@/screens/MyDeviceScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import {BleProvider} from './providers/BleProvider';
import {
  DeviceRegistrationParams,
  MainTabParams,
  RootStackParams,
} from '@/router.d';
import FindDeviceScreen from './screens/Wifi/FindDeviceScreen';
import WifiScreen from './screens/Wifi/WifiScreen';
import PairingScreen from './screens/Wifi/PairingScreen';
import ScaleDeviceDetailScreen from './screens/ScaleDeviceDetailScreen';
import SpalshScreen from './screens/SplashScreen';
import MainBottomTabBar from './components/MainBottomTabBar';

const Stack = createNativeStackNavigator<RootStackParams>();
const DeviceRegistrationStack =
  createNativeStackNavigator<DeviceRegistrationParams>();
const BottomTab = createBottomTabNavigator<MainTabParams>();

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
  const renderTabBar = useCallback(
    (props: BottomTabBarProps) => <MainBottomTabBar {...props} />,
    [],
  );

  return (
    <BottomTab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={renderTabBar}>
      <BottomTab.Screen name="MyDevice" component={MyDeviceScreen} />
      <BottomTab.Screen name="Setting" component={SettingsScreen} />
    </BottomTab.Navigator>
  );
};

const Router = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={SpalshScreen} />
      <Stack.Screen name="MainTab" component={MainTab} />
      <Stack.Screen name="DeviceRegistration" component={DeviceRegistration} />
      <Stack.Screen
        name="ScaleDeviceDetail"
        component={ScaleDeviceDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default Router;
