import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TermsOfService() {
  return (
    <>
      <Stack.Screen options={{ title: 'Terms of Service' }} />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText type="title">Terms of Service</ThemedText>
          <ThemedText style={styles.lastUpdated}>Last Updated: March 2024</ThemedText>
          
          <ThemedText type="subtitle">1. Acceptance of Terms</ThemedText>
          <ThemedText>
            By accessing or using the Habit Tracker app, you agree to be bound by these Terms of Service.
          </ThemedText>

          <ThemedText type="subtitle">2. User Data</ThemedText>
          <ThemedText>
            You retain all rights to your data. By using the app, you grant us the right to store and
            process your data to provide the service.
          </ThemedText>

          <ThemedText type="subtitle">3. User Responsibilities</ThemedText>
          <ThemedText>
            You are responsible for:
            {'\n'}- Maintaining the confidentiality of your account
            {'\n'}- All activities that occur under your account
            {'\n'}- Ensuring your data is accurate
          </ThemedText>

          <ThemedText type="subtitle">4. Service Modifications</ThemedText>
          <ThemedText>
            We reserve the right to modify or discontinue the service at any time, with or without notice.
          </ThemedText>

          <ThemedText type="subtitle">5. Contact</ThemedText>
          <ThemedText>
            For questions about these Terms, please contact: legal@habittracker.com
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