import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainTabParams, RootStackParams} from '@/router.d';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {UserDevice, getUserDevices} from '@/apis/supabase/userDevices';
import Header from '@/components/Header';
import DeviceList from '@/screens/MyDeviceScreen/components/DeviceList';
import {Text} from 'react-native';
import AddDeviceButton from './components/AddDeviceButton';

interface HomeScreenProps
  extends CompositeScreenProps<
    NativeStackScreenProps<RootStackParams>,
    BottomTabScreenProps<MainTabParams>
  > {}

const MyDeviceScreen = ({navigation}: HomeScreenProps) => {
  const [devices, setDevices] = useState<UserDevice[] | null>(null);

  useEffect(() => {
    getUserDevices().then(setDevices);
  }, []);

  return (
    <View style={{flex: 1}}>
      <Header
        title=""
        right={<AddDeviceButton />}
        onPressRight={() => navigation.navigate('DeviceRegistration')}
      />
      {!devices ? (
        <View>
          <Text style={{color: '#000'}}>로딩 중</Text>
        </View>
      ) : (
        <>
          <DeviceList
            devices={devices}
            onPressDeviceItem={device =>
              navigation.navigate('ScaleDeviceDetail', {device})
            }
          />
        </>
      )}
    </View>
  );
};

export default MyDeviceScreen;
