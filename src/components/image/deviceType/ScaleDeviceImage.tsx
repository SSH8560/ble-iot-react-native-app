import React from 'react';
import {StyleSheet, Image} from 'react-native';
import DeviceImage from '../DeviceImage';

interface ScaleDeviceImageProps {}

const ScaleDeviceImage: React.FC<ScaleDeviceImageProps> = () => {
  return (
    <DeviceImage>
      <Image style={styles.image} source={scaleImage} />
    </DeviceImage>
  );
};

const scaleImage = require('@/assets/images/device/scale.png');

const styles = StyleSheet.create({
  image: {width: '100%', height: '100%'},
});

export default ScaleDeviceImage;
