import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function PrivacyPolicy() {
  return (
    <>
      <Stack.Screen options={{ title: 'Privacy Policy' }} />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText type="title">Privacy Policy</ThemedText>
          <ThemedText style={styles.lastUpdated}>Last Updated: March 2024</ThemedText>
          
          <ThemedText type="subtitle">Information We Collect</ThemedText>
          <ThemedText>
            We collect information that you provide directly to us when using the Habit Tracker app,
            including habit data and user preferences.
          </ThemedText>

          <ThemedText type="subtitle">How We Use Your Information</ThemedText>
          <ThemedText>
            We use the information to provide and improve the Habit Tracker service, including:
            {'\n'}- Storing and managing your habits
            {'\n'}- Calculating streaks and progress
            {'\n'}- Providing notifications (if enabled)
          </ThemedText>

          <ThemedText type="subtitle">Data Storage</ThemedText>
          <ThemedText>
            Your data is stored securely and is not shared with third parties. Guest mode data
            is stored locally on your device and is cleared when you log out.
          </ThemedText>

          <ThemedText type="subtitle">Contact Us</ThemedText>
          <ThemedText>
            If you have any questions about this Privacy Policy, please contact us at:
            support@habittracker.com
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  lastUpdated: {
    color: '#666',
    marginBottom: 20,
  },
}); 