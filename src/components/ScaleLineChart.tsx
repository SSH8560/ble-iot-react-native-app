import {SimpleScaleDeviceValue} from '@/apis/supabase/scaleDeviceValues';
import {
  Canvas,
  DashPathEffect,
  Path,
  Skia,
  Text,
  useFont,
} from '@shopify/react-native-skia';
import {curveBasis, line, scaleLinear, scaleUtc} from 'd3';
import dayjs from 'dayjs';
import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';

interface ScaleLineChartProps {
  data: SimpleScaleDeviceValue[];
  xDomain: [Date, Date];
  yDomain: [number, number];
  yMargin?: number;
  yPadding?: number;
  xMargin?: number;
  xPadding?: number;
}

const ScaleLineChart = ({
  data,
  xDomain,
  yDomain,
  xMargin = 10,
  xPadding = 20,
  yMargin = 10,
  yPadding = 20,
}: ScaleLineChartProps) => {
  const [canvasRect, setCanvasRect] = useState<{
    canvasWidth: number;
    canvasHeight: number;
  }>({
    canvasHeight: 0,
    canvasWidth: 0,
  });
  const {canvasHeight, canvasWidth} = canvasRect;
  const font = useFont(require('@/assets/fonts/NanumSquareR.ttf'), 18);

  const x = scaleUtc().domain(xDomain);
  const y = scaleLinear().domain(yDomain);

  const xAxisData = useMemo(
    () =>
      Array.from({length: 13}, (_, i) => i).map(i => {
        const evenHour = i * 2;
        return {
          value: dayjs(xDomain[0]).hour(evenHour).toDate(),
          label: `${evenHour}`,
        };
      }),
    [xDomain],
  );
  const maxXAxisHeight = useMemo(
    () =>
      Math.max(
        ...xAxisData.map(({label}) => font?.measureText(label).height ?? 0),
      ),
    [xAxisData, font],
  );
  const yAxisData = useMemo(
    () =>
      y.ticks(10).map(value => ({
        value,
        label: `${value}`,
      })),
    [y],
  );
  const maxYAxisWidth = useMemo(
    () =>
      Math.max(
        ...yAxisData.map(({label}) => font?.measureText(label).width ?? 0),
      ),
    [yAxisData, font],
  );

  const xMinRange = maxYAxisWidth + xMargin + xPadding;
  const xMaxRange = canvasWidth - xMargin - xPadding;
  const yMinRange = yMargin + yPadding;
  const yMaxRange = canvasHeight - yMargin - yPadding - maxXAxisHeight;
  x.range([xMinRange, xMaxRange]);
  y.range([yMaxRange, yMinRange]);

  const curvedLine = line<SimpleScaleDeviceValue>()
    .x(v => x(dayjs(v.created_at).toDate()))
    .y(v => y(v.value))
    .curve(curveBasis)(data);
  if (!curvedLine) return null;

  const linePath = Skia.Path.MakeFromSVGString(curvedLine);
  if (!linePath) return null;

  return (
    <View
      style={styles.chartContainer}
      onLayout={event => {
        const {width, height} = event.nativeEvent.layout;
        setCanvasRect({canvasHeight: height, canvasWidth: width});
      }}>
      {canvasWidth > 0 && canvasHeight > 0 && (
        <Canvas style={{width: canvasWidth, height: canvasHeight}}>
          {yAxisData.map(({label, value}) => {
            const strokeWidth = 1;
            const scaledY = y(value);
            const axis = Skia.Path.Make();
            axis.moveTo(xMinRange - strokeWidth / 2, scaledY);
            axis.lineTo(xMaxRange - strokeWidth / 2, scaledY);

            return (
              <>
                <Path
                  path={axis}
                  color={'#0002'}
                  style={'stroke'}
                  strokeWidth={strokeWidth}>
                  <DashPathEffect intervals={[4, 4]} />
                </Path>
                <Text
                  key={label}
                  x={xMargin + maxYAxisWidth - font!.measureText(label).width}
                  y={y(value) + font!.measureText(label).height / 2}
                  font={font}
                  text={label}
                  color="#000"
                />
              </>
            );
          })}

          {xAxisData.map(({label, value}) => {
            const strokeWidth = 1;
            const scaledX = x(value);
            const axis = Skia.Path.Make();
            axis.moveTo(scaledX, yMinRange - strokeWidth / 2);
            axis.lineTo(scaledX, yMaxRange - strokeWidth / 2);

            return (
              <>
                <Path
                  path={axis}
                  color={'#0002'}
                  style={'stroke'}
                  strokeWidth={strokeWidth}>
                  <DashPathEffect intervals={[4, 4]} />
                </Path>
                <Text
                  key={label}
                  x={x(value) - font!.measureText(label).width / 2}
                  y={canvasHeight - yMargin}
                  font={font}
                  text={label}
                  color="#000"
                />
              </>
            );
          })}

          <Path
            path={linePath}
            color={'#000'}
            style={'stroke'}
            strokeWidth={1}
          />
        </Canvas>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {flex: 1},
});

export default ScaleLineChart;
