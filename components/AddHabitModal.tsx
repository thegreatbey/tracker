import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (habitName: string) => void;
  colorScheme?: 'light' | 'dark';
}

export function AddHabitModal({ visible, onClose, onAdd, colorScheme = 'light' }: AddHabitModalProps) {
  const [habitName, setHabitName] = useState('');

  const handleAdd = () => {
    if (habitName.trim()) {
      onAdd(habitName);
      setHabitName('');
      onClose();
    }
  };

  const backgroundColor = colorScheme === 'dark' ? '#1a1a1a' : '#fff';
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';
  const borderColor = colorScheme === 'dark' ? '#333' : '#ddd';
  const placeholderColor = colorScheme === 'dark' ? '#666' : '#999';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor }]}>
          <Text style={[styles.modalTitle, { color: textColor }]}>Add New Habit</Text>
          
          <TextInput
            style={[
              styles.input,
              { 
                borderColor,
                color: textColor,
                backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff'
              }
            ]}
            value={habitName}
            onChangeText={setHabitName}
            placeholder="Enter habit name"
            placeholderTextColor={placeholderColor}
            autoFocus
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[
                styles.cancelButtonText,
                { color: colorScheme === 'dark' ? '#fff' : '#333' }
              ]}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={handleAdd}
            >
              <Text style={styles.addButtonText}>Add Habit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
}); 