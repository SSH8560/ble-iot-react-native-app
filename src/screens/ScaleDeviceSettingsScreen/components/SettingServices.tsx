import React from 'react';
import ServiceLayout from './ServiceLayout';
import useBLESettingService from '@/hooks/ble/useBLESettingService';
import CharacteristicCard from './CharacteristicCard';

interface SettingServicesProps {
  peripheralId: string;
}

const SettingServices: React.FC<SettingServicesProps> = ({peripheralId}) => {
  const {
    connection,
    deviceInfo,
    wifiCredential,
    startNotifyWifiCredential,
    stopNotifyWifiCredential,
    readWifiCredential,
    readConnection,
    startNotifyConnection,
    readDeviceInfo,
    isNotifyingConnection,
    isNotifyingWifiCredential,
    stopNotifyConnection,
  } = useBLESettingService({
    peripheralId,
  });

  return (
    <ServiceLayout title="설정">
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
    </ServiceLayout>
  );
};

export default SettingServices;
