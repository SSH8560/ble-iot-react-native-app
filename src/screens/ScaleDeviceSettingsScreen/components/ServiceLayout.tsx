import Accordion, {
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import React from 'react';
import {Text, StyleSheet} from 'react-native';

interface ServiceLayoutProps extends React.PropsWithChildren {
  title: string;
}

const ServiceLayout: React.FC<ServiceLayoutProps> = ({title, children}) => {
  return (
    <Accordion>
      <AccordionTrigger>
        <Text style={styles.title}>{title}</Text>
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </Accordion>
  );
};

const styles = StyleSheet.create({
  title: {fontSize: 18, fontWeight: 'bold'},
});

export default ServiceLayout;
