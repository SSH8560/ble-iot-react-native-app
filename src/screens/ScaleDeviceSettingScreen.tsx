import Header from '@/components/Header';
import useBLE from '@/hooks/useBLE';
import useScaleBLE from '@/hooks/useScaleBLE';
import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {disconnect} from 'react-native-wifi-reborn';

interface ScaleDeviceSettingScreenProps
  extends NativeStackScreenProps<RootStackParams, 'ScaleDeviceSetting'> {}

const ScaleDeviceSettingScreen = ({
  navigation,
  route: {
    params: {device},
  },
}: ScaleDeviceSettingScreenProps) => {
  const {isConnected, scaleValue, connectDevice, disconnectDevice} =
    useScaleBLE(device.peripheral_id);

  return (
    <View style={{flex: 1, gap: 16}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
        }}>
        <View style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
          <TouchableOpacity>
            <Icon name="chevron-left" size={28} />
          </TouchableOpacity>
          <Text style={{fontSize: 20}}>
            {device.device_name ?? device.peripheral_id}
          </Text>
        </View>
        {isConnected ? (
          <TouchableOpacity onPress={() => disconnectDevice()}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>연결해제</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => connectDevice()}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>연결하기</Text>
          </TouchableOpacity>
        )}
      </View>
      {isConnected ? (
        <View>
          <Text style={{color: '#000'}}>{scaleValue}</Text>
          <Button title="영점 조정" />
          <Button title="계수 조절" />
        </View>
      ) : (
        <View>
          <LottieView
            source={require('@/assets/lotties/loading.json')}
            style={{flex: 1}}
            autoPlay
            loop
          />
          <Text style={{textAlign: 'center', fontSize: 20, fontWeight: '700'}}>
            기기와 연결 중 입니다.
          </Text>
        </View>
      )}
    </View>
  );
};

export default ScaleDeviceSettingScreen;
