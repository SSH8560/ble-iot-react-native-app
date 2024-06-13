import {UserDevice} from '@/apis/supabase/userDevices';
import {useTheme} from '@react-navigation/native';
import React from 'react';
import {Image, ImageSourcePropType, StyleSheet, Text} from 'react-native';
import {FlatList, ListRenderItem, TouchableOpacity, View} from 'react-native';

const IMAGE_SIZE = 60;

interface DeviceListProps {
  devices: UserDevice[];
  onPressDeviceItem: (userDevice: UserDevice) => void;
}

const DeviceList = ({devices, onPressDeviceItem}: DeviceListProps) => {
  const {colors} = useTheme();
  const renderDevice: ListRenderItem<UserDevice> = ({item}) => {
    const {device_type} = item;
    const {image, label} = deviceInfo[device_type];

    return (
      <TouchableOpacity
        style={[styles.deviceItemContainer, {borderColor: colors.border}]}
        onPress={() => onPressDeviceItem(item)}>
        <Image style={{width: IMAGE_SIZE, height: IMAGE_SIZE}} source={image} />
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
      contentContainerStyle={{padding: 10}}
      data={devices}
      renderItem={renderDevice}
    />
  );
};

const scaleImage = require('@/assets/images/device/scale.png');

const deviceInfo: {
  [key: string]: {
    image: ImageSourcePropType;
    label: string;
  };
} = {
  SCALE: {
    image: scaleImage,
    label: '저울',
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
