import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// In web guest mode, we use sessionStorage to ensure data doesn't persist across sessions
const webStorage: Storage = {
  getItem: async (key: string) => window.sessionStorage.getItem(key),
  setItem: async (key: string, value: string) => window.sessionStorage.setItem(key, value),
  removeItem: async (key: string) => window.sessionStorage.removeItem(key),
  clear: async () => window.sessionStorage.clear(),
};

// In native, we use AsyncStorage but with a guest prefix
const nativeStorage: Storage = {
  getItem: (key: string) => AsyncStorage.getItem(`guest_${key}`),
  setItem: (key: string, value: string) => AsyncStorage.setItem(`guest_${key}`, value),
  removeItem: (key: string) => AsyncStorage.removeItem(`guest_${key}`),
  clear: async () => {
    const keys = await AsyncStorage.getAllKeys();
    const guestKeys = keys.filter(key => key.startsWith('guest_'));
    await AsyncStorage.multiRemove(guestKeys);
  },
};

// Export the appropriate storage based on platform
export const guestStorage: Storage = Platform.OS === 'web' ? webStorage : nativeStorage; 