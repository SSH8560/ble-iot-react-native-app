import {postUserDevice} from '@/apis/supabase/userDevices';
import {DeviceRegistrationParams, RootStackParams} from '@/router.d';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {bytesToString, createKey, stringToBytes} from '@/libs/utils';
import LoadingIndicator from '@/components/LoadingIndicator';
import {View} from 'react-native';
import useBLESettingService from '@/hooks/ble/useBLESettingService';

type Status = 'INITIATING' | 'PAIRING' | 'REGISTERING' | 'DONE' | 'ERROR';

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
  const [status, setStatus] = useState<Status>('INITIATING');
  const {
    writeWifiCredential,
    readConnection,
    startNotifyConnection,
    stopNotifyConnection,
    readDeviceInfo,
  } = useBLESettingService({peripheralId});

  useEffect(() => {
    handleInitiating();
  }, []);

  const handleDone = useCallback(async () => {
    setStatus('DONE');
    // TODO: Toast 메시지
    navigation.navigate('MainTab');
  }, [navigation]);
  const handleError = useCallback(async () => {
    setStatus('ERROR');
    // TODO: Toast 메시지
    navigation.goBack();
  }, [navigation]);

  const handlePairing = useCallback(async () => {
    setStatus('PAIRING');

    await writeWifiCredential({ssid: wifiSsid, password: wifiPassword});
    const isWifiConnected = await readConnection();
    if (isWifiConnected === 'connected') handleRegistering();
  }, []);

  const handleRegistering = useCallback(async () => {
    try {
      setStatus('REGISTERING');

      const {type, uuid} = await readDeviceInfo();
      await postUserDevice({
        peripheral_id: peripheralId,
        device_id: uuid,
        device_type: type,
      });

      handleDone();
    } catch (e) {
      console.log(e);
      navigation.navigate('MainTab');
    }
  }, []);

  const handleInitiating = useCallback(async () => {
    handlePairing();
  }, []);

  return (
    <View style={{flex: 1}}>
      <LoadingIndicator
        message={
          status === 'INITIATING'
            ? '준비 중입니다....'
            : status === 'PAIRING'
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
