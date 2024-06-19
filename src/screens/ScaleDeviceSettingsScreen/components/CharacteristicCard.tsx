import {CHARACTERISTIC_MAP} from '@/libs/ble';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Buffer} from 'buffer';

interface CharacteristicCardProps {
  characteristicUUID: string;
  bytesValue: number[] | null;
  notified?: boolean;
  onPressRead?: () => void;
  onPressWrite?: () => void;
  onPressNotify?: () => void;
}

const CharacteristicCard = ({
  characteristicUUID,
  bytesValue,
  notified,
  onPressRead,
  onPressWrite,
  onPressNotify,
}: CharacteristicCardProps) => {
  const characteristicInfo = CHARACTERISTIC_MAP.get(characteristicUUID);
  if (!characteristicInfo) return null;

  const {label, valueType} = characteristicInfo;

  const value = bytesValue
    ? valueType === 'FLOAT'
      ? Buffer.from(bytesValue).readFloatLE()
      : String.fromCharCode(...bytesValue)
    : 'N/A';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.controllerContainer}>
          {onPressRead && (
            <IconButton name="download-outline" onPress={onPressRead} />
          )}
          {onPressWrite && <IconButton name="pencil" onPress={onPressWrite} />}
          {onPressNotify && (
            <IconButton
              name={notified ? 'notifications' : 'notifications-outline'}
              onPress={onPressNotify}
            />
          )}
        </View>
      </View>
      <View style={styles.content}>
        <Text>값 : {value}</Text>
      </View>
    </View>
  );
};

const IconButton = ({name, onPress}: {name: string; onPress: () => void}) => {
  return (
    <TouchableOpacity style={{width: 40, height: 40}} onPress={onPress}>
      <Icon name={name} size={28} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {fontSize: 18},
  controllerContainer: {flexDirection: 'row'},
  content: {},
});

export default CharacteristicCard;
