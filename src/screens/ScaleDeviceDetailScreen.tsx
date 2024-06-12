import {
  curveBasis,
  line,
  scaleLinear,
  scalePoint,
  scaleTime,
  scaleUtc,
} from 'd3';
import {
  SimpleScaleDeviceValue,
  getScaleDeviceValues,
} from '@/apis/supabase/scaleDeviceValues';
import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Canvas, Circle, Line, Path, Skia} from '@shopify/react-native-skia';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import dayjs from 'dayjs';

interface ScaleDeviceDetailScreen
  extends NativeStackScreenProps<RootStackParams, 'ScaleDeviceDetail'> {}

const ScaleDeviceDetailScreen = ({
  route: {
    params: {device_id},
  },
}: ScaleDeviceDetailScreen) => {
  const [scaleValues, setScaleValues] = useState<SimpleScaleDeviceValue[]>([]);
  useEffect(() => {
    getScaleDeviceValues(device_id).then(setScaleValues);
  }, [device_id]);

  // scaleValues.forEach(v => console.log(dayjs(v.created_at).toDate()));

  const startOfDay = dayjs().startOf('day').toDate();
  console.log(dayjs().startOf('day').toDate());
  const endOfDay = dayjs().endOf('day').toDate();
  const x = scaleUtc().domain([startOfDay, endOfDay]).range([0, 400]);
  const y = scaleLinear().domain([-100, 1000]).range([400, 0]);

  const curvedLine = line<SimpleScaleDeviceValue>()
    .x(v => x(dayjs(v.created_at).toDate()))
    .y(v => y(v.value))
    .curve(curveBasis)(scaleValues);
  if (!curvedLine) return;
  const linePath = Skia.Path.MakeFromSVGString(curvedLine);
  if (!linePath) return;

  return (
    <View style={{flex: 1}}>
      <Canvas style={{width: 400, height: 400}}>
        <Path path={linePath} color={'#000'} style={'stroke'} strokeWidth={1} />
      </Canvas>
    </View>
  );
};

export default ScaleDeviceDetailScreen;
