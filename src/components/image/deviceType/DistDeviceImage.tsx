import React from 'react';
import {StyleSheet} from 'react-native';
import DeviceImage from '../DeviceImage';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface DistDeviceImageProps {}

const DistDeviceImage: React.FC<DistDeviceImageProps> = () => {
  return (
    <DeviceImage>
      <Icon name="arrows-alt-h" />
    </DeviceImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DistDeviceImage;
