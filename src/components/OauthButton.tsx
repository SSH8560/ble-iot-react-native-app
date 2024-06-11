import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Image} from 'react-native';

interface OauthButtonProps {
  variant: 'kakao';
  onPress: () => void;
}

const OauthButton = ({variant, onPress}: OauthButtonProps) => {
  const {containerColor, labelColor, symbolColor, labelText} =
    OauthVariant[variant];

  return (
    <TouchableOpacity
      style={[styles.buttonContainer, {backgroundColor: containerColor}]}
      onPress={onPress}>
      <Image style={styles.buttonSymbol} source={kakaoSymbol} />
      <Text style={[styles.buttonText, {color: labelColor}]}>{labelText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: 'gray',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSymbol: {
    position: 'absolute',
    left: 16,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
});

const kakaoSymbol = require('@/assets/images/oauth/kakao.png');

const OauthVariant = {
  kakao: {
    containerColor: '#FEE500',
    symbolColor: '#000',
    labelColor: 'rgba(0,0,0,0.85)',
    labelText: '카카오로 로그인',
  },
};

export default OauthButton;
