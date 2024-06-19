import LottieView from 'lottie-react-native';
import React from 'react';
import {View, Text} from 'react-native';

interface DeviceSearchIndicatorProps {}

const DeviceSearchIndicator = ({}: DeviceSearchIndicatorProps) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <LottieView
        source={require('@/assets/lotties/loading.json')}
        style={{width: '50%', height: '40%'}}
        autoPlay
        loop
      />
      <Text style={{textAlign: 'center', fontSize: 20, fontWeight: '700'}}>
        기기를 찾고 있습니다.
      </Text>
    </View>
  );
};

export default DeviceSearchIndicator;
