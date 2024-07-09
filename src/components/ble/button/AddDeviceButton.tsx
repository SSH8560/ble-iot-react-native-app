import {useTheme} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface AddDeviceButtonProps {}

const AddDeviceButton = ({}: AddDeviceButtonProps) => {
  const {colors} = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primary,
        borderRadius: 100,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Icon name="add" size={24} color={colors.background} />
    </View>
  );
};

export default AddDeviceButton;
