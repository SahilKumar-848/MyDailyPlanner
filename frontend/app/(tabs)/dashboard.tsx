/**
 * Dashboard Screen
 * Main dashboard integrating all health and productivity features
 */

import { DashboardCharts } from '@/components/daily-planner/DashboardCharts';
import { HealthScore } from '@/components/daily-planner/HealthScore';
import { MoodTracker } from '@/components/daily-planner/MoodTracker';
import { WaterTracker } from '@/components/daily-planner/WaterTracker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  ActivitySuggestion,
  FoodItem,
  MoodType,
  Task,
  WaterIntake,
} from '@/types';
import { getTimeBasedGreeting } from '@/utils/notifications';
import {
  ActivityStorage,
  FoodStorage,
  MoodStorage,
  TaskStorage,
  WaterStorage,
} from '@/utils/storage';
import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function DashboardScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<ActivitySuggestion[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [waterIntake, setWaterIntake] = useState<WaterIntake>({
    date: new Date().toISOString().split('T')[0],
    current: 0,
    goal: 8,
    entries: [],
  });
  const [mood, setMood] = useState<MoodType | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [greeting] = useState(getTimeBasedGreeting());

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [loadedTasks, loadedActivities, loadedFoods, loadedWater, loadedMood] =
        await Promise.all([
          TaskStorage.getTasks(),
          ActivityStorage.getActivities(),
          FoodStorage.getFoods(),
          WaterStorage.getWaterForDate(today),
          MoodStorage.getMoodForDate(today),
        ]);

      setTasks(loadedTasks);
      setActivities(loadedActivities);
      setFoods(loadedFoods);
      setWaterIntake(loadedWater);
      setMood(loadedMood?.mood || null);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  }, []);

  const handleMoodChange = (newMood: MoodType) => {
    setMood(newMood);
    loadAllData();
  };

  const handleWaterUpdate = () => {
    loadAllData();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.greeting}>
          {greeting}!
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Your Daily Health Dashboard
        </ThemedText>
      </ThemedView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Health Score */}
        <HealthScore
          tasks={tasks}
          activities={activities}
          foods={foods}
          waterIntake={waterIntake}
          mood={mood}
        />

        {/* Mood Tracker */}
        <MoodTracker onMoodChange={handleMoodChange} />

        {/* Water Tracker */}
        <WaterTracker onWaterUpdate={handleWaterUpdate} />

        {/* Dashboard Charts */}
        <DashboardCharts
          tasks={tasks}
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
    padding: 16,
    paddingTop: 60,
    alignItems: 'center',
  },
  greeting: {
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
});




