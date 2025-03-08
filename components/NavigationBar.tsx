import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NavigationBarProps {
  onHomePress: () => void;
  onAddPress: () => void;
  onSettingsPress: () => void;
}

export function NavigationBar({ onHomePress, onAddPress, onSettingsPress }: NavigationBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onHomePress} style={styles.button}>
        <Ionicons name="home-outline" size={24} color="#333" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onAddPress} style={styles.addButton}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onSettingsPress} style={styles.button}>
        <Ionicons name="settings-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    padding: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Lift it up a bit
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 