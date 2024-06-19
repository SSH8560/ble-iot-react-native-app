import {CHARACTERISTIC_MAP} from '@/libs/ble';
import {View} from 'react-native';

interface CharacteristicCardProps {
  serviceUUID: string;
  characteristicUUID: string;
  value: number | string | null;
  onPressRead: () => void;
  onPressWrite: () => void;
  onPressNotify: () => void;
}

const CharacteristicCard = ({characteristicUUID}: CharacteristicCardProps) => {
  const characteristicInfo = CHARACTERISTIC_MAP.get(characteristicUUID);
  if (!characteristicInfo) return null;

  const {label, serviceUuid, uuid, valueType} = characteristicInfo;

  return <View></View>;
};

export default CharacteristicCard;
