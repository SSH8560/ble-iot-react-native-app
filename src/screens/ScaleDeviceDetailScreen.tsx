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
import React, {useEffect, useMemo, useState} from 'react';
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
  const [canvasRect, setCanvasRect] = useState<{
    canvasWidth: number;
    canvasHeight: number;
  }>({
    canvasHeight: 0,
    canvasWidth: 0,
  });
  const {canvasHeight, canvasWidth} = canvasRect;
  const font = useFont(require('@/assets/fonts/NanumSquareR.ttf'), 18);

  useEffect(() => {
    getScaleDeviceValues(device_id).then(setScaleValues);
  }, [device_id]);

  const startOfDay = dayjs().startOf('day').toDate();
  const endOfDay = dayjs().add(1, 'day').startOf('day').toDate();
  const x = scaleUtc().domain([startOfDay, endOfDay]).range([0, canvasWidth]);
  const y = scaleLinear().domain([-100, 1000]).range([canvasHeight, 0]);

  const xAxisData = useMemo(
    () =>
      Array.from({length: 11}, (_, i) => i).map(i => {
        const evenHour = (i + 1) * 2;
        return {
          value: dayjs(startOfDay).hour(evenHour).toDate(),
          label: `${evenHour}`,
        };
      }),
    [startOfDay],
  );

  const curvedLine = line<SimpleScaleDeviceValue>()
    .x(v => x(dayjs(v.created_at).toDate()))
    .y(v => y(v.value))
    .curve(curveBasis)(scaleValues);
  if (!curvedLine) return null;

  const linePath = Skia.Path.MakeFromSVGString(curvedLine);
  if (!linePath) return null;

  return (
    <View
      style={{flex: 1, alignItems: 'center'}}
      onLayout={event => {
        const {width, height} = event.nativeEvent.layout;
        setCanvasRect({canvasHeight: height, canvasWidth: width});
      }}>
      {canvasWidth > 0 && canvasHeight > 0 && (
        <Canvas style={{width: canvasWidth, height: canvasHeight}}>
          <Path
            path={linePath}
            color={'#000'}
            style={'stroke'}
            strokeWidth={1}
          />
          {xAxisData.map(({label, value}) => (
            <Text
              key={label}
              x={x(value) - font!.measureText(label).width / 2}
              y={canvasHeight * 0.99}
              font={font}
              text={label}
              color="#000"
            />
          ))}
        </Canvas>
      )}
    </View>
  );
};

export default ScaleDeviceDetailScreen;
