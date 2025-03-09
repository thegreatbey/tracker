import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { guestStorage } from '@/hooks/useGuestStorage';

interface SettingsProps {
  onClose: () => void;
  onResetData: () => Promise<void>;
}

export function Settings({ onClose, onResetData }: SettingsProps) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedDarkMode = await guestStorage.getItem('darkMode');
      if (savedDarkMode !== null) {
        const isDark = savedDarkMode === 'true';
        setIsDarkMode(isDark);
        setColorScheme(isDark ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const toggleDarkMode = async (value: boolean) => {
    setIsDarkMode(value);
    setColorScheme(value ? 'dark' : 'light');
    try {
      await guestStorage.setItem('darkMode', value.toString());
    } catch (error) {
      console.error('Error saving dark mode setting:', error);
    }
  };

  const handleResetData = async () => {
    try {
      await guestStorage.clear();
      await onResetData();
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  };

  const backgroundColor = isDarkMode ? '#1a1a1a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const borderColor = isDarkMode ? '#333' : '#ddd';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Display</Text>
          <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <Text style={[styles.settingLabel, { color: textColor }]}>Dark Mode</Text>
            <Switch 
              value={isDarkMode} 
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDarkMode ? '#007AFF' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>About</Text>
          <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <Text style={[styles.settingLabel, { color: textColor }]}>Version</Text>
            <Text style={[styles.settingValue, { color: textColor }]}>1.0.0</Text>
          </View>
          {Platform.OS === 'web' ? (
            <>
              <TouchableOpacity 
                style={[styles.settingItem, { borderBottomColor: borderColor }]}
                onPress={() => router.push('/privacy-policy')}
              >
                <Text style={[styles.settingLabel, { color: textColor }]}>Privacy Policy</Text>
                <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#fff' : '#666'} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.settingItem, { borderBottomColor: borderColor }]}
                onPress={() => router.push('/terms-of-service')}
              >
                <Text style={[styles.settingLabel, { color: textColor }]}>Terms of Service</Text>
                <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#fff' : '#666'} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Link href="/privacy-policy" asChild>
                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: borderColor }]}>
                  <Text style={[styles.settingLabel, { color: textColor }]}>Privacy Policy</Text>
                  <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#fff' : '#666'} />
                </TouchableOpacity>
              </Link>
              <Link href="/terms-of-service" asChild>
                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: borderColor }]}>
                  <Text style={[styles.settingLabel, { color: textColor }]}>Terms of Service</Text>
                  <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#fff' : '#666'} />
                </TouchableOpacity>
              </Link>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Data</Text>
          <TouchableOpacity 
            style={[styles.settingItem, styles.resetButton]} 
            onPress={handleResetData}
          >
            <Text style={styles.resetButtonText}>Reset All Data</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});