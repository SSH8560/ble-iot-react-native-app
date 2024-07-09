import React from 'react';
import ServiceLayout from '../layout/ServiceLayout';
import CharacteristicCard from '../card/CharacteristicCard';
import useBLEDistanceService from '@/hooks/ble/useBLEDistanceService';

interface DistanceServicesProps {
  peripheralId: string;
}

const DistanceServices: React.FC<DistanceServicesProps> = ({peripheralId}) => {
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

export default DistanceServices;
