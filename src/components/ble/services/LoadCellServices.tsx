import React from 'react';
import ServiceLayout from '../layout/ServiceLayout';
import useBLELoadCellService from '@/hooks/ble/useBLELoadCellService';
import CharacteristicCard from '../card/CharacteristicCard';

interface LoadCellServicesProps {
  peripheralId: string;
}

const LoadCellServices: React.FC<LoadCellServicesProps> = ({peripheralId}) => {
  const {
    calibration,
    startNotifyCalibration,
    stopNotifyCalibration,
    readCalibration,
    weight,
    isNotifyingWeight,
    writeCalibration,
    startNotifyWeight,
    stopNotifyWeight,
    readWeight,
    tare,
  } = useBLELoadCellService({peripheralId});

  return (
    <ServiceLayout title="무게">
      <CharacteristicCard
        label="무게"
        value={`${weight}`}
        isNotifying={isNotifyingWeight}
        onPressRead={readWeight}
        onPressStartNotify={startNotifyWeight}
        onPressStopNotify={stopNotifyWeight}
      />
    </ServiceLayout>
  );
};

export default LoadCellServices;
