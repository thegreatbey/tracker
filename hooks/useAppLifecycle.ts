import { useEffect } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { guestStorage } from './useGuestStorage';

export function useAppLifecycle() {
  useEffect(() => {
    // For web, handle tab/window close and refresh
    if (Platform.OS === 'web') {
      const handleUnload = () => {
        guestStorage.clear();
      };
      
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          guestStorage.clear();
        }
      };

      window.addEventListener('beforeunload', handleUnload);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        window.removeEventListener('beforeunload', handleUnload);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    } else {
      // For native, handle app state changes
      let lastAppState = AppState.currentState;
      
      const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
        // Clear when app goes to background or is closed
        if (
          lastAppState.match(/active|inactive/) && 
          (nextAppState === 'background' || nextAppState === 'inactive')
        ) {
          guestStorage.clear();
        }
        lastAppState = nextAppState;
      });

      return () => {
        subscription.remove();
      };
    }
  }, []);
} 