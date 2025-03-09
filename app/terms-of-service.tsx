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
          
          <ThemedText type="subtitle">1. Agreement to Terms</ThemedText>
          <ThemedText>
            By accessing or using the Habit Tracker app, you agree to be bound by these Terms of Service. 
            If you disagree with any part of these terms, you may not access the service.
          </ThemedText>

          <ThemedText type="subtitle">2. Description of Service</ThemedText>
          <ThemedText>
            Habit Tracker is a personal habit tracking application that allows users to:
            {'\n'}- Create and track daily habits
            {'\n'}- Monitor progress and streaks
            {'\n'}- Set reminders
            {'\n'}- View performance analytics
          </ThemedText>

          <ThemedText type="subtitle">3. User Accounts</ThemedText>
          <ThemedText>
            - You may use the app in guest mode or create an account
            {'\n'}- You are responsible for maintaining account security
            {'\n'}- You must provide accurate account information
            {'\n'}- You may not share account credentials
          </ThemedText>

          <ThemedText type="subtitle">4. Acceptable Use</ThemedText>
          <ThemedText>
            You agree not to:
            {'\n'}- Misuse the service
            {'\n'}- Attempt to gain unauthorized access
            {'\n'}- Use the service for illegal purposes
            {'\n'}- Interfere with other users' experience
          </ThemedText>

          <ThemedText type="subtitle">5. Data and Privacy</ThemedText>
          <ThemedText>
            - We collect and use data as described in our Privacy Policy
            {'\n'}- You retain ownership of your data
            {'\n'}- We may anonymize data for analytics
            {'\n'}- You can request data deletion
          </ThemedText>

          <ThemedText type="subtitle">6. Modifications</ThemedText>
          <ThemedText>
            We reserve the right to:
            {'\n'}- Modify or discontinue the service
            {'\n'}- Update these terms
            {'\n'}- Change pricing (with notice)
          </ThemedText>

          <ThemedText type="subtitle">7. Limitation of Liability</ThemedText>
          <ThemedText>
            We provide the service "as is" without warranties. We are not liable for:
            {'\n'}- Data loss
            {'\n'}- Service interruptions
            {'\n'}- Indirect damages
          </ThemedText>

          <ThemedText type="subtitle">8. Contact</ThemedText>
          <ThemedText>
            For questions about these Terms:
            {'\n'}Email: legal@habittracker.com
            {'\n'}Address: 123 Legal Avenue, Terms City, 12345
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