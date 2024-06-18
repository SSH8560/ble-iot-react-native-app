import useBLE from '@/hooks/useBLE';
import useScaleBLE from '@/hooks/useScaleBLE';
import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {Button, Text, View} from 'react-native';

interface ScaleDeviceSettingScreenProps
  extends NativeStackScreenProps<RootStackParams, 'ScaleDeviceSetting'> {}

const ScaleDeviceSettingScreen = ({
  navigation,
  route: {
    params: {device},
  },
}: ScaleDeviceSettingScreenProps) => {
  const {isConnected, scaleValue} = useScaleBLE(device.peripheral_id);

  return (
    <View style={{flex: 1, gap: 16}}>
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
