import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface CharacteristicCardProps {
  label: string;
  value: string | number | null;
  isNotifying?: boolean;
  onPressRead?: () => void;
  onPressWrite?: () => void;
  onPressStartNotify?: () => void;
  onPressStopNotify?: () => void;
}

const CharacteristicCard = ({
  label,
  value,
  isNotifying,
  onPressRead,
  onPressWrite,
  onPressStartNotify,
  onPressStopNotify,
}: CharacteristicCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.controllerContainer}>
          {onPressRead && (
            <IconButton name="download-outline" onPress={onPressRead} />
          )}
          {onPressWrite && <IconButton name="pencil" onPress={onPressWrite} />}
          {onPressStartNotify &&
            onPressStopNotify &&
            (isNotifying ? (
              <IconButton
                name={'notifications'}
                onPress={() => onPressStopNotify()}
              />
            ) : (
              <IconButton
                name={'notifications-outline'}
                onPress={() => onPressStartNotify()}
              />
            ))}
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
    <TouchableOpacity onPress={onPress} style={{width: 40, height: 40}}>
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
    alignItems: 'center',
  },
  label: {fontSize: 18},
  controllerContainer: {
    flexDirection: 'row',
    width: 120,
    justifyContent: 'flex-start',
  },
  content: {},
});

export default CharacteristicCard;
