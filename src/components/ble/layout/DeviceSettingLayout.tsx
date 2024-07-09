import React from 'react';
import {View, StyleSheet} from 'react-native';
import DeviceSettingHeader from '../header/DeviceSettingHeader';
import {useNavigation} from '@react-navigation/native';
import {useBLEManager} from '@/providers/BLEProvider';

interface DeviceSettingLayoutProps extends React.PropsWithChildren {
  peripheralId: string;
  isConnected: boolean;
}

const DeviceSettingLayout: React.FC<DeviceSettingLayoutProps> = ({
  peripheralId,
  isConnected,
  children,
}) => {
  const {goBack} = useNavigation();
  const {connect, disconnect} = useBLEManager();

  return (
    <View style={styles.container}>
      <DeviceSettingHeader
        deviceName={peripheralId}
        isConnected={isConnected}
        onPressConnect={() => connect(peripheralId)}
        onPressDisconnect={() => disconnect(peripheralId)}
        onPressGoBack={() => goBack()}
      />
      <View style={styles.content}>{isConnected && children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, gap: 16, paddingHorizontal: 10},
  content: {flex: 1},
});

export default DeviceSettingLayout;
