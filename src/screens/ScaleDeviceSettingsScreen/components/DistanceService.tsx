import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ServiceLayout from './ServiceLayout';
import CharacteristicCard from './CharacteristicCard';
import useBLEDistanceService from '@/hooks/ble/useBLEDistanceService';

interface DistanceServiceProps {
  peripheralId: string;
}

const DistanceService: React.FC<DistanceServiceProps> = ({peripheralId}) => {
  const {
    distance,
    isNotifyingDist,
    readDistance,
    startNotifyDistance,
    stopNotifyDistance,
  } = useBLEDistanceService({peripheralId});
  return (
    <ServiceLayout title="거리">
      <CharacteristicCard
        label="거리"
        value={distance}
        isNotifying={isNotifyingDist}
        onPressRead={() => readDistance()}
        onPressStartNotify={() => startNotifyDistance()}
        onPressStopNotify={() => stopNotifyDistance()}
      />
    </ServiceLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DistanceService;
