import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { HabitTracker } from '../components/HabitTracker';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppLifecycle } from '@/hooks/useAppLifecycle';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  useAppLifecycle();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const isDark = colorScheme === 'dark';

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="privacy-policy" 
          options={{ 
            headerShown: true,
            title: 'Privacy Policy',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: isDark ? '#1a1a1a' : '#fff',
            },
            headerTintColor: isDark ? '#fff' : '#000',
          }} 
        />
        <Stack.Screen 
          name="terms-of-service" 
          options={{ 
            headerShown: true,
            title: 'Terms of Service',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: isDark ? '#1a1a1a' : '#fff',
            },
            headerTintColor: isDark ? '#fff' : '#000',
          }} 
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
