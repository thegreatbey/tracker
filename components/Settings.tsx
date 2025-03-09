import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';

interface SettingsProps {
  onClose: () => void;
  onResetData: () => Promise<void>;
}

// Request notification permissions and set up channel
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Set up notification channel for Android
async function setUpNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('habit-reminders', {
      name: 'Habit Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}

export function Settings({ onClose, onResetData }: SettingsProps) {
  const [isDailyReminderEnabled, setIsDailyReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('21:00'); // 9:00 PM
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setUpNotificationChannel();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedReminderEnabled = await AsyncStorage.getItem('reminderEnabled');
      const savedReminderTime = await AsyncStorage.getItem('reminderTime');
      
      setIsDailyReminderEnabled(savedReminderEnabled === 'true');
      if (savedReminderTime) setReminderTime(savedReminderTime);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const toggleDailyReminder = async (value: boolean) => {
    try {
      setIsDailyReminderEnabled(value);
      await AsyncStorage.setItem('reminderEnabled', value.toString());
      
      if (value) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Please enable notifications in your device settings to receive reminders.');
          setIsDailyReminderEnabled(false);
          return;
        }
        scheduleNotification();
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
      
      const [hours, minutes] = reminderTime.split(':').map(Number);
      
      const notificationContent = {
        title: 'Habit Tracker Reminder',
        body: 'Time to check in on your habits!',
        sound: true,
        ...(Platform.OS === 'android' && {
          channelId: 'habit-reminders',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        }),
      };

      const notificationTrigger = {
        hour: hours,
        minute: minutes,
        repeats: true,
        ...(Platform.OS === 'ios' ? { type: 'calendar' } : { type: 'daily' }),
      };

      await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: notificationTrigger as any, // temporary type assertion until Expo types are updated
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const toggleDarkMode = (value: boolean) => {
    setColorScheme(value ? 'dark' : 'light');
  };

  const backgroundColor = colorScheme === 'dark' ? '#1a1a1a' : '#fff';
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';
  const borderColor = colorScheme === 'dark' ? '#333' : '#ddd';

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
          <Text style={[styles.sectionTitle, { color: textColor }]}>Notifications</Text>
          <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <Text style={[styles.settingLabel, { color: textColor }]}>Daily Reminder</Text>
            <Switch 
              value={isDailyReminderEnabled} 
              onValueChange={toggleDailyReminder} 
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDailyReminderEnabled ? '#007AFF' : '#f4f3f4'}
            />
          </View>
          <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <Text style={[styles.settingLabel, { color: textColor }]}>Reminder Time</Text>
            <TouchableOpacity 
              style={[styles.timeButton, { borderBottomColor: borderColor }]}
              disabled={!isDailyReminderEnabled}
            >
              <Text style={[
                styles.timeButtonText,
                !isDailyReminderEnabled && styles.disabledText,
                { color: textColor }
              ]}>{reminderTime}</Text>
              <Ionicons name="chevron-forward" size={20} color={isDailyReminderEnabled ? '#666' : '#ccc'} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Display</Text>
          <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <Text style={[styles.settingLabel, { color: textColor }]}>Dark Mode</Text>
            <Switch 
              value={colorScheme === 'dark'} 
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={colorScheme === 'dark' ? '#007AFF' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>About</Text>
          <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <Text style={[styles.settingLabel, { color: textColor }]}>Version</Text>
            <Text style={[styles.settingValue, { color: textColor }]}>1.0.0</Text>
          </View>
          <Link 
            href="/privacy-policy"
            asChild
          >
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: borderColor }]}>
              <Text style={[styles.settingLabel, { color: textColor }]}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color={colorScheme === 'dark' ? '#fff' : '#666'} />
            </TouchableOpacity>
          </Link>
          <Link 
            href="/terms-of-service"
            asChild
          >
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: borderColor }]}>
              <Text style={[styles.settingLabel, { color: textColor }]}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={20} color={colorScheme === 'dark' ? '#fff' : '#666'} />
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Data</Text>
          <TouchableOpacity 
            style={[styles.settingItem, styles.resetButton]} 
            onPress={onResetData}
          >
            <Text style={[styles.resetButtonText, { color: textColor }]}>Reset All Data</Text>
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
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 16,
    color: '#666',
    marginRight: 4,
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
  disabledText: {
    color: '#ccc',
  },
}); 