/**
 * MoodTracker Component
 * Allows users to select and track their daily mood
 * Provides mood-based suggestions for tasks and food
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MoodEntry, MoodType } from '@/types';
import { MoodStorage } from '@/utils/storage';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

interface MoodTrackerProps {
  onMoodChange?: (mood: MoodType) => void;
}

const MOOD_OPTIONS: { type: MoodType; emoji: string; label: string; color: string }[] = [
  { type: 'happy', emoji: '😊', label: 'Happy', color: '#4CAF50' },
  { type: 'normal', emoji: '😐', label: 'Normal', color: '#2196F3' },
  { type: 'tired', emoji: '😴', label: 'Tired', color: '#FF9800' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: '#F44336' },
];

const MOOD_SUGGESTIONS: Record<MoodType, { tasks: string[]; foods: string[] }> = {
  happy: {
    tasks: ['Exercise', 'Social Activity', 'Creative Work', 'Outdoor Activity'],
    foods: ['Fruits', 'Smoothies', 'Nuts', 'Whole Grains'],
  },
  normal: {
    tasks: ['Regular Work', 'Exercise', 'Reading', 'Planning'],
    foods: ['Balanced Meals', 'Vegetables', 'Protein', 'Water'],
  },
  tired: {
    tasks: ['Light Exercise', 'Rest', 'Meditation', 'Short Walk'],
    foods: ['Energy Foods', 'Green Tea', 'Nuts', 'Fruits'],
  },
  sad: {
    tasks: ['Gentle Exercise', 'Talk to Someone', 'Hobby', 'Nature Walk'],
    foods: ['Comfort Foods', 'Dark Chocolate', 'Warm Drinks', 'Healthy Snacks'],
  },
};

export function MoodTracker({ onMoodChange }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadTodayMood();
  }, []);

  const loadTodayMood = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const mood = await MoodStorage.getMoodForDate(today);
      if (mood) {
        setTodayMood(mood);
        setSelectedMood(mood.mood);
        onMoodChange?.(mood.mood);
      }
    } catch (error) {
      console.error('Error loading mood:', error);
    }
  };

  const handleMoodSelect = async (mood: MoodType) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const moodEntry: MoodEntry = {
        id: todayMood?.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        mood,
        date: today,
        timestamp: Date.now(),
      };

      await MoodStorage.saveMood(moodEntry);
      setTodayMood(moodEntry);
      setSelectedMood(mood);
      onMoodChange?.(mood);
    } catch (error) {
      console.error('Error saving mood:', error);
      Alert.alert('Error', 'Failed to save mood');
    }
  };

  const handleClearMood = async () => {
    try {
      if (Platform.OS === 'web') {
        if (window.confirm('Clear mood selection?')) {
          const today = new Date().toISOString().split('T')[0];
          await MoodStorage.deleteMoodForDate(today);
          setTodayMood(null);
          setSelectedMood(null);
          onMoodChange?.(null as any); // Type assertion needed or update interface
        }
      } else {
        Alert.alert(
          'Clear Mood',
          'Are you sure you want to clear your mood selection?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Clear',
              style: 'destructive',
              onPress: async () => {
                const today = new Date().toISOString().split('T')[0];
                await MoodStorage.deleteMoodForDate(today);
                setTodayMood(null);
                setSelectedMood(null);
                onMoodChange?.(null as any);
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error clearing mood:', error);
    }
  };

  const suggestions = selectedMood ? MOOD_SUGGESTIONS[selectedMood] : null;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>
          How are you feeling today?
        </ThemedText>
        {selectedMood && (
          <TouchableOpacity onPress={handleClearMood} style={styles.clearButton}>
            <ThemedText style={styles.clearButtonText}>Clear</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.moodGrid}>
        {MOOD_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.type}
            style={[
              styles.moodButton,
              selectedMood === option.type && {
                backgroundColor: option.color + '30',
                borderColor: option.color,
                borderWidth: 2,
              },
              { borderColor: colors.icon + '40' },
            ]}
            onPress={() => handleMoodSelect(option.type)}>
            <ThemedText style={styles.moodEmoji}>{option.emoji}</ThemedText>
            <ThemedText style={styles.moodLabel}>{option.label}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {suggestions && selectedMood && (
        <ThemedView style={styles.suggestionsContainer}>
          <ThemedText style={styles.suggestionsTitle}>
            Suggestions for {MOOD_OPTIONS.find((o) => o.type === selectedMood)?.label} mood:
          </ThemedText>

          <View style={styles.suggestionsList}>
            <View style={styles.suggestionSection}>
              <ThemedText style={styles.suggestionLabel}>Tasks:</ThemedText>
              {suggestions.tasks.map((task, index) => (
                <ThemedText key={index} style={styles.suggestionItem}>
                  • {task}
                </ThemedText>
              ))}
            </View>

            <View style={styles.suggestionSection}>
              <ThemedText style={styles.suggestionLabel}>Foods:</ThemedText>
              {suggestions.foods.map((food, index) => (
                <ThemedText key={index} style={styles.suggestionItem}>
                  • {food}
                </ThemedText>
              ))}
            </View>
          </View>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    flex: 1,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#F44336', // Red color
    fontWeight: '600',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  moodButton: {
    width: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 100,
    justifyContent: 'center',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionsContainer: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  suggestionsList: {
    gap: 12,
  },
  suggestionSection: {
    gap: 4,
  },
  suggestionLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
    marginBottom: 4,
  },
  suggestionItem: {
    fontSize: 12,
    opacity: 0.7,
    marginLeft: 8,
  },
});




