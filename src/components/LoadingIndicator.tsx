import LottieView from 'lottie-react-native';
import React from 'react';
import {View, Text} from 'react-native';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator = ({message}: LoadingIndicatorProps) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <LottieView
        source={require('@/assets/lotties/loading.json')}
        style={{width: '50%', height: '40%'}}
        autoPlay
        loop
      />
      <Text style={{textAlign: 'center', fontSize: 20, fontWeight: '700'}}>
        {message}
      </Text>
    </View>
  );
};

export default LoadingIndicator;
