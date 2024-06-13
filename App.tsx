import React, {useEffect} from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import Router from './src/router';
import {Appearance, useColorScheme} from 'react-native';

const App = () => {
  useEffect(() => {
    Appearance.setColorScheme('light');
  }, []);
  const scheme = useColorScheme();
  const theme: Theme =
    scheme === 'dark'
      ? DarkTheme
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: '#276FBF',
            card: '#7D91BC',
            background: '#F6F9FF',
          },
        };

  return (
    <NavigationContainer theme={theme}>
      <Router />
    </NavigationContainer>
  );
};

export default App;
