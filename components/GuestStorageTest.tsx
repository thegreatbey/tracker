import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { guestStorage } from '../hooks/useGuestStorage';

export function GuestStorageTest() {
  const [testValue, setTestValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const TEST_KEY = 'test_value';

  useEffect(() => {
    // Load initial value
    loadValue();
  }, []);

  const loadValue = async () => {
    try {
      setLoading(true);
      setError(null);
      const value = await guestStorage.getItem(TEST_KEY);
      setTestValue(value);
    } catch (err) {
      setError('Failed to load value');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveValue = async () => {
    try {
      setLoading(true);
      setError(null);
      const timestamp = new Date().toISOString();
      await guestStorage.setItem(TEST_KEY, timestamp);
      await loadValue();
    } catch (err) {
      setError('Failed to save value');
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearValue = async () => {
    try {
      setLoading(true);
      setError(null);
      await guestStorage.clear();
      await loadValue();
    } catch (err) {
      setError('Failed to clear values');
      console.error('Clear error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guest Storage Test</Text>
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Text style={styles.value}>Current Value: {testValue || 'None'}</Text>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.buttonContainer}>
        <Button title="Save New Value" onPress={saveValue} disabled={loading} />
        <Button title="Clear All" onPress={clearValue} disabled={loading} />
        <Button title="Reload Value" onPress={loadValue} disabled={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  value: {
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  buttonContainer: {
    gap: 10,
  },
}); 