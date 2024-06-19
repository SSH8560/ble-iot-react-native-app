import React, {PropsWithChildren, createContext, useContext} from 'react';
import {useBLEDevice} from '@/hooks/useBLEDevice';

const BleContext = createContext<ReturnType<typeof useBLEDevice> | null>(null);

export const BLEProvider = ({children}: PropsWithChildren) => {
  const ble = useBLEDevice();

  return <BleContext.Provider value={ble}>{children}</BleContext.Provider>;
};

export const useBLE = () => {
  const context = useContext(BleContext);
  if (!context) throw new Error('BleProvider안에서 사용해주세요');

  return context;
};
