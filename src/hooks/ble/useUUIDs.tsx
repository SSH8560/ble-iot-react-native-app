import {getCharacteristicUUID, getServiceUUID} from '@/libs/ble';

const useUUIDs = () => {
  return {
    loadCellServiceUUID: getServiceUUID('로드셀'),
    settingServiceUUID: getServiceUUID('설정'),
    wifiCredentialCharacteristicUUID: getCharacteristicUUID('와이파이'),
    deviceInfoCharacteristicUUID: getCharacteristicUUID('기기'),
    connectionCharacteristicUUID: getCharacteristicUUID('연결상태'),
  };
};

export default useUUIDs;
