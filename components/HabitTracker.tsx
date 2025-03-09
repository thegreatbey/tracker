import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationBar } from './NavigationBar';
import { AddHabitModal } from './AddHabitModal';
import { Settings } from './Settings';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const savedHabits = await AsyncStorage.getItem(GUEST_HABITS_KEY);
      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const addHabit = async (habitName: string) => {
    try {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: habitName,
        createdAt: new Date(),
        completions: {},
        currentStreak: 0,
        longestStreak: 0
      };

      const updatedHabits = [...habits, newHabit];
      await AsyncStorage.setItem(GUEST_HABITS_KEY, JSON.stringify(updatedHabits));
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      const updatedHabits = habits.filter(h => h.id !== habitId);
      await AsyncStorage.setItem(GUEST_HABITS_KEY, JSON.stringify(updatedHabits));
      setHabits(updatedHabits);
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
      const newCompletions = {
        ...habit.completions,
        [today]: !habit.completions[today]
      };
      
      const { current, longest } = calculateStreak(newCompletions);
      const updatedHabit = {
        ...habit,
        completions: newCompletions,
        currentStreak: current,
        longestStreak: Math.max(longest, habit.longestStreak || 0)
      };
      
      const updatedHabits = habits.map(h => 
        h.id === habit.id ? updatedHabit : h
      );
      await AsyncStorage.setItem(GUEST_HABITS_KEY, JSON.stringify(updatedHabits));
      
      setHabits(updatedHabits);
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

      {habits.length === 0 ? (
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
      ) : (
        <FlatList
          data={habits}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[
              styles.habitItem,
              { backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f8f8' }
            ]}>
              <View style={styles.habitInfo}>
                <Text style={[
                  styles.habitName,
                  { color: colorScheme === 'dark' ? '#fff' : '#000' }
                ]}>{item.name}</Text>
                <Text style={styles.streakText}>
                  Current Streak: {item.currentStreak} days
                </Text>
                <Text style={styles.streakText}>
                  Longest Streak: {item.longestStreak} days
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
                      onPress={() => toggleHabitCompletion(item)}
                    >
                      <Text style={[
                        styles.dayButtonText,
                        item.completions[date] && styles.dayButtonTextCompleted
                      ]}>
                        {new Date(date).toLocaleDateString(undefined, { weekday: 'short' })}
                      </Text>
                      {item.completions[date] && (
                        <Ionicons
                          name="checkmark"
                          size={12}
                          color="#fff"
                          style={styles.checkmark}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
                
                <View style={styles.bottomActions}>
                  <TouchableOpacity
                    style={item.completions[today] ? styles.completedButton : styles.completeButton}
                    onPress={() => toggleHabitCompletion(item)}
                  >
                    <Text style={styles.completeButtonText}>
                      {item.completions[today] ? 'Completed' : 'Complete for Today'}
                    </Text>
                    {item.completions[today] && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteHabit(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}

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