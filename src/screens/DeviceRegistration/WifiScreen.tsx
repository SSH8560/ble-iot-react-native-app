import {hasLocationPermission} from '@/libs/permissions';
import React, {useCallback, useEffect, useState} from 'react';
import {
  AppState,
  AppStateStatus,
  Button,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DeviceRegistrationParams} from '@/router.d';
import {useBLEManager} from '@/providers/BLEProvider';
interface WifiScreenProps
  extends NativeStackScreenProps<DeviceRegistrationParams, 'Wifi'> {}

const WifiScreen = ({
  route: {
    params: {peripheralId},
  },
  navigation,
}: WifiScreenProps) => {
  const {disconnect} = useBLEManager();
  const [wifiSsid, setWifiSsid] = useState<string>('');
  const [wifiPassword, setWifiPassword] = useState<string>('6dbb3hf606');

  useEffect(() => {
    getCurrentWifiSSID();

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') getCurrentWifiSSID();
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
      disconnect(peripheralId);
    };
  }, []);

  const getCurrentWifiSSID = useCallback(() => {
    hasLocationPermission().then(hasPermission => {
      if (!hasPermission) return;
      WifiManager.getCurrentWifiSSID()
        .then(setWifiSsid)
        .catch(() => setWifiSsid(''));
    });
  }, []);

  return (
    <View style={{padding: 16}}>
      <View style={styles.wifiFormContainer}>
        <View style={styles.iconTextContainer}>
          <Icon name="wifi" size={28} color={'#000'} />
          <Text style={{color: '#000'}}>{wifiSsid}</Text>
        </View>
        <TouchableOpacity
          onPress={() => Linking.sendIntent('android.settings.WIFI_SETTINGS')}>
          <Icon name="sync-alt" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.iconTextContainer}>
        <Icon name="lock-outline" size={28} color="#000" />
        <TextInput
          style={styles.wifiPasswordInput}
          value={wifiPassword}
          onChangeText={setWifiPassword}
        />
      </View>
      <Button
        title="다음"
        onPress={() => {
          navigation.navigate('Pairing', {
            peripheralId,
            wifiPassword,
            wifiSsid,
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wifiFormContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconTextContainer: {flexDirection: 'row', alignItems: 'center', gap: 8},
  wifiPasswordInput: {width: '100%', paddingLeft: 0, color: '#000'},
});

export default WifiScreen;
