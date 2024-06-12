import React, {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainTabParams, RootStackParams} from '@/router.d';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import OauthButton from '@/components/OauthButton';
import {kakaoSignIn} from '@/apis/supabase/auth';
import {UserDevice, getUserDevices} from '@/apis/supabase/userDevices';

interface HomeScreenProps
  extends CompositeScreenProps<
    NativeStackScreenProps<RootStackParams>,
    BottomTabScreenProps<MainTabParams>
  > {}

const MyDeviceScreen = ({navigation}: HomeScreenProps) => {
  const [devices, setDevices] = useState<UserDevice[]>([]);

  useEffect(() => {
    getUserDevices().then(setDevices);
  }, []);

  const renderDevice: ListRenderItem<UserDevice> = ({item: {device_id}}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ScaleDeviceDetail', {device_id})}>
        <Text>{device_id}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View style={{gap: 16, padding: 16}}>
        <Button
          title="기기 등록"
          onPress={() => navigation.navigate('DeviceRegistration')}
        />
        <FlatList data={devices} renderItem={renderDevice} />
        <OauthButton variant="kakao" onPress={() => kakaoSignIn()} />
      </View>
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
