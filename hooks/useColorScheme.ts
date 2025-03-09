import { useState, useEffect } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLOR_SCHEME_KEY = '@color_scheme';

export function useColorScheme() {
  const systemColorScheme = useNativeColorScheme();
  const [colorScheme, setColorSchemeState] = useState<'light' | 'dark'>(systemColorScheme || 'light');

  useEffect(() => {
    loadSavedColorScheme();
  }, []);

  const loadSavedColorScheme = async () => {
    try {
      const savedScheme = await AsyncStorage.getItem(COLOR_SCHEME_KEY);
      if (savedScheme) {
        setColorSchemeState(savedScheme as 'light' | 'dark');
      }
    } catch (error) {
      console.error('Error loading color scheme:', error);
    }
  };

  const setColorScheme = async (scheme: 'light' | 'dark') => {
    try {
      await AsyncStorage.setItem(COLOR_SCHEME_KEY, scheme);
      setColorSchemeState(scheme);
    } catch (error) {
      console.error('Error saving color scheme:', error);
    }
  };

  return {
    colorScheme,
    setColorScheme,
    systemColorScheme
  };
}
