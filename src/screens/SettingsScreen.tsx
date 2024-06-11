import useLifeCycleLogger from '@/hooks/useLifeCycleLogger';
import {RootStackParams, MainTabParams} from '@/router.d';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {Button, View} from 'react-native';

interface SettingsScreenProps
  extends CompositeScreenProps<
    NativeStackScreenProps<RootStackParams>,
    BottomTabScreenProps<MainTabParams>
  > {}

const SettingsScreen = ({navigation}: SettingsScreenProps) => {
  useLifeCycleLogger('Settings');

  return (
    <View>
      <Button
        title="BLE 기기 관리"
        onPress={() => navigation.navigate('Ble')}
      />
    </View>
  );
};

export default SettingsScreen;
