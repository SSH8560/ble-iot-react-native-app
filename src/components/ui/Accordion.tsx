import React, {createContext, useCallback, useContext, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';

interface AccordionContextType {
  open: boolean;
  toggleOpen: () => void;
}

const AccordionContext = createContext<AccordionContextType>({
  open: false,
  toggleOpen() {},
});

interface AccordionProps extends React.PropsWithChildren {}

const Accordion = ({children}: AccordionProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const toggleOpen = useCallback(() => {
    setOpen(prevState => !prevState);
  }, []);

  return (
    <AccordionContext.Provider value={{open, toggleOpen}}>
      {children}
    </AccordionContext.Provider>
  );
};

interface AccordionTriggerProps extends React.PropsWithChildren {}

export const AccordionTrigger = ({children}: AccordionTriggerProps) => {
  const {toggleOpen} = useContext<AccordionContextType>(AccordionContext);

  return (
    <TouchableOpacity onPress={() => toggleOpen()}>{children}</TouchableOpacity>
  );
};

interface AccordionContentProps extends React.PropsWithChildren {}

export const AccordionContent = ({children}: AccordionContentProps) => {
  const {open} = useContext<AccordionContextType>(AccordionContext);

  if (!open) return null;

  return children;
};

export default Accordion;
