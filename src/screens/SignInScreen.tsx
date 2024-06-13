import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View} from 'react-native';
import OauthButton from '@/components/OauthButton';
import {kakaoSignIn} from '@/apis/supabase/auth';

interface SignInScreenProps
  extends NativeStackScreenProps<RootStackParams, 'SignIn'> {}

const SignInScreen = ({}: SignInScreenProps) => {
  return <OauthButton variant="kakao" onPress={() => kakaoSignIn()} />;
};

export default SignInScreen;
