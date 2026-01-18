/**
 * HealthySuggestions Component
 * Main component that combines activity suggestions and food tracking
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { TimeSlotDropdown } from './TimeSlotDropdown';
import { HealthyFoodList } from './HealthyFoodList';
import { NonHealthyFoodList } from './NonHealthyFoodList';
import {
  ActivitySuggestion,
  FoodItem,
  TimeSlot,
  FoodCategory,
} from '@/types';
import {
  DEFAULT_ACTIVITY_SUGGESTIONS,
  DEFAULT_HEALTHY_FOODS,
  DEFAULT_NON_HEALTHY_FOODS,
} from '@/utils/suggestions-data';
import { ActivityStorage, FoodStorage } from '@/utils/storage';

interface HealthySuggestionsProps {
  onProgressUpdate?: () => void;
}

const timeSlots: TimeSlot[] = ['morning', 'afternoon', 'evening', 'night'];

export function HealthySuggestions({ onProgressUpdate }: HealthySuggestionsProps) {
  const [activities, setActivities] = useState<ActivitySuggestion[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const loadedActivities = await ActivityStorage.getActivities();
      const loadedFoods = await FoodStorage.getFoods();
      setActivities(loadedActivities);
      setFoods(loadedFoods);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const handleAddActivity = async (title: string, timeSlot: TimeSlot) => {
    try {
      const newActivity: ActivitySuggestion = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title,
        timeSlot,
        selected: true,
        completed: false,
        createdAt: Date.now(),
      };

      await ActivityStorage.addActivity(newActivity);
      await loadData();
      onProgressUpdate?.();
    } catch (error) {
      console.error('Error adding activity:', error);
      Alert.alert('Error', 'Failed to add activity');
    }
  };

  const handleToggleActivity = async (activityId: string) => {
    try {
      const activity = activities.find((a) => a.id === activityId);
      if (!activity) return;

      const updates: Partial<ActivitySuggestion> = {
        completed: !activity.completed,
        completedAt: !activity.completed ? Date.now() : undefined,
      };

      await ActivityStorage.updateActivity(activityId, updates);
      await loadData();
      onProgressUpdate?.();
    } catch (error) {
      console.error('Error toggling activity:', error);
      Alert.alert('Error', 'Failed to update activity');
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    Alert.alert(
      'Delete Activity',
      'Are you sure you want to delete this activity?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await ActivityStorage.deleteActivity(activityId);
              await loadData();
              onProgressUpdate?.();
            } catch (error) {
              console.error('Error deleting activity:', error);
              Alert.alert('Error', 'Failed to delete activity');
            }
          },
        },
      ]
    );
  };

  const handleAddFood = async (name: string, timeSlot: TimeSlot, category: FoodCategory) => {
    try {
      const newFood: FoodItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name,
        category,
        timeSlot,
        selected: true,
        completed: false,
        createdAt: Date.now(),
      };

      await FoodStorage.addFood(newFood);
      await loadData();
      onProgressUpdate?.();
    } catch (error) {
      console.error('Error adding food:', error);
      Alert.alert('Error', 'Failed to add food');
    }
  };

  const handleToggleFood = async (foodId: string) => {
    try {
      const food = foods.find((f) => f.id === foodId);
      if (!food) return;

      const updates: Partial<FoodItem> = {
        completed: !food.completed,
        completedAt: !food.completed ? Date.now() : undefined,
      };

      await FoodStorage.updateFood(foodId, updates);
      await loadData();
      onProgressUpdate?.();
    } catch (error) {
      console.error('Error toggling food:', error);
      Alert.alert('Error', 'Failed to update food');
    }
  };

  const handleDeleteFood = async (foodId: string) => {
    Alert.alert(
      'Delete Food',
      'Are you sure you want to delete this food item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await FoodStorage.deleteFood(foodId);
              await loadData();
              onProgressUpdate?.();
            } catch (error) {
              console.error('Error deleting food:', error);
              Alert.alert('Error', 'Failed to delete food');
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        Healthy Daily Suggestions
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Track activities and food choices for a healthier day
      </ThemedText>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {timeSlots.map((slot) => (
          <ThemedView key={slot} style={styles.timeSlotSection}>
            <TimeSlotDropdown
              timeSlot={slot}
              suggestions={activities}
              availableSuggestions={DEFAULT_ACTIVITY_SUGGESTIONS[slot]}
              onSelect={(suggestion) => handleAddActivity(suggestion, slot)}
              onToggle={handleToggleActivity}
              onDelete={handleDeleteActivity}
            />

            <HealthyFoodList
              timeSlot={slot}
              foods={foods}
              availableFoods={DEFAULT_HEALTHY_FOODS[slot]}
              onAdd={(foodName) => handleAddFood(foodName, slot, 'healthy')}
              onToggle={handleToggleFood}
              onDelete={handleDeleteFood}
            />

            <NonHealthyFoodList
              timeSlot={slot}
              foods={foods}
              availableFoods={DEFAULT_NON_HEALTHY_FOODS[slot]}
              onAdd={(foodName) => handleAddFood(foodName, slot, 'nonHealthy')}
              onToggle={handleToggleFood}
              onDelete={handleDeleteFood}
            />
          </ThemedView>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.7,
    fontSize: 14,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  timeSlotSection: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
});

