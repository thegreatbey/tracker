import React from 'react';
import { View } from 'react-native';
import { HabitTracker } from '../components/HabitTracker';
import { GuestStorageTest } from '../components/GuestStorageTest';

export default function Index() {
  // Following our Authentication State Focus:
  // 1. Guest mode - temporary/session only
  // 2. Clean initial state
  // 3. Proper visibility control
  return (
    <View style={{ flex: 1 }}>
      <GuestStorageTest />
      <HabitTracker />
    </View>
  );
} 