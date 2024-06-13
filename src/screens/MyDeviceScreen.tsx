import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainTabParams, RootStackParams} from '@/router.d';
import {CompositeScreenProps, useTheme} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {UserDevice, getUserDevices} from '@/apis/supabase/userDevices';
import Header from '@/components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import DeviceList from '@/components/DeviceList';
import {Text} from 'react-native';
import {color} from 'd3';

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
        right={<AddDeviceIcon />}
        onPressRight={() => navigation.navigate('DeviceRegistration')}
      />
      {!devices ? (
        <View>
          <Text style={{color: '#000'}}>로딩 중</Text>
        </View>
      ) : (
        <DeviceList
          devices={devices}
          onPressDeviceItem={({device_id}) =>
            navigation.navigate('ScaleDeviceDetail', {device_id})
          }
        />
      )}
    </View>
  );
};

const AddDeviceIcon = () => {
  const {colors} = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primary,
        borderRadius: 100,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Icon name="add" size={24} color={colors.background} />
    </View>
  );
};

const style = StyleSheet.create({
  textInputPlaceholder: {},
  textInput: {
    borderWidth: 0.5,
    borderColor: 'black',
    height: 60,
    paddingHorizontal: 16,
    color: '#000',
  },
});

export default MyDeviceScreen;
