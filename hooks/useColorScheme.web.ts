import { useEffect, useState } from 'react';

const COLOR_SCHEME_KEY = '@color_scheme';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [colorScheme, setColorSchemeState] = useState<'light' | 'dark'>('light');
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    loadSavedColorScheme();
    setHasHydrated(true);
  }, []);

  const loadSavedColorScheme = () => {
    try {
      const savedScheme = localStorage.getItem(COLOR_SCHEME_KEY);
      if (savedScheme) {
        setColorSchemeState(savedScheme as 'light' | 'dark');
      } else {
        // Check system preference for web
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setColorSchemeState(prefersDark ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Error loading color scheme:', error);
    }
  };

  const setColorScheme = (scheme: 'light' | 'dark') => {
    try {
      localStorage.setItem(COLOR_SCHEME_KEY, scheme);
      setColorSchemeState(scheme);
    } catch (error) {
      console.error('Error saving color scheme:', error);
    }
  };

  if (!hasHydrated) {
    return {
      colorScheme: 'light',
      setColorScheme,
      systemColorScheme: 'light'
    };
  }

  return {
    colorScheme,
    setColorScheme,
    systemColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  };
}
