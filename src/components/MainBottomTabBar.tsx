import {MainTabParams} from '@/router.d';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useTheme} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface MainBottomTabBarProps extends BottomTabBarProps {}

const MainBottomTabBar = ({state, navigation}: MainBottomTabBarProps) => {
  const {colors} = useTheme();

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map(({name, key}, index) => {
        const isFocused = state.index === index;
        const tab = tabs[name as keyof MainTabParams];

        const contentColor = isFocused ? colors.background : colors.border;
        const backgroundColor = isFocused ? colors.primary : colors.background;

        const onPress = () => {
          navigation.emit({
            type: 'tabPress',
            target: key,
            canPreventDefault: true,
          });
          if (!isFocused) navigation.navigate(name);
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: key,
          });
        };

        return (
          <TouchableOpacity
            key={key}
            style={[styles.tabContainer, {backgroundColor}]}
            onPress={onPress}
            onLongPress={onLongPress}>
            <Icon name={tab.iconName} color={contentColor} size={24} />
            <Text style={[styles.tabLabel, {color: contentColor}]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    elevation: 1,
    width: 'auto',
    height: 72,
    padding: 8,
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  tabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  tabLabel: {
    fontFamily: 'NanumSquareR',
    fontWeight: 'bold',
  },
});

const tabs: {
  [key in keyof MainTabParams]: {
    label: string;
    iconName: string;
  };
} = {
  MyDevice: {label: '내 기기', iconName: 'devices'},
  Setting: {label: '설정', iconName: 'settings'},
};

export default MainBottomTabBar;
