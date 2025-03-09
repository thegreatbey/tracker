import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useColorScheme } from '@/hooks/useColorScheme';
import { guestStorage } from '@/hooks/useGuestStorage';
import { SettingsProps, NativeSettingsState } from './types';
import { BaseSettings } from './BaseSettings';

// Request notification permissions and set up channel
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function setUpNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('guest-reminders', {
      name: 'Guest Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}

export function Settings({ onClose, onResetData }: SettingsProps) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [state, setState] = useState<NativeSettingsState>({
    isDarkMode: colorScheme === 'dark',
    isDailyReminderEnabled: false,
    reminderTime: '21:00',
  });
  const [showTimePicker, setShowTimePicker] = useState(false);

  const base = BaseSettings({ onClose, onResetData });

  useEffect(() => {
    setUpNotificationChannel();
    loadSettings();
    return () => {
      // Clean up notifications when component unmounts (session ends)
      Notifications.cancelAllScheduledNotificationsAsync();
    };
  }, []);

  const loadSettings = async () => {
    try {
      const [savedDarkMode, savedReminderEnabled, savedReminderTime] = await Promise.all([
        guestStorage.getItem('darkMode'),
        guestStorage.getItem('reminderEnabled'),
        guestStorage.getItem('reminderTime')
      ]);

      const newState: Partial<NativeSettingsState> = {};

      if (savedDarkMode !== null) {
        const isDark = savedDarkMode === 'true';
        newState.isDarkMode = isDark;
        setColorScheme(isDark ? 'dark' : 'light');
      }

      if (savedReminderEnabled !== null) {
        newState.isDailyReminderEnabled = savedReminderEnabled === 'true';
      }

      if (savedReminderTime) {
        newState.reminderTime = savedReminderTime;
      }

      setState(prev => ({ ...prev, ...newState }));
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

  const toggleDailyReminder = async (value: boolean) => {
    try {
      setState(prev => ({ ...prev, isDailyReminderEnabled: value }));
      await guestStorage.setItem('reminderEnabled', value.toString());
      
      if (value) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Please enable notifications in your device settings to receive reminders.');
          setState(prev => ({ ...prev, isDailyReminderEnabled: false }));
          await guestStorage.setItem('reminderEnabled', 'false');
          return;
        }
        await scheduleNotification();
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const scheduleNotification = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      const [hours, minutes] = state.reminderTime.split(':').map(Number);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Habit Tracker Reminder',
          body: 'Time to check in on your habits!',
          sound: true,
          ...(Platform.OS === 'android' && {
            channelId: 'guest-reminders',
            priority: Notifications.AndroidNotificationPriority.HIGH,
          }),
        },
        trigger: {
          hour: hours,
          minute: minutes,
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
        },
      });

      await guestStorage.setItem('reminderTime', state.reminderTime);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const newTime = `${hours}:${minutes}`;
      
      setState(prev => ({ ...prev, reminderTime: newTime }));
      if (state.isDailyReminderEnabled) {
        scheduleNotification();
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: base.theme.backgroundColor }]}>
      {base.headerContent}
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: base.theme.textColor }]}>Notifications</Text>
          <View style={[styles.settingItem, { borderBottomColor: base.theme.borderColor }]}>
            <Text style={[styles.settingLabel, { color: base.theme.textColor }]}>Daily Reminder</Text>
            <Switch 
              value={state.isDailyReminderEnabled} 
              onValueChange={toggleDailyReminder}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={state.isDailyReminderEnabled ? '#007AFF' : '#f4f3f4'}
            />
          </View>
          <View style={[styles.settingItem, { borderBottomColor: base.theme.borderColor }]}>
            <Text style={[styles.settingLabel, { color: base.theme.textColor }]}>Reminder Time</Text>
            <TouchableOpacity 
              style={styles.timeButton}
              disabled={!state.isDailyReminderEnabled}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={[
                styles.timeButtonText,
                !state.isDailyReminderEnabled && styles.disabledText,
                { color: base.theme.textColor }
              ]}>{state.reminderTime}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Picker Modal */}
        {showTimePicker && (
          <DateTimePicker
            value={(() => {
              const [hours, minutes] = state.reminderTime.split(':').map(Number);
              const date = new Date();
              date.setHours(hours, minutes, 0);
              return date;
            })()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleTimeChange}
          />
        )}

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
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 16,
    marginRight: 4,
  },
  disabledText: {
    color: '#ccc',
  },
}); 