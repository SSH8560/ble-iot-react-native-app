import {getUser} from '@/apis/supabase/auth';
import {useBLE} from '@/providers/BleProvider';
import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';

interface PairingScreenProps
  extends NativeStackScreenProps<RootStackParams, 'Pairing'> {}

const PairingScreen = ({
  route: {
    params: {peripheralId, wifiPassword, wifiSsid},
  },
}: PairingScreenProps) => {
  const {sendWiFiCredentials, startNotificateSettingStatus} = useBLE();

  useEffect(() => {
    initiate();

    async function initiate() {
      const {id} = await getUser();
      startNotificateSettingStatus(peripheralId, value => {
        console.log(String.fromCharCode(...value));
      });
      sendWiFiCredentials({
        peripheralId,
        userId: id,
        wifiPassword,
        wifiSsid,
      });
    }
  }, []);
  return <View></View>;
};

export default PairingScreen;
