import * as KakaoLogin from '@react-native-seoul/kakao-login';
import {supabase} from './supabase';

export const kakaoSignIn = async () => {
  try {
    const {accessToken, idToken} = await KakaoLogin.login();
    if (!idToken || !accessToken)
      throw new Error('토큰을 가져오지 못했습니다.');

    console.log(idToken);
    const {error} = await supabase.auth.signInWithIdToken({
      provider: 'kakao',
      token: idToken,
      access_token: accessToken,
    });

    if (error) throw new Error(error.message);
  } catch (e) {
    throw e;
  }
};

export const getUser = async () => {
  try {
    const {
      data: {user},
      error,
    } = await supabase.auth.getUser();

    if (error) throw new Error(error.message);
    if (!user) throw new Error();

    return user;
  } catch (e) {
    throw e;
  }
};
