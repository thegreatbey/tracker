import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { NavigationBar } from './NavigationBar';
import { AddHabitModal } from './AddHabitModal';
import { Settings } from './Settings';

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
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const habitsCollection = collection(firestore, 'habits');
      const habitSnapshot = await getDocs(habitsCollection);
      const habitList = habitSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        completions: doc.data().completions || {},
        currentStreak: doc.data().currentStreak || 0,
        longestStreak: doc.data().longestStreak || 0,
      })) as Habit[];
      setHabits(habitList);
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const addHabit = async (habitName: string) => {
    try {
      const habitsCollection = collection(firestore, 'habits');
      await addDoc(habitsCollection, {
        name: habitName.trim(),
        createdAt: new Date(),
        completions: {},
        currentStreak: 0,
        longestStreak: 0,
      });
      loadHabits();
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      const habitDoc = doc(firestore, 'habits', habitId);
      await deleteDoc(habitDoc);
      loadHabits();
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
      
      loadHabits();
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
      
      loadHabits(); // Refresh the list
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
    <View style={styles.container}>
      <Text style={styles.title}>Habit Tracker</Text>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.habitItem}>
            <View style={styles.habitInfo}>
              <Text style={styles.habitName}>{item.name}</Text>
              <Text style={styles.streakText}>
                Current Streak: {item.currentStreak} | Best: {item.longestStreak}
              </Text>
            </View>
            
            <View style={styles.habitActions}>
              <View style={styles.weekView}>
                {getLastSevenDays().map((date) => (
                  <TouchableOpacity
                    key={date}
                    style={[
                      styles.dayButton,
                      item.completions[date] && styles.dayButtonCompleted
                    ]}
                    onPress={() => date === today ? toggleHabitCompletion(item) : null}
                  >
                    <Text style={styles.dayButtonText}>
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteHabit(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <NavigationBar
        onHomePress={() => {}}
        onAddPress={() => setIsAddModalVisible(true)}
        onSettingsPress={() => setIsSettingsVisible(true)}
      />

      <AddHabitModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAdd={addHabit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
}); 