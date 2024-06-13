import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface HeaderProps {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onPressLeft?: () => void;
  onPressRight?: () => void;
}

const Header = ({
  title,
  left,
  right,
  onPressLeft,
  onPressRight,
}: HeaderProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressLeft} hitSlop={16}>
        {left}
      </TouchableOpacity>
      <Text>{title}</Text>
      <TouchableOpacity onPress={onPressRight} hitSlop={16}>
        {right}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
});

export default Header;
