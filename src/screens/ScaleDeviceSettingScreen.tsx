import Header from '@/components/Header';
import useBLE from '@/hooks/useBLE';
import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {PeripheralInfo} from 'react-native-ble-manager';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ScaleDeviceSettingScreenProps
  extends NativeStackScreenProps<RootStackParams, 'ScaleDeviceSetting'> {}

const ScaleDeviceSettingScreen = ({
  navigation,
  route: {
    params: {device},
  },
}: ScaleDeviceSettingScreenProps) => {
  const {
    startScan,
    stopScan,
    scannedPeripherals,
    connectedPeripherals,
    startNotification,
    retrieveServices,
    connect,
    disconnect,
  } = useBLE();
  const [scaleValue, setScaleValue] = useState(0);
  const [peripheralInfo, setPeripheralInfo] = useState<PeripheralInfo | null>(
    null,
  );
  const isScanned = scannedPeripherals.has(device.peripheral_id);
  const isConnected = connectedPeripherals.includes(device.peripheral_id);
  const providedServices =
    peripheralInfo?.services?.filter(({uuid}) => uuid.length > 32) ?? [];
  const providedCharacteristics = peripheralInfo?.characteristics ?? [];

  useEffect(() => {
    if (!isConnected && !isScanned) {
      startScan(10);
    } else {
      stopScan();
    }
    if (!isScanned && isConnected) {
      connect(device.peripheral_id);
    }
  }, [isScanned, isConnected, startScan, stopScan, connect, device]);

  useEffect(() => {
    if (isConnected) {
      retrieveServices(device.peripheral_id).then(setPeripheralInfo);
    }
  }, [isConnected, retrieveServices, device]);

  return (
    <View style={{flex: 1, gap: 16}}>
      {isScanned || isConnected ? (
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 10,
            }}>
            <View style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="chevron-left" size={28} />
              </TouchableOpacity>
              <Text style={{fontSize: 20}}>
                {device.device_name ?? device.peripheral_id}
              </Text>
            </View>
            {isConnected ? (
              <TouchableOpacity
                onPress={() => disconnect(device.peripheral_id)}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>연결해제</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => connect(device.peripheral_id)}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>연결하기</Text>
              </TouchableOpacity>
            )}
          </View>
          {isConnected &&
            peripheralInfo &&
            providedServices.map(({uuid: serviceUUID}) => {
              return (
                <View>
                  <Text>{serviceUUID}</Text>
                  {providedCharacteristics
                    .filter(({service}) => service === serviceUUID)
                    .map(({characteristic}) => {
                      return (
                        <View style={{paddingLeft: 10}}>
                          <Text>{characteristic}</Text>
                        </View>
                      );
                    })}
                </View>
              );
            })}
        </View>
      ) : (
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
      )}
    </View>
  );
};

export default ScaleDeviceSettingScreen;
