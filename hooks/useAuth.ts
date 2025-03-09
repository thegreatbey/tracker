import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GUEST_DATA_KEY = '@guest_data';

interface GuestData {
  habits: any[];
  settings: {
    darkMode: boolean;
    notifications: boolean;
    reminderTime: string;
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    loadGuestData();

    return () => unsubscribe();
  }, []);

  const loadGuestData = async () => {
    try {
      const data = await AsyncStorage.getItem(GUEST_DATA_KEY);
      if (data) {
        setGuestData(JSON.parse(data));
      } else {
        // Initialize empty guest data
        const initialData: GuestData = {
          habits: [],
          settings: {
            darkMode: false,
            notifications: false,
            reminderTime: '21:00',
          },
        };
        await AsyncStorage.setItem(GUEST_DATA_KEY, JSON.stringify(initialData));
        setGuestData(initialData);
      }
    } catch (error) {
      console.error('Error loading guest data:', error);
    }
  };

  const saveGuestData = async (data: GuestData) => {
    try {
      await AsyncStorage.setItem(GUEST_DATA_KEY, JSON.stringify(data));
      setGuestData(data);
    } catch (error) {
      console.error('Error saving guest data:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // If guest data exists, we might want to merge it with user data
      if (guestData && guestData.habits.length > 0) {
        // TODO: Implement merging guest data with user data
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // If guest data exists, we might want to associate it with the new account
      if (guestData && guestData.habits.length > 0) {
        // TODO: Implement associating guest data with new account
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      // Clear guest data on logout
      await AsyncStorage.removeItem(GUEST_DATA_KEY);
      setGuestData(null);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    loading,
    guestData,
    signIn,
    signUp,
    logOut,
    saveGuestData,
  };
} 