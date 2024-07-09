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
import SettingServices from './components/SettingServices';
import LoadCellServices from './components/LoadCellServices';
import DistanceService from './components/DistanceService';
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
            <SettingServices peripheralId={peripheralId} />
            <DistanceService peripheralId={peripheralId} />
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
