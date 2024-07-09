import {getCharacteristicUUID, getServiceUUID} from '@/libs/ble';

const useBLEUUIDs = () => {
  return {
    settingServiceUUID: getServiceUUID('설정'),
    wifiCredentialCharacteristicUUID: getCharacteristicUUID('와이파이'),
    deviceInfoCharacteristicUUID: getCharacteristicUUID('기기'),
    connectionCharacteristicUUID: getCharacteristicUUID('연결상태'),
    loadCellServiceUUID: getServiceUUID('로드셀'),
    weightCharacteristic: getCharacteristicUUID('무게'),
    tareCharacteristic: getCharacteristicUUID('영점'),
    calibrationCharacteristic: getCharacteristicUUID('계수'),
    distanceServiceUUID: getServiceUUID('거리'),
    distanceCharacteristicUUID: getCharacteristicUUID('거리'),
    distanceChangeThresholdCharacteristicUUID: getCharacteristicUUID('변화량'),
  };
};

export default useBLEUUIDs;
