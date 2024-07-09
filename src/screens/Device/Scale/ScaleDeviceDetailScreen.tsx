import {getScaleDeviceValues} from '@/apis/supabase/scaleDeviceValues';
import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import ScaleLineChart from '@/components/ScaleLineChart';
import dayjs from 'dayjs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '@/components/Header';
import {addDays, startOfDay} from 'date-fns';
import {
  QueryFunctionContext,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {CartesianChart, Line} from 'victory-native';

interface ScaleDeviceDetailScreenProps
  extends NativeStackScreenProps<RootStackParams, 'ScaleDeviceDetail'> {}

const ScaleDeviceDetailScreen = ({
  navigation,
  route: {
    params: {device},
  },
}: ScaleDeviceDetailScreenProps) => {
  const {device_id} = device;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const {data} = useQuery({
    queryKey: ['scaleDeviceValues', {date: selectedDate}],
    queryFn: async ({
      queryKey: [_key, {date}],
    }: QueryFunctionContext<[string, {date: Date}]>) => {
      return await getScaleDeviceValues(device_id, {date});
    },
  });

  const startOfDate = startOfDay(selectedDate);
  const endOfDate = startOfDay(addDays(startOfDate, 1));
  console.log(data);

  return (
    <View style={{width: '100%', height: 500}}>
      <Header
        title={device_id}
        left={<Icon name="chevron-left" size={28} />}
        onPressLeft={() => navigation.goBack()}
        right={<Icon name="settings" size={28} />}
        onPressRight={() => navigation.navigate('ScaleDeviceSetting', {device})}
      />
      <DateController
        date={selectedDate}
        onPressNextDay={setSelectedDate}
        onPressPrevDay={setSelectedDate}
      />
      {data && data.length > 0 && (
        <ScaleLineChart data={data} date={selectedDate} />
      )}
    </View>
  );
};

interface DateControllerProps {
  date: Date;
  onPressNextDay: (date: Date) => void;
  onPressPrevDay: (date: Date) => void;
}

const DateController = ({
  date,
  onPressNextDay,
  onPressPrevDay,
}: DateControllerProps) => {
  const dayjsDate = dayjs(date);
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        paddingBottom: 0,
      }}>
      <TouchableOpacity
        onPress={() => onPressPrevDay(dayjsDate.subtract(1, 'day').toDate())}>
        <Icon name="chevron-left" size={40} />
      </TouchableOpacity>
      <Text style={{fontSize: 18}}>{dayjsDate.format('YYYY년 MM월 DD일')}</Text>
      <TouchableOpacity
        onPress={() => onPressNextDay(dayjsDate.add(1, 'day').toDate())}>
        <Icon name="chevron-right" size={40} />
      </TouchableOpacity>
    </View>
  );
};

export default ScaleDeviceDetailScreen;
