import {getUser} from '@/apis/supabase/auth';
import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {View} from 'react-native';

interface SpalshScreenProps
  extends NativeStackScreenProps<RootStackParams, 'Splash'> {}

const SpalshScreen = ({navigation}: SpalshScreenProps) => {
  useEffect(() => {
    getUser()
      .then(() => {
        navigation.navigate('MainTab');
      })
      .catch(() => {
        navigation.navigate('SignIn');
      });
  }, []);
  return <View></View>;
};

export default SpalshScreen;
