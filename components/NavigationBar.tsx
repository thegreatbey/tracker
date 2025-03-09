import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface NavigationBarProps {
  onHomePress: () => void;
  onAddPress: () => void;
  onSettingsPress: () => void;
  colorScheme?: 'light' | 'dark';
}

export function NavigationBar({ 
  onHomePress, 
  onAddPress, 
  onSettingsPress,
  colorScheme = 'light'
}: NavigationBarProps) {
  const router = useRouter();

  const iconColor = colorScheme === 'dark' ? '#fff' : '#333';
  const backgroundColor = colorScheme === 'dark' ? '#1a1a1a' : '#fff';
  const borderColor = colorScheme === 'dark' ? '#333' : '#eee';

  const handleHomePress = () => {
    router.replace('/');
    onHomePress();
  };

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor,
        borderTopColor: borderColor
      }
    ]}>
      <TouchableOpacity onPress={handleHomePress} style={styles.button}>
        <Ionicons name="home-outline" size={24} color={iconColor} />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onAddPress} style={styles.addButton}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onSettingsPress} style={styles.button}>
        <Ionicons name="settings-outline" size={24} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    padding: 10,
    borderRadius: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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