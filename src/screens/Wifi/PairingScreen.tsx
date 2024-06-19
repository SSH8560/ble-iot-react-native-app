import {postUserDevice} from '@/apis/supabase/userDevices';
import {getCharacteristicUUID, getServiceUUID} from '@/libs/ble';
import {useBLE} from '@/providers/BleProvider';
import {DeviceRegistrationParams, RootStackParams} from '@/router.d';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Buffer} from 'buffer';
import {btyesToString, createKey} from '@/libs/utils';
import LoadingIndicator from '@/components/LoadingIndicator';

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
    characteristicValues,
    handlePressWrite,
    handlePressNotification,
    handlePressRead,
  } = useBLE();

  const settingServiceUUID = getServiceUUID('설정');
  const wifiCredentialCharacteristicUUID = getCharacteristicUUID('와이파이');
  const deviceInfoCharacteristicUUID = getCharacteristicUUID('기기');
  const connectionCharacteristicUUID = getCharacteristicUUID('연결상태');

  useEffect(() => {
    handlePressNotification({
      peripheralId,
      serviceUUID: settingServiceUUID,
      characteristicUUID: connectionCharacteristicUUID,
    });
    return () => {};
  }, []);

  useEffect(() => {
    const wifiConnectedBytes =
      characteristicValues[
        createKey(settingServiceUUID, connectionCharacteristicUUID)
      ];
    if (!wifiConnectedBytes) return;

    const wifiConnected = btyesToString(wifiConnectedBytes);
    if (wifiConnected !== 'connected') {
      navigation.goBack();
      return;
    }

    setStatus('REGISTERING');
  }, [characteristicValues]);

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
      console.log('asdsad1');
      handlePressWrite({
        peripheralId,
        serviceUUID: settingServiceUUID,
        characteristicUUID: wifiCredentialCharacteristicUUID,
        data: Array.from(Buffer.from(`${wifiSsid},${wifiPassword}`)),
      });
    }
    async function onRegistering() {
      try {
        const bytes = await handlePressRead({
          peripheralId,
          serviceUUID: settingServiceUUID,
          characteristicUUID: deviceInfoCharacteristicUUID,
        });
        const [device_id, device_type] = btyesToString(bytes).split(',');

        await postUserDevice({
          peripheral_id: peripheralId,
          device_id,
          device_type,
        });

        setStatus('DONE');
      } catch (e) {
        console.log(e);
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
    <View style={{flex: 1}}>
      <LoadingIndicator
        message={
          status === 'PAIRING'
            ? '기기를 설정중 입니다...'
            : status === 'REGISTERING'
            ? '기기를 서버에 등록중 입니다...'
            : status === 'DONE'
            ? '등록이 완료되었습니다.'
            : '에러가 발생했습니다.'
        }
      />
    </View>
  );
};

export default PairingScreen;
