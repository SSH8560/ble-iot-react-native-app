import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import Accordion, {
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import CharacteristicCard from './components/CharacteristicCard';
import DeviceSettingHeader from './components/DeviceSettingHeader';
import LoadingIndicator from '../../components/LoadingIndicator';
import {BLEProvider, useBLEManager} from '@/providers/BLEProvider';
import useBLELoadCellService from '@/hooks/ble/useBLELoadCellService';
import useBLESettingService from '@/hooks/ble/useBLESettingService';
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
    scannedPeripherals,
    connectedPeripherals,
    startScan,
    stopScan,
    connect,
    disconnect,
    retrieveServices,
  } = useBLEManager();
  const {
    calibration,
    startNotifyCalibration,
    stopNotifyCalibration,
    readCalibration,
    weight,
    isNotifyingWeight,
    writeCalibration,
    startNotifyWeight,
    stopNotifyWeight,
    readWeight,
    tare,
  } = useBLELoadCellService({peripheralId});
  const {
    connection,
    deviceInfo,
    wifiCredential,
    startNotifyWifiCredential,
    stopNotifyWifiCredential,
    readWifiCredential,
    writeWifiCredential,
    readConnection,
    startNotifyConnection,
    readDeviceInfo,
    isNotifyingConnection,
    isNotifyingWifiCredential,
    stopNotifyConnection,
  } = useBLESettingService({
    peripheralId,
  });

  const isScanned = scannedPeripherals.has(peripheralId);
  const isConnected = connectedPeripherals.includes(peripheralId);

  useEffect(() => {
    if (!isConnected && !isScanned) {
      startScan([], 10);
    } else {
      stopScan();
    }
    if (!isScanned && isConnected) {
      connect(peripheralId);
    }
  }, [isScanned, isConnected, startScan, stopScan, connect, peripheralId]);

  useEffect(() => {
    if (isConnected) {
      retrieveServices(peripheralId);
    }
  }, [isConnected, retrieveServices, peripheralId]);

  if (!isConnected && !isScanned)
    return <LoadingIndicator message="기기를 검색 중..." />;

  return (
    <View style={{flex: 1, gap: 16, paddingHorizontal: 10}}>
      <View style={{flex: 1}}>
        <DeviceSettingHeader
          deviceName={device_name ?? peripheralId}
          isConnected={isConnected}
          onPressConnect={() => connect(peripheralId)}
          onPressDisconnect={() => disconnect(peripheralId)}
          onPressGoBack={() => navigation.goBack()}
        />
        {isConnected && (
          <View>
            <Accordion>
              <AccordionTrigger>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>설정</Text>
              </AccordionTrigger>
              <AccordionContent>
                <CharacteristicCard
                  label="와이파이"
                  value={`${wifiCredential.ssid},${wifiCredential.password}`}
                  isNotifying={isNotifyingWifiCredential}
                  onPressStartNotify={startNotifyWifiCredential}
                  onPressStopNotify={stopNotifyWifiCredential}
                  onPressRead={readWifiCredential}
                />
                <CharacteristicCard
                  label="인터넷 연결상태"
                  value={`${connection}`}
                  isNotifying={isNotifyingConnection}
                  onPressStartNotify={startNotifyConnection}
                  onPressStopNotify={stopNotifyConnection}
                  onPressRead={readConnection}
                />
                <CharacteristicCard
                  label="기기 정보"
                  value={`${deviceInfo.type},${deviceInfo.uuid}`}
                  onPressRead={readDeviceInfo}
                />
              </AccordionContent>
            </Accordion>
            <Accordion>
              <AccordionTrigger>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>저울</Text>
              </AccordionTrigger>
              <AccordionContent>
                <CharacteristicCard
                  label="무게"
                  value={`${weight}`}
                  isNotifying={isNotifyingWeight}
                  onPressRead={readWeight}
                  onPressStartNotify={startNotifyWeight}
                  onPressStopNotify={stopNotifyWeight}
                />
              </AccordionContent>
            </Accordion>
          </View>
        )}
      </View>
    </View>
  );
};

const WrappedScaleDeviceSettingScreen = (
  props: ScaleDeviceSettingScreenProps,
) => (
  <BLEProvider>
    <ScaleDeviceSettingScreen {...props} />
  </BLEProvider>
);

export default WrappedScaleDeviceSettingScreen;
