import {SERVICE_MAP} from '@/libs/ble';
import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Accordion, {
  AccordionContent,
  AccordionTrigger,
} from '@/components/Accordion';
import CharacteristicCard from './components/CharacteristicCard';
import {useBLEDevice} from '@/hooks/useBLEDevice';
interface ScaleDeviceSettingScreenProps
  extends NativeStackScreenProps<RootStackParams, 'ScaleDeviceSetting'> {}

const ScaleDeviceSettingScreen = ({
  navigation,
  route: {
    params: {device},
  },
}: ScaleDeviceSettingScreenProps) => {
  const {
    isScanned,
    isConnected,
    characteristicValues,
    notifiedCharacteristic,
    connect,
    disconnect,
    handlePressNotification,
    handlePressRead,
    peripheralInfo,
  } = useBLEDevice(device.peripheral_id);

  const providedServices =
    peripheralInfo?.services?.filter(({uuid}) => uuid.length > 32) ?? [];

  const providedCharacteristics = peripheralInfo?.characteristics ?? [];
  return (
    <View style={{flex: 1, gap: 16, paddingHorizontal: 10}}>
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
                <Accordion>
                  <AccordionTrigger>
                    <Text>{SERVICE_MAP.get(serviceUUID)?.label}</Text>
                  </AccordionTrigger>
                  <AccordionContent>
                    {providedCharacteristics
                      .filter(({service}) => service === serviceUUID)
                      .map(
                        ({characteristic: characteristicUUID, properties}) => {
                          const key = createKey(
                            serviceUUID,
                            characteristicUUID,
                          );
                          const notified = notifiedCharacteristic.includes(key);
                          return (
                            <CharacteristicCard
                              key={characteristicUUID}
                              characteristicUUID={characteristicUUID}
                              bytesValue={characteristicValues[key] ?? null}
                              notified={notified}
                              onPressRead={
                                properties.Read &&
                                (() =>
                                  handlePressRead({
                                    serviceUUID,
                                    characteristicUUID,
                                  }))
                              }
                              onPressWrite={properties.Write && (() => {})}
                              onPressNotify={
                                properties.Notify &&
                                (() =>
                                  handlePressNotification({
                                    characteristicUUID,
                                    serviceUUID,
                                    notified,
                                  }))
                              }
                            />
                          );
                        },
                      )}
                  </AccordionContent>
                </Accordion>
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

const createKey = (serviceUUID: string, characteristicUUID: string) => {
  return `${serviceUUID}_${characteristicUUID}`;
};

export default ScaleDeviceSettingScreen;
