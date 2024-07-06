import React from 'react';
import {View, StyleSheet} from 'react-native';

const IMAGE_SIZE = 60;

interface DeviceImageProps extends React.PropsWithChildren {}

const DeviceImage: React.FC<DeviceImageProps> = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
});

export default DeviceImage;
