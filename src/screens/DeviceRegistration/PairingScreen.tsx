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
  const {} = useBLESettingService({peripheralId});

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
  const handleRegistering = useCallback(async () => {
    try {
      setStatus('REGISTERING');
      const bytes = await handlePressRead({
        peripheralId,
        serviceUUID: settingServiceUUID,
        characteristicUUID: deviceInfoCharacteristicUUID,
      });
      const [device_id, device_type] = bytesToString(bytes).split(',');

      await postUserDevice({
        peripheral_id: peripheralId,
        device_id,
        device_type,
      });
      handleDone();
    } catch (e) {
      console.log(e);
      navigation.navigate('MainTab');
    }
  }, [
    handleDone,
    peripheralId,
    settingServiceUUID,
    deviceInfoCharacteristicUUID,
    handlePressRead,
    navigation,
  ]);
  const handlePairing = useCallback(async () => {
    setStatus('PAIRING');
    handlePressWrite({
      peripheralId,
      serviceUUID: settingServiceUUID,
      characteristicUUID: wifiCredentialCharacteristicUUID,
      data: stringToBytes(`${wifiSsid},${wifiPassword}`),
    });
  }, [
    handlePressWrite,
    peripheralId,
    settingServiceUUID,
    wifiCredentialCharacteristicUUID,
    wifiPassword,
    wifiSsid,
  ]);
  const handleInitiating = useCallback(async () => {
    await handlePressNotification({
      peripheralId,
      serviceUUID: settingServiceUUID,
      characteristicUUID: connectionCharacteristicUUID,
    });
    handlePairing();
  }, [
    peripheralId,
    settingServiceUUID,
    connectionCharacteristicUUID,
    handlePairing,
    handlePressNotification,
  ]);

  useEffect(() => {
    handleInitiating();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const wifiConnectedBytes =
      characteristicValues[
        createKey(settingServiceUUID, connectionCharacteristicUUID)
      ];
    if (!wifiConnectedBytes) return;

    const wifiConnected = bytesToString(wifiConnectedBytes);
    if (wifiConnected !== 'connected') {
      handleError();
    } else {
      handleRegistering();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characteristicValues]);

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
