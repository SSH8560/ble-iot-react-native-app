import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
} from 'react';

type HandlerMap = Map<string, (bytes: number[]) => void>;
const BLEContext = createContext<{
  handlerMap: HandlerMap;
}>({
  handlerMap: new Map(),
});

export const BLEProvider = ({children}: PropsWithChildren) => {
  const handlerMapRef = useRef(new Map<string, (bytes: number[]) => void>());

  return (
    <BLEContext.Provider
      value={{
        handlerMap: handlerMapRef.current,
      }}>
      {children}
    </BLEContext.Provider>
  );
};

export const useBLEContext = () => {
  const context = useContext(BLEContext);
  if (!context) throw new Error('BLEProvider안에서 사용해주세요');

  return context;
};
