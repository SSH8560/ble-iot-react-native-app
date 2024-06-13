import {useTheme} from '@react-navigation/native';
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
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.container,
        {borderBottomColor: colors.border, borderBottomWidth: 1},
      ]}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPressLeft}
        hitSlop={16}>
        {left}
      </TouchableOpacity>
      <Text style={styles.title} lineBreakMode="tail" numberOfLines={1}>
        {title}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onPressRight}
        hitSlop={16}>
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
    padding: 10,
    gap: 10,
  },
  title: {
    flex: 0.8,
    fontSize: 16,
    fontWeight: '700',
  },
  button: {
    flex: 0.1,
  },
});

export default Header;
