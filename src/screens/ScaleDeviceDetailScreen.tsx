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
import {
  Canvas,
  Circle,
  Line,
  Path,
  Skia,
  Text,
  useFont,
} from '@shopify/react-native-skia';
import React, {useEffect, useState} from 'react';
import {View, useWindowDimensions} from 'react-native';
import dayjs from 'dayjs';

interface ScaleDeviceDetailScreen
  extends NativeStackScreenProps<RootStackParams, 'ScaleDeviceDetail'> {}

const ScaleDeviceDetailScreen = ({
  route: {
    params: {device_id},
  },
}: ScaleDeviceDetailScreen) => {
  const {width} = useWindowDimensions();
  const [scaleValues, setScaleValues] = useState<SimpleScaleDeviceValue[]>([]);
  const font = useFont(require('@/assets/fonts/NanumSquareR.ttf'), 18);
  useEffect(() => {
    getScaleDeviceValues(device_id).then(setScaleValues);
  }, [device_id]);

  const startOfDay = dayjs().startOf('day').toDate();
  const endOfDay = dayjs().add(1, 'day').startOf('day').toDate();
  const x = scaleUtc().domain([startOfDay, endOfDay]).range([0, width]);
  const y = scaleLinear().domain([-100, 1000]).range([400, 0]);

  const curvedLine = line<SimpleScaleDeviceValue>()
    .x(v => x(dayjs(v.created_at).toDate()))
    .y(v => y(v.value))
    .curve(curveBasis)(scaleValues);
  if (!curvedLine) return;
  const linePath = Skia.Path.MakeFromSVGString(curvedLine);
  if (!linePath) return;

  const xAxisData = Array.from({length: 11}, (_, i) => i).map(i => {
    const evenHour = (i + 1) * 2;

    return {
      value: dayjs(startOfDay).hour(evenHour).toDate(),
      label: `${evenHour}`,
    };
  });

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Canvas style={{width, height: 400}}>
        <Path path={linePath} color={'#000'} style={'stroke'} strokeWidth={1} />
        {xAxisData.map(({label, value}) => (
          <Text
            key={label}
            x={x(value) - font!.measureText(label).width / 2}
            y={400 * 0.99}
            font={font}
            text={label}
            color="#000"
          />
        ))}
      </Canvas>
    </View>
  );
};

export default ScaleDeviceDetailScreen;
