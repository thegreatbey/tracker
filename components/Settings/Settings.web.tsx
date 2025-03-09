import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { guestStorage } from '@/hooks/useGuestStorage';
import { SettingsProps, WebSettingsState } from './types';
import { BaseSettings } from './BaseSettings';

export function Settings({ onClose, onResetData }: SettingsProps) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [state, setState] = useState<WebSettingsState>({
    isDarkMode: colorScheme === 'dark'
  });

  const base = BaseSettings({ onClose, onResetData });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedDarkMode = await guestStorage.getItem('darkMode');
      if (savedDarkMode !== null) {
        const isDark = savedDarkMode === 'true';
        setState(prev => ({ ...prev, isDarkMode: isDark }));
        setColorScheme(isDark ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const toggleDarkMode = async (value: boolean) => {
    setState(prev => ({ ...prev, isDarkMode: value }));
    setColorScheme(value ? 'dark' : 'light');
    try {
      await guestStorage.setItem('darkMode', value.toString());
    } catch (error) {
      console.error('Error saving dark mode setting:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: base.theme.backgroundColor }]}>
      {base.headerContent}
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: base.theme.textColor }]}>Display</Text>
          <View style={[styles.settingItem, { borderBottomColor: base.theme.borderColor }]}>
            <Text style={[styles.settingLabel, { color: base.theme.textColor }]}>Dark Mode</Text>
            <Switch 
              value={state.isDarkMode} 
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={state.isDarkMode ? '#007AFF' : '#f4f3f4'}
            />
          </View>
        </View>

        {base.aboutSection}
        {base.dataSection}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
}); 