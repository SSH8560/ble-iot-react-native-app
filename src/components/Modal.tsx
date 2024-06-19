import React, {createContext, useContext, useState} from 'react';
import {View, useWindowDimensions} from 'react-native';

interface ModalContextType {
  open: boolean;
}

const ModalContext = createContext<ModalContextType>({
  open: false,
});

interface ModalProps extends React.PropsWithChildren {}

const Modal = ({children}: ModalProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <ModalContext.Provider value={{open}}>
      <View>{children}</View>
    </ModalContext.Provider>
  );
};

interface ModalContentProps extends React.PropsWithChildren {}

export const ModalContent = ({children}: ModalContentProps) => {
  const {height, width} = useWindowDimensions();
  const {open} = useContext(ModalContext);

  if (!open) return null;

  return <View style={{position: 'absolute', width, height}}>{children}</View>;
};

export default Modal;
