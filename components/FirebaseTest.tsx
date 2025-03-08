import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { auth, firestore } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export function FirebaseTest() {
  const [status, setStatus] = useState('Testing Firebase connection...');

  useEffect(() => {
    async function testFirebase() {
      try {
        // Test Firestore
        const testCollection = collection(firestore, 'test');
        await getDocs(testCollection);
        setStatus('Firebase connection successful! 🎉');
      } catch (error: any) {
        setStatus(`Firebase error: ${error.message}`);
        console.error('Firebase test error:', error);
      }
    }

    testFirebase();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>{status}</Text>
    </View>
  );
} 