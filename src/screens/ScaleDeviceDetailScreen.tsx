import {curveBasis, line, scaleLinear, scaleUtc} from 'd3';
import {
  SimpleScaleDeviceValue,
  getScaleDeviceValues,
} from '@/apis/supabase/scaleDeviceValues';
import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Canvas, Path, Skia, Text, useFont} from '@shopify/react-native-skia';
import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import dayjs from 'dayjs';
import ScaleLineChart from '@/components/ScaleLineChart';

interface ScaleDeviceDetailScreenProps
  extends NativeStackScreenProps<RootStackParams, 'ScaleDeviceDetail'> {}

const ScaleDeviceDetailScreen = ({
  route: {
    params: {device_id},
  },
}: ScaleDeviceDetailScreenProps) => {
  const [scaleValues, setScaleValues] = useState<SimpleScaleDeviceValue[]>([]);

  useEffect(() => {
    getScaleDeviceValues(device_id, {date: new Date()}).then(setScaleValues);
  }, [device_id]);

  return (
    <View style={{width: '100%', height: 500}}>
      <ScaleLineChart data={scaleValues} yDomain={[-100, 500]} />
    </View>
  );
};

export default ScaleDeviceDetailScreen;
