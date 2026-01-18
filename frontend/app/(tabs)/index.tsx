/**
 * DailyPlanner Main Screen
 * Integrated with Smart Dropdowns, Mood Tracker, Water Tracker, and Professional Charts
 */

import { DashboardCharts } from '@/components/daily-planner/DashboardCharts';
import { HealthScore } from '@/components/daily-planner/HealthScore';
import { MoodTracker } from '@/components/daily-planner/MoodTracker';
import { TimeSlotDropdown } from '@/components/daily-planner/TimeSlotDropdown';
import { WaterTracker } from '@/components/daily-planner/WaterTracker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  ActivitySuggestion,
  FoodCategory,
  FoodItem, MoodType,
  Task,
  TimeSlot,
  WaterIntake
} from '@/types';
import {
  getTimeBasedGreeting,
  requestNotificationPermissions,
} from '@/utils/notifications';
import {
  ActivityStorage,
  AuthStorage,
  FoodStorage, MoodStorage,
  TaskStorage,
  WaterStorage
} from '@/utils/storage';
import {
  DEFAULT_ACTIVITY_SUGGESTIONS,
  DEFAULT_HEALTHY_FOODS,
  DEFAULT_NON_HEALTHY_FOODS
} from '@/utils/suggestions-data';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DailyPlannerScreen() {
  const [tasks, setTasks] = useState<Task[]>([]); // Keeping for backward compatibility if needed, but primarily using ActivitySuggestion for "Smart Dropdown"
  const [activities, setActivities] = useState<ActivitySuggestion[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [mood, setMood] = useState<MoodType | null>(null);
  const [waterIntake, setWaterIntake] = useState<WaterIntake>({ date: '', current: 0, goal: 8, entries: [] });

  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Load setup on mount
  useEffect(() => {
    loadAllData();
    setGreeting(getTimeBasedGreeting());
    requestNotificationPermissions();
  }, []);

  const loadAllData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [
        loadedTasks,
        loadedActivities,
        loadedFoods,
        loadedMoodEntry,
        loadedWater
      ] = await Promise.all([
        TaskStorage.getTasks(),
        ActivityStorage.getActivities(),
        FoodStorage.getFoods(),
        MoodStorage.getMoodForDate(today),
        WaterStorage.getWaterForDate(today),
      ]);

      setTasks(loadedTasks);
      setActivities(loadedActivities);
      setFoods(loadedFoods);
      setMood(loadedMoodEntry?.mood || null);
      setWaterIntake(loadedWater);

    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  }, []);

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout?')) {
        await AuthStorage.clearAuthState();
        router.replace('/login');
      }
    } else {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AuthStorage.clearAuthState();
            router.replace('/login');
          },
        },
      ]);
    }
  };

  // --- Handlers for Legacy Tasks ---
  const handleAddTask = async (title: string, timeSlot: TimeSlot) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      timeSlot,
      completed: false,
      createdAt: Date.now()
    };
    await TaskStorage.addTask(newTask);
    loadAllData();
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await TaskStorage.updateTask(id, { completed: !task.completed });
      loadAllData();
    }
  };

  const handleDeleteTask = async (id: string) => {
    const performDelete = async () => {
      await TaskStorage.deleteTask(id);
      loadAllData();
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this task?')) {
        await performDelete();
      }
    } else {
      Alert.alert(
        'Delete Task',
        'Are you sure you want to delete this task?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: performDelete,
          },
        ]
      );
    }
  };

  // --- Handlers for Activities ---
  const handleSelectActivity = async (title: string, timeSlot: TimeSlot) => {
    const newActivity: ActivitySuggestion = {
      id: Date.now().toString(),
      title,
      timeSlot,
      selected: true,
      completed: false,
      createdAt: Date.now()
    };
    await ActivityStorage.addActivity(newActivity);
    loadAllData();
  };

  const handleToggleActivity = async (id: string) => {
    const activity = activities.find(a => a.id === id);
    if (activity) {
      const isCompleting = !activity.completed;
      await ActivityStorage.updateActivity(id, { completed: isCompleting });

      // Automatically add water if the task is "Drink Water"
      if (isCompleting && activity.title.toLowerCase().includes('drink water')) {
        const today = new Date().toISOString().split('T')[0];
        await WaterStorage.addWaterEntry(today, 1);
      }

      loadAllData();
    }
  };

  const handleDeleteActivity = async (id: string) => {
    const performDelete = async () => {
      await ActivityStorage.deleteActivity(id);
      loadAllData();
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this activity?')) {
        await performDelete();
      }
    } else {
      Alert.alert(
        'Delete Activity',
        'Are you sure you want to delete this activity?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: performDelete,
          },
        ]
      );
    }
  };

  // --- Handlers for Food ---
  const handleSelectFood = async (name: string, category: FoodCategory, timeSlot: TimeSlot) => {
    const newFood: FoodItem = {
      id: Date.now().toString(),
      name,
      category,
      timeSlot,
      selected: true,
      completed: false, // Eaten?
      createdAt: Date.now()
    };
    await FoodStorage.addFood(newFood);
    loadAllData();
  };

  const handleToggleFood = async (id: string) => {
    const food = foods.find(f => f.id === id);
    if (food) {
      await FoodStorage.updateFood(id, { completed: !food.completed });
      loadAllData();
    }
  };

  const handleDeleteFood = async (id: string) => {
    const performDelete = async () => {
      await FoodStorage.deleteFood(id);
      loadAllData();
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this food item?')) {
        await performDelete();
      }
    } else {
      Alert.alert(
        'Delete Food',
        'Are you sure you want to delete this food item?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: performDelete,
          },
        ]
      );
    }
  };

  // --- Render Helpers ---
  const renderTimeSlot = (slot: TimeSlot) => {
    return (
      <TimeSlotDropdown
        key={slot}
        timeSlot={slot}
        suggestions={activities}
        availableSuggestions={DEFAULT_ACTIVITY_SUGGESTIONS[slot]}
        onSelect={(item) => handleSelectActivity(item, slot)}
        onToggle={handleToggleActivity}
        onDelete={handleDeleteActivity}
        foods={foods}
        availableFoods={{
          healthy: DEFAULT_HEALTHY_FOODS[slot],
          nonHealthy: DEFAULT_NON_HEALTHY_FOODS[slot]
        }}
        onSelectFood={(item, category) => handleSelectFood(item, category, slot)}
        onToggleFood={handleToggleFood}
        onDeleteFood={handleDeleteFood}
      />
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.headerContent}>
          <ThemedText type="title" style={styles.greeting}>
            {greeting}!
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Plan your day effectively
          </ThemedText>
        </ThemedView>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.icon + '20' }]}
          onPress={handleLogout}>
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>

        {/* Health Score Header */}
        <HealthScore
          tasks={tasks}
          activities={activities}
          foods={foods}
          waterIntake={waterIntake}
          mood={mood}
        />

        {/* Mood Tracker */}
        <MoodTracker onMoodChange={() => loadAllData()} />

        {/* Time Slots */}
        <ThemedText type="subtitle" style={styles.sectionHeader}>Daily Schedule</ThemedText>
        {renderTimeSlot('morning')}
        {renderTimeSlot('afternoon')}
        {renderTimeSlot('evening')}
        {renderTimeSlot('night')}

        {/* Water Tracker */}
        <View style={styles.spacer} />
        <WaterTracker onWaterUpdate={() => loadAllData()} />

        {/* Analytics */}
        <DashboardCharts
          tasks={tasks}
          activities={activities}
          foods={foods}
          waterIntake={waterIntake}
        />

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: 'transparent',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
  },
  spacer: {
    height: 20,
  }
});
