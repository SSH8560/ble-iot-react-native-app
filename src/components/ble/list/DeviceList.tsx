import {UserDevice} from '@/apis/supabase/userDevices';
import DistDeviceImage from '@/components/image/deviceType/DistDeviceImage';
import ScaleDeviceImage from '@/components/image/deviceType/ScaleDeviceImage';
import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {FlatList, ListRenderItem, TouchableOpacity, View} from 'react-native';

interface DeviceListProps {
  devices: UserDevice[];
  onPressDeviceItem: (userDevice: UserDevice) => void;
}

const DeviceList = ({devices, onPressDeviceItem}: DeviceListProps) => {
  const {colors} = useTheme();
  const renderDevice: ListRenderItem<UserDevice> = ({item}) => {
    const {device_type} = item;
    const {DeviceImageComponent, label} = deviceInfo[device_type];

    return (
      <TouchableOpacity
        style={[styles.deviceItemContainer, {borderColor: colors.border}]}
        onPress={() => onPressDeviceItem(item)}>
        <DeviceImageComponent />
        <View>
          <Text>{label}</Text>
          <Text>{item.device_name ?? item.device_id}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (devices.length === 0)
    return (
      <View>
        <Text>등록된 기기가 없습니다. 기기를 등록해주세요.</Text>
      </View>
    );

  return (
    <FlatList
      style={{flex: 1}}
      contentContainerStyle={{padding: 10, gap: 10}}
      data={devices}
      renderItem={renderDevice}
    />
  );
};

const deviceInfo: {
  [key: string]: {
    DeviceImageComponent: React.FC;
    label: string;
  };
} = {
  SCALE: {
    DeviceImageComponent: ScaleDeviceImage,
    label: '저울',
  },
  DIST: {
    DeviceImageComponent: DistDeviceImage,
    label: '거리',
  },
};

const styles = StyleSheet.create({
  deviceItemContainer: {
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
  },
});

export default DeviceList;
