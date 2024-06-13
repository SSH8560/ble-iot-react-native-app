import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import OauthButton from '@/components/OauthButton';
import {kakaoSignIn} from '@/apis/supabase/auth';

interface SignInScreenProps
  extends NativeStackScreenProps<RootStackParams, 'SignIn'> {}

const SignInScreen = ({navigation}: SignInScreenProps) => {
  return (
    <OauthButton
      variant="kakao"
      onPress={async () => {
        await kakaoSignIn();
        navigation.navigate('MainTab');
      }}
    />
  );
};

export default SignInScreen;
