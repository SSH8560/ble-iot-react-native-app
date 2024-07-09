import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
interface DeviceSettingHeaderProps {
  onPressGoBack: () => void;
  onPressDisconnect: () => void;
  onPressConnect: () => void;
  isConnected?: boolean;
  deviceName: string;
}

const DeviceSettingHeader = ({
  isConnected,
  deviceName,
  onPressConnect,
  onPressDisconnect,
  onPressGoBack,
}: DeviceSettingHeaderProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onPressGoBack}>
        <Icon name="chevron-left" size={40} />
      </TouchableOpacity>
      <Text style={styles.title}>{deviceName}</Text>
      {isConnected ? (
        <TouchableOpacity
          style={styles.connectButton}
          onPress={onPressDisconnect}>
          <Text style={styles.connectButtonText}>연결해제</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.connectButton} onPress={onPressConnect}>
          <Text style={styles.connectButtonText}>연결하기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  backButton: {
    width: 40,
    height: 40,
  },
  title: {fontSize: 20, textAlign: 'left', flex: 1, fontWeight: 'bold'},
  connectButton: {
    height: 40,
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 10,
  },
  connectButtonText: {fontSize: 18, fontWeight: 'bold'},
});

export default DeviceSettingHeader;
