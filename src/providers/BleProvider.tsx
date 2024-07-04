import useBLE from '@/hooks/ble/useBLE';
import React, {PropsWithChildren, createContext, useContext} from 'react';

const BLEContext = createContext<ReturnType<typeof useBLE> | null>(null);

export const BLEProvider = ({children}: PropsWithChildren) => {
  const ble = useBLE();

  return <BLEContext.Provider value={ble}>{children}</BLEContext.Provider>;
};

export const useBLEManager = () => {
  const context = useContext(BLEContext);
  if (!context) throw new Error('BLEProvider안에서 사용해주세요');

  const {
    scannedPeripherals,
    connectedPeripherals,
    startScan,
    stopScan,
    connect,
    disconnect,
    retrieveServices,
  } = context;
  return {
    scannedPeripherals,
    connectedPeripherals,
    startScan,
    stopScan,
    connect,
    disconnect,
    retrieveServices,
  };
};

export const useBLECharacteristic = () => {
  const context = useContext(BLEContext);
  if (!context) throw new Error('BLEProvider안에서 사용해주세요');

  const {read, write, startNotification, stopNotification} = context;
  return {read, write, startNotification, stopNotification};
};
