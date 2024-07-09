import React, {Suspense, useEffect, useState} from 'react';
import {View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainTabParams, RootStackParams} from '@/router.d';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {getUserDevices} from '@/apis/supabase/userDevices';
import Header from '@/components/Header';
import DeviceList from '@/components/ble/list/DeviceList';
import AddDeviceButton from '../components/ble/button/AddDeviceButton';
import LoadingIndicator from '@/components/LoadingIndicator';
import {useSuspenseQuery} from '@tanstack/react-query';

interface HomeScreenProps
  extends CompositeScreenProps<
    NativeStackScreenProps<RootStackParams>,
    BottomTabScreenProps<MainTabParams>
  > {}

const MyDeviceScreen = ({navigation}: HomeScreenProps) => {
  const {data} = useSuspenseQuery({
    queryKey: ['userDevice'],
    async queryFn() {
      return await getUserDevices();
    },
  });

  return (
    <View style={{flex: 1}}>
      <Header
        title=""
        right={<AddDeviceButton />}
        onPressRight={() => navigation.navigate('DeviceRegistration')}
      />
      <Suspense fallback={<LoadingIndicator />}>
        <DeviceList
          devices={data}
          onPressDeviceItem={device =>
            navigation.navigate('ScaleDeviceDetail', {device})
          }
        />
      </Suspense>
    </View>
  );
};

export default MyDeviceScreen;
