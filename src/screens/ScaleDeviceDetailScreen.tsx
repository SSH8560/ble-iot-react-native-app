import {getScaleDeviceValues} from '@/apis/supabase/scaleDeviceValues';
import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {View} from 'react-native';

interface ScaleDeviceDetailScreen
  extends NativeStackScreenProps<RootStackParams, 'ScaleDeviceDetail'> {}

const ScaleDeviceDetailScreen = ({
  route: {
    params: {device_id},
  },
}: ScaleDeviceDetailScreen) => {
  useEffect(() => {
    getScaleDeviceValues(device_id).then(console.log);
  }, []);
  return <View></View>;
};

export default ScaleDeviceDetailScreen;
