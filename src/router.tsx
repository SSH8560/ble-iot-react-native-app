import React, {useCallback} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import MyDeviceScreen from '@/screens/MyDeviceScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import {BLEProvider} from './providers/BLEProvider';
import {
  DeviceRegistrationParams,
  MainTabParams,
  RootStackParams,
} from '@/router.d';
import FindDeviceScreen from './screens/Device/Registration/FindDeviceScreen';
import WifiScreen from './screens/Device/Registration/WifiScreen';
import PairingScreen from './screens/Device/Registration/PairingScreen';
import ScaleDeviceDetailScreen from '@/screens/Device/Scale/ScaleDeviceDetailScreen';
import ScaleDeviceSettingScreen from '@/screens/Device/Scale/ScaleDeviceSettingScreen';
import SpalshScreen from './screens/SplashScreen';
import MainBottomTabBar from './components/MainBottomTabBar';
import SignInScreen from './screens/SignInScreen';

const Stack = createNativeStackNavigator<RootStackParams>();
const DeviceRegistrationStack =
  createNativeStackNavigator<DeviceRegistrationParams>();
const BottomTab = createBottomTabNavigator<MainTabParams>();

const DeviceRegistration = () => {
  return (
    <BLEProvider>
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
    </BLEProvider>
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
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="MainTab" component={MainTab} />
      <Stack.Screen name="DeviceRegistration" component={DeviceRegistration} />
      <Stack.Screen
        name="ScaleDeviceDetail"
        component={ScaleDeviceDetailScreen}
      />
      <Stack.Screen
        name="ScaleDeviceSetting"
        component={ScaleDeviceSettingScreen}
      />
    </Stack.Navigator>
  );
};

export default Router;
