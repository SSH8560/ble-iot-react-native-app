import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import LoadingIndicator from '../../../components/LoadingIndicator';
import {BLEProvider, useBLEManager} from '@/providers/BLEProvider';
import SettingServices from '../../../components/ble/services/SettingServices';
import DistanceServices from '../../../components/ble/services/DistanceServices';
import DeviceSettingLayout from '../../../components/ble/layout/DeviceSettingLayout';
interface ScaleDeviceSettingScreenProps
  extends NativeStackScreenProps<RootStackParams, 'ScaleDeviceSetting'> {}

const ScaleDeviceSettingScreen = ({
  route: {
    params: {
      device: {peripheral_id: peripheralId},
    },
  },
}: ScaleDeviceSettingScreenProps) => {
  const {
    scannedPeripherals,
    connectedPeripherals,
    startScan,
    stopScan,
    connect,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanned, isConnected, peripheralId]);

  useEffect(() => {
    if (isConnected) {
      retrieveServices(peripheralId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, peripheralId]);

  if (!isConnected && !isScanned)
    return <LoadingIndicator message="기기를 검색 중..." />;

  return (
    <DeviceSettingLayout isConnected={isConnected} peripheralId={peripheralId}>
      <SettingServices peripheralId={peripheralId} />
      <DistanceServices peripheralId={peripheralId} />
    </DeviceSettingLayout>
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
