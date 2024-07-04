import {SERVICE_MAP} from '@/libs/ble';
import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import Accordion, {
  AccordionContent,
  AccordionTrigger,
} from '@/components/Accordion';
import CharacteristicCard from './components/CharacteristicCard';
import {useBLEDevice} from '@/hooks/ble/useBLEDevice';
import DeviceSettingHeader from './components/DeviceSettingHeader';
import LoadingIndicator from '../../components/LoadingIndicator';
import {createKey} from '@/libs/utils';
import InputModal from './components/InputModal';
import {Buffer} from 'buffer';
import {PeripheralInfo} from 'react-native-ble-manager';
interface ScaleDeviceSettingScreenProps
  extends NativeStackScreenProps<RootStackParams, 'ScaleDeviceSetting'> {}

const ScaleDeviceSettingScreen = ({
  navigation,
  route: {
    params: {
      device: {peripheral_id: peripheralId, device_name},
    },
  },
}: ScaleDeviceSettingScreenProps) => {
  const {
    connectedPeripherals,
    scannedPeripherals,
    characteristicValues,
    notifiedCharacteristic,
    startScan,
    stopScan,
    connect,
    disconnect,
    retrieveServices,
    handlePressNotification,
    handlePressRead,
    handlePressWrite,
  } = useBLEDevice();
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedCharacteristic, setSelectedCharacteristic] = useState<{
    serviceUUID: string;
    characteristicUUID: string;
  } | null>(null);
  const [peripheralInfo, setPeripheralInfo] = useState<PeripheralInfo | null>(
    null,
  );

  const providedServices =
    peripheralInfo?.services?.filter(({uuid}) => uuid.length > 32) ?? [];
  const providedCharacteristics = peripheralInfo?.characteristics ?? [];
  const isScanned = scannedPeripherals.has(peripheralId);
  const isConnected = connectedPeripherals.includes(peripheralId);

  useEffect(() => {
    if (!isConnected && !isScanned) {
      startScan(10);
    } else {
      stopScan();
    }
    if (!isScanned && isConnected) {
      connect(peripheralId);
    }
  }, [isScanned, isConnected, startScan, stopScan, connect, peripheralId]);

  useEffect(() => {
    if (isConnected) {
      retrieveServices(peripheralId).then(setPeripheralInfo);
    }
  }, [isConnected, retrieveServices, peripheralId]);

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
        peripheralId,
        serviceUUID: selectedCharacteristic.serviceUUID,
        characteristicUUID: selectedCharacteristic.characteristicUUID,
        data: Array.from(Buffer.from(inputValue)),
      });
      setIsInputModalOpen(false);
      setInputValue('');
    }
  }, [peripheralId, selectedCharacteristic, inputValue, handlePressWrite]);

  if (!isConnected && !isScanned)
    return <LoadingIndicator message="기기를 검색 중..." />;

  return (
    <>
      <View style={{flex: 1, gap: 16, paddingHorizontal: 10}}>
        <View style={{flex: 1}}>
          <DeviceSettingHeader
            deviceName={device_name ?? peripheralId}
            isConnected={isConnected}
            onPressConnect={() => connect(peripheralId)}
            onPressDisconnect={() => disconnect(peripheralId)}
            onPressGoBack={() => navigation.goBack()}
          />
          {isConnected &&
            peripheralInfo &&
            providedServices.map(({uuid: serviceUUID}) => {
              return (
                <Accordion key={serviceUUID}>
                  <AccordionTrigger>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>설정</Text>
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
                                    peripheralId,
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
                                    peripheralId,
                                    characteristicUUID,
                                    serviceUUID,
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
