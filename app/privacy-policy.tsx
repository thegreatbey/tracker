import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function PrivacyPolicy() {
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
        <Text style={[styles.title, { color: textColor }]}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.section, { color: textColor }]}>
          Last Updated: {new Date().toLocaleDateString()}
        </Text>

        <Text style={[styles.section, { color: textColor }]}>
          Welcome to the Habit Tracker App. This Privacy Policy explains how we collect, use, and protect your information.
        </Text>

        <Text style={[styles.heading, { color: textColor }]}>Information We Collect</Text>
        <Text style={[styles.text, { color: textColor }]}>
          • Usage Data: We collect information about how you use the app{'\n'}
          • Settings Preferences: Your app settings and preferences{'\n'}
          • Habit Data: Information about your habits and tracking
        </Text>

        <Text style={[styles.heading, { color: textColor }]}>How We Use Your Information</Text>
        <Text style={[styles.text, { color: textColor }]}>
          • To provide and maintain the app functionality{'\n'}
          • To improve your user experience{'\n'}
          • To send notifications you've requested
        </Text>

        <Text style={[styles.heading, { color: textColor }]}>Data Storage</Text>
        <Text style={[styles.text, { color: textColor }]}>
          • Guest Mode: Data is stored temporarily and cleared when you close the app{'\n'}
          • Account Mode: Data is stored securely and synced across your devices
        </Text>

        <Text style={[styles.heading, { color: textColor }]}>Your Rights</Text>
        <Text style={[styles.text, { color: textColor }]}>
          You have the right to:{'\n'}
          • Access your data{'\n'}
          • Delete your data{'\n'}
          • Opt-out of notifications{'\n'}
          • Request data export
        </Text>

        <Text style={[styles.heading, { color: textColor }]}>Contact Us</Text>
        <Text style={[styles.text, { color: textColor }]}>
          If you have any questions about this Privacy Policy, please contact us at support@habittracker.com
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