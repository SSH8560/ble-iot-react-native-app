import {SERVICE_MAP} from '@/libs/ble';
import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useState} from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import Accordion, {
  AccordionContent,
  AccordionTrigger,
} from '@/components/Accordion';
import CharacteristicCard from './components/CharacteristicCard';
import {useBLEDevice} from '@/hooks/useBLEDevice';
import DeviceSettingHeader from './components/DeviceSettingHeader';
import DeviceSearchIndicator from './components/DeviceSearchIndicator';
import {createKey} from '@/libs/utils';
import InputModal from './components/InputModal';
import {Buffer} from 'buffer';
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
    handlePressWrite,
    peripheralInfo,
  } = useBLEDevice(device.peripheral_id);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedCharacteristic, setSelectedCharacteristic] = useState<{
    serviceUUID: string;
    characteristicUUID: string;
  } | null>(null);

  const handleOpenModal = useCallback(
    ({
      serviceUUID,
      characteristicUUID,
    }: {
      serviceUUID: string;
      characteristicUUID: string;
    }) => {
      setSelectedCharacteristic({serviceUUID, characteristicUUID});
      setIsInputModalOpen(true);
    },
    [],
  );
  const handleWrite = useCallback(() => {
    if (selectedCharacteristic) {
      handlePressWrite({
        serviceUUID: selectedCharacteristic.serviceUUID,
        characteristicUUID: selectedCharacteristic.characteristicUUID,
        data: Array.from(Buffer.from(inputValue)),
      });
      setIsInputModalOpen(false);
      setInputValue('');
    }
  }, [selectedCharacteristic, inputValue, handlePressWrite]);

  const providedServices =
    peripheralInfo?.services?.filter(({uuid}) => uuid.length > 32) ?? [];
  const providedCharacteristics = peripheralInfo?.characteristics ?? [];

  if (!isConnected && !isScanned) return <DeviceSearchIndicator />;

  return (
    <>
      <View style={{flex: 1, gap: 16, paddingHorizontal: 10}}>
        <View style={{flex: 1}}>
          <DeviceSettingHeader
            deviceName={device.device_name ?? device.peripheral_id}
            isConnected={isConnected}
            onPressConnect={() => connect(device.peripheral_id)}
            onPressDisconnect={() => disconnect(device.peripheral_id)}
            onPressGoBack={() => navigation.goBack()}
          />
          {isConnected &&
            peripheralInfo &&
            providedServices.map(({uuid: serviceUUID}) => {
              return (
                <Accordion>
                  <AccordionTrigger>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                      {SERVICE_MAP.get(serviceUUID)?.label}
                    </Text>
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
                              onPressWrite={
                                properties.Write &&
                                (() =>
                                  handleOpenModal({
                                    serviceUUID,
                                    characteristicUUID,
                                  }))
                              }
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
      </View>
      <InputModal
        isVisible={isInputModalOpen}
        value={inputValue}
        onChangeText={setInputValue}
        onSubmit={handleWrite}
        onClose={() => setIsInputModalOpen(false)}
      />
    </>
  );
};

export default ScaleDeviceSettingScreen;
