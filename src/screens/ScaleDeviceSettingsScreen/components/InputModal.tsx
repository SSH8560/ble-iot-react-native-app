import React from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

interface InputModalProps {
  isVisible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const InputModal: React.FC<InputModalProps> = ({
  isVisible,
  value,
  onChangeText,
  onSubmit,
  onClose,
}) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>값을 입력해주세요.</Text>
        <TextInput
          style={styles.valueInput}
          value={value}
          onChangeText={onChangeText}
        />
        <Button title="Submit" onPress={onSubmit} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: 'white', padding: 20, borderRadius: 10, gap: 20},
  title: {fontSize: 18, fontWeight: 'bold'},
  valueInput: {
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 10,
    padding: 5,
  },
});

export default InputModal;
