import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TermsOfService() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#1a1a1a' : '#fff';
  const textColor = isDark ? '#fff' : '#000';
  const borderColor = isDark ? '#333' : '#ddd';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.section, { color: textColor }]}>
          Last Updated: {new Date().toLocaleDateString()}
        </Text>

        <Text style={[styles.section, { color: textColor }]}>
          By using the Habit Tracker App, you agree to these Terms of Service. Please read them carefully.
        </Text>

        <Text style={[styles.heading, { color: textColor }]}>1. Acceptance of Terms</Text>
        <Text style={[styles.text, { color: textColor }]}>
          By accessing or using the app, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the app.
        </Text>

        <Text style={[styles.heading, { color: textColor }]}>2. User Accounts</Text>
        <Text style={[styles.text, { color: textColor }]}>
          • You may use the app in guest mode without registration{'\n'}
          • Account features require registration{'\n'}
          • You are responsible for maintaining account security{'\n'}
          • You must provide accurate information when creating an account
        </Text>

        <Text style={[styles.heading, { color: textColor }]}>3. App Usage</Text>
        <Text style={[styles.text, { color: textColor }]}>
          • Use the app only for its intended purpose{'\n'}
          • Do not attempt to breach security{'\n'}
          • Do not use the app for illegal activities{'\n'}
          • Respect other users' privacy
        </Text>

        <Text style={[styles.heading, { color: textColor }]}>4. Data and Privacy</Text>
        <Text style={[styles.text, { color: textColor }]}>
          • We collect and use data as described in our Privacy Policy{'\n'}
          • You retain ownership of your data{'\n'}
          • We may delete inactive accounts after extended periods
        </Text>

        <Text style={[styles.heading, { color: textColor }]}>5. Changes to Terms</Text>
        <Text style={[styles.text, { color: textColor }]}>
          We may update these terms at any time. Continued use of the app after changes constitutes acceptance of new terms.
        </Text>

        <Text style={[styles.heading, { color: textColor }]}>6. Termination</Text>
        <Text style={[styles.text, { color: textColor }]}>
          We reserve the right to terminate or suspend access to the app for violations of these terms or for any other reason.
        </Text>

        <Text style={[styles.heading, { color: textColor }]}>7. Contact</Text>
        <Text style={[styles.text, { color: textColor }]}>
          For any questions about these Terms, please contact us at support@habittracker.com
        </Text>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    fontSize: 16,
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  bottomSpacing: {
    height: 40,
  },
}); 