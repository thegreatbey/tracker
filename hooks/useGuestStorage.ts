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
  getItem: async (key: string) => {
    try {
      return window.sessionStorage.getItem(key);
    } catch (error) {
      console.error('Failed to get item from sessionStorage:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to set item in sessionStorage:', error);
      throw error;
    }
  },
  removeItem: async (key: string) => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove item from sessionStorage:', error);
      throw error;
    }
  },
  clear: async () => {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error);
      throw error;
    }
  },
};

// In native, we use AsyncStorage but with a guest prefix
const nativeStorage: Storage = {
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(`guest_${key}`);
    } catch (error) {
      console.error('Failed to get item from AsyncStorage:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(`guest_${key}`, value);
    } catch (error) {
      console.error('Failed to set item in AsyncStorage:', error);
      throw error;
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(`guest_${key}`);
    } catch (error) {
      console.error('Failed to remove item from AsyncStorage:', error);
      throw error;
    }
  },
  clear: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const guestKeys = keys.filter(key => key.startsWith('guest_'));
      if (guestKeys.length > 0) {
        await AsyncStorage.multiRemove(guestKeys);
      }
    } catch (error) {
      console.error('Failed to clear guest keys from AsyncStorage:', error);
      throw error;
    }
  },
};

// Export the appropriate storage based on platform
export const guestStorage: Storage = Platform.OS === 'web' ? webStorage : nativeStorage; 