import {SignOut} from '@/apis/supabase/auth';
import {RootStackParams, MainTabParams} from '@/router.d';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CommonActions, CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Button, View} from 'react-native';

interface SettingsScreenProps
  extends CompositeScreenProps<
    NativeStackScreenProps<RootStackParams>,
    BottomTabScreenProps<MainTabParams>
  > {}

const SettingsScreen = ({navigation}: SettingsScreenProps) => {
  return (
    <View>
      <Button
        title="로그아웃"
        onPress={async () => {
          await SignOut();
          navigation.dispatch(
            CommonActions.reset({
              routes: [{name: 'SignIn'}],
            }),
          );
        }}
      />
    </View>
  );
};

export default SettingsScreen;
