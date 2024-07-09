import {SimpleScaleDeviceValue} from '@/apis/supabase/scaleDeviceValues';
import {useFont} from '@shopify/react-native-skia';
import {addDays, endOfDay, startOfDay} from 'date-fns';
import React from 'react';
import {StyleSheet} from 'react-native';
import {CartesianChart, Line} from 'victory-native';

interface ScaleLineChartProps {
  data: SimpleScaleDeviceValue[];
  date: Date;
}

const ScaleLineChart = ({data, date}: ScaleLineChartProps) => {
  const font = useFont(require('@/assets/fonts/NanumSquareR.ttf'), 18);

  return (
    <CartesianChart
      data={data.map(({value, created_at}) => ({
        value,
        created_at: created_at.getTime(),
      }))}
      xKey="created_at"
      yKeys={['value']}
      domain={{
        x: [startOfDay(date).getTime(), startOfDay(addDays(date, 1)).getTime()],
        y: [-100, 500],
      }}
      axisOptions={{
        font,

        formatXLabel: value => {
          console.log(value);
          return new Date(value).getHours().toString();
        },
      }}>
      {({points}) => (
        <Line
          points={points.value}
          color="red"
          strokeWidth={3}
          animate={{type: 'timing', duration: 300}}
          connectMissingData
        />
      )}
    </CartesianChart>
  );
};

export default ScaleLineChart;
