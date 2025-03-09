import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { guestStorage } from '@/hooks/useGuestStorage';
import { SettingsProps } from './types';

export function BaseSettings({ onClose, onResetData }: SettingsProps) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const backgroundColor = isDark ? '#1a1a1a' : '#fff';
  const textColor = isDark ? '#fff' : '#000';
  const borderColor = isDark ? '#333' : '#ddd';

  const handleResetData = async () => {
    try {
      await guestStorage.clear();
      await onResetData();
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  };

  return {
    headerContent: (
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>
    ),
    aboutSection: (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>About</Text>
        <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
          <Text style={[styles.settingLabel, { color: textColor }]}>Version</Text>
          <Text style={[styles.settingValue, { color: textColor }]}>1.0.0</Text>
        </View>
        <Link href="/privacy-policy" asChild>
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <Text style={[styles.settingLabel, { color: textColor }]}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#fff' : '#666'} />
          </TouchableOpacity>
        </Link>
        <Link href="/terms-of-service" asChild>
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <Text style={[styles.settingLabel, { color: textColor }]}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#fff' : '#666'} />
          </TouchableOpacity>
        </Link>
      </View>
    ),
    dataSection: (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Data</Text>
        <TouchableOpacity 
          style={[styles.settingItem, styles.resetButton]} 
          onPress={handleResetData}
        >
          <Text style={styles.resetButtonText}>Reset All Data</Text>
        </TouchableOpacity>
      </View>
    ),
    styles,
    theme: {
      isDark,
      backgroundColor,
      textColor,
      borderColor,
    }
  };
}

const styles = StyleSheet.create({
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