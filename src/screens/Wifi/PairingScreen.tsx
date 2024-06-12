import {getUser} from '@/apis/supabase/auth';
import {postUserDevice} from '@/apis/supabase/userDevices';
import {useBLE} from '@/providers/BleProvider';
import {DeviceRegistrationParams, RootStackParams} from '@/router.d';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';

interface PairingScreenProps
  extends CompositeScreenProps<
    NativeStackScreenProps<DeviceRegistrationParams, 'Pairing'>,
    NativeStackScreenProps<RootStackParams>
  > {}

const PairingScreen = ({
  route: {
    params: {peripheralId, wifiPassword, wifiSsid},
  },
  navigation,
}: PairingScreenProps) => {
  const [status, setStatus] = useState<
    'PAIRING' | 'REGISTERING' | 'DONE' | 'ERROR'
  >('PAIRING');
  const {
    sendWiFiCredentials,
    startNotificateSettingStatus,
    readDeviceInfo: readDeviceId,
  } = useBLE();

  useEffect(() => {
    switch (status) {
      case 'PAIRING':
        onPairing();
        return;
      case 'REGISTERING':
        onRegistering();
        return;
      case 'DONE':
        onDone();
        return;
      case 'ERROR':
        onError();
        return;
    }

    async function onPairing() {
      sendWiFiCredentials({
        peripheralId,
        wifiPassword,
        wifiSsid,
      });
      startNotificateSettingStatus(peripheralId, handleOnReceiveSettingStatus);
    }
    async function onRegistering() {
      try {
        const {id, type} = await readDeviceId(peripheralId);
        await postUserDevice({device_id: id, device_type: type});
        setStatus('DONE');
      } catch (e) {
        navigation.navigate('MainTab');
      }
    }
    async function onDone() {
      navigation.navigate('MainTab');
    }
    async function onError() {
      navigation.goBack();
    }
  }, [status]);

  const handleOnReceiveSettingStatus = (data: number[]) => {
    const result = String.fromCharCode(...data);
    switch (result) {
      case 'success':
        setStatus('REGISTERING');
        return;
      case 'fail':
        setStatus('ERROR');
        return;
      default:
        setStatus('ERROR');
        return;
    }
  };

  return (
    <View>
      <Text>{status}</Text>
    </View>
  );
};

export default PairingScreen;
