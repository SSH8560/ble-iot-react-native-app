import React, {PropsWithChildren, createContext, useContext} from 'react';
import {BleContextType} from './BleProvider.d';
import {useBLEDevice} from '@/hooks/useBLEDevice';

const BleContext = createContext<BleContextType | null>(null);

export const BleProvider = ({children}: PropsWithChildren) => {
  const ble = useBLEDevice();

  return (
    <BleContext.Provider
      value={{
        ...ble,
      }}>
      {children}
    </BleContext.Provider>
  );
};

export const useBLE = () => {
  const context = useContext(BleContext);
  if (!context) throw new Error('BleProvider안에서 사용해주세요');

  return context;
};
