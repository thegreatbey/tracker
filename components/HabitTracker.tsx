import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { NavigationBar } from './NavigationBar';
import { AddHabitModal } from './AddHabitModal';
import { Settings } from './Settings';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from '@/providers/AuthProvider';

const GUEST_HABITS_KEY = '@guest_habits';

interface Habit {
  id: string;
  name: string;
  createdAt: Date;
  completions: { [date: string]: boolean };
  currentStreak: number;
  longestStreak: number;
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const { colorScheme } = useColorScheme();
  const { user } = useAuthContext();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadHabits();
  }, [user]);

  const loadHabits = async () => {
    try {
      if (user) {
        // Load from Firebase
        const habitsCollection = collection(firestore, 'habits');
        const snapshot = await getDocs(habitsCollection);
        setHabits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit)));
      } else {
        // Load from AsyncStorage for guest mode
        const savedHabits = await AsyncStorage.getItem(GUEST_HABITS_KEY);
        if (savedHabits) {
          setHabits(JSON.parse(savedHabits));
        }
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const addHabit = async (habitName: string) => {
    try {
      const newHabit: Habit = {
        id: Date.now().toString(), // Simple ID for guest mode
        name: habitName,
        createdAt: new Date(),
        completions: {},
        currentStreak: 0,
        longestStreak: 0
      };

      if (user) {
        // Save to Firebase
        const docRef = await addDoc(collection(firestore, 'habits'), newHabit);
        newHabit.id = docRef.id;
      } else {
        // Save to AsyncStorage for guest mode
        const updatedHabits = [...habits, newHabit];
        await AsyncStorage.setItem(GUEST_HABITS_KEY, JSON.stringify(updatedHabits));
        setHabits(updatedHabits);
      }

      setHabits(prev => [...prev, newHabit]);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      if (user) {
        // Delete from Firebase
        const habitDoc = doc(firestore, 'habits', habitId);
        await deleteDoc(habitDoc);
      } else {
        // Delete from AsyncStorage for guest mode
        const updatedHabits = habits.filter(h => h.id !== habitId);
        await AsyncStorage.setItem(GUEST_HABITS_KEY, JSON.stringify(updatedHabits));
      }
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const calculateStreak = (completions: { [date: string]: boolean }): { current: number; longest: number } => {
    const dates = Object.keys(completions).filter(date => completions[date]).sort();
    if (dates.length === 0) return { current: 0, longest: 0 };

    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;

    if (completions[today]) {
      currentStreak = 1;
      let checkDate = new Date(today);

      while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        const dateStr = checkDate.toISOString().split('T')[0];
        if (completions[dateStr]) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    dates.forEach((date, index) => {
      if (index === 0) {
        streak = 1;
      } else {
        const prev = new Date(dates[index - 1]);
        const curr = new Date(date);
        const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          streak++;
        } else {
          streak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, streak);
    });

    return { current: currentStreak, longest: longestStreak };
  };

  const toggleHabitCompletion = async (habit: Habit) => {
    try {
      const habitDoc = doc(firestore, 'habits', habit.id);
      const newCompletions = {
        ...habit.completions,
        [today]: !habit.completions[today]
      };
      
      const { current, longest } = calculateStreak(newCompletions);
      
      await updateDoc(habitDoc, {
        completions: newCompletions,
        currentStreak: current,
        longestStreak: Math.max(longest, habit.longestStreak || 0)
      });
      
      setHabits(prevHabits => prevHabits.map(habit =>
        habit.id === habit.id ? { ...habit, completions: newCompletions, currentStreak: current, longestStreak: Math.max(longest, habit.longestStreak || 0) } : habit
      ));
    } catch (error) {
      console.error('Error updating habit completion:', error);
    }
  };

  const getLastSevenDays = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const resetAllData = async () => {
    try {
      const habitsCollection = collection(firestore, 'habits');
      const snapshot = await getDocs(habitsCollection);
      
      // Delete all habits
      await Promise.all(
        snapshot.docs.map(doc => deleteDoc(doc.ref))
      );
      
      setHabits([]);
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  };

  if (isSettingsVisible) {
    return <Settings 
      onClose={() => setIsSettingsVisible(false)} 
      onResetData={resetAllData}
    />;
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff' }
    ]}>
      <Text style={[
        styles.title,
        { color: colorScheme === 'dark' ? '#fff' : '#000' }
      ]}>Habit Tracker</Text>

      <View style={styles.emptyState}>
        <Text style={[
          styles.emptyStateText,
          { color: colorScheme === 'dark' ? '#fff' : '#333' }
        ]}>No habits tracked yet</Text>
        <Text style={[
          styles.emptyStateSubtext,
          { color: colorScheme === 'dark' ? '#aaa' : '#666' }
        ]}>Tap + to add your first habit</Text>
      </View>

      <NavigationBar
        onHomePress={() => {}}
        onAddPress={() => setIsAddModalVisible(true)}
        onSettingsPress={() => setIsSettingsVisible(true)}
        colorScheme={colorScheme}
      />

      <AddHabitModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAdd={(habitName) => {
          addHabit(habitName);
          setIsAddModalVisible(false);
        }}
        colorScheme={colorScheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, // Space for navigation bar
  },
  habitItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 10,
  },
  habitInfo: {
    marginBottom: 10,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  streakText: {
    fontSize: 14,
    color: '#666',
  },
  habitActions: {
    flexDirection: 'column',
  },
  weekView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayButton: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  dayButtonCompleted: {
    backgroundColor: '#4CAF50',
  },
  dayButtonText: {
    fontSize: 12,
    color: '#333',
  },
  dayButtonTextCompleted: {
    color: '#fff',
  },
  checkmark: {
    marginTop: 2,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  completedButton: {
    backgroundColor: '#43A047',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100, // Account for navigation bar
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
  },
}); 