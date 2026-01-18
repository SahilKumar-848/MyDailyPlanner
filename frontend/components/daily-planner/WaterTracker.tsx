/**
 * WaterTracker Component
 * Tracks daily water intake with progress visualization
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { WaterIntake } from '@/types';
import { WaterStorage } from '@/utils/storage';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface WaterTrackerProps {
  onWaterUpdate?: () => void;
}

export function WaterTracker({ onWaterUpdate }: WaterTrackerProps) {
  const [waterData, setWaterData] = useState<WaterIntake>({
    date: new Date().toISOString().split('T')[0],
    current: 0,
    goal: 8,
    entries: [],
  });
  const [customGoal, setCustomGoal] = useState('8');
  const [showGoalInput, setShowGoalInput] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadWaterData();
  }, []);

  const loadWaterData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await WaterStorage.getWaterForDate(today);
      setWaterData(data);
      setCustomGoal(data.goal.toString());
    } catch (error) {
      console.error('Error loading water data:', error);
    }
  };

  const handleAddWater = async (amount: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await WaterStorage.addWaterEntry(today, amount);
      await loadWaterData();
      onWaterUpdate?.();
    } catch (error) {
      console.error('Error adding water:', error);
      Alert.alert('Error', 'Failed to add water intake');
    }
  };

  const handleClearWater = async () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to clear your water intake for today?')) {
        await resetWaterData();
      }
    } else {
      Alert.alert(
        'Reset Water Intake',
        'Are you sure you want to clear your water intake for today?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reset',
            style: 'destructive',
            onPress: async () => {
              await resetWaterData();
            }
          }
        ]
      );
    }
  };

  const resetWaterData = async () => {
    try {
      const resetData: WaterIntake = {
        ...waterData,
        current: 0,
        entries: []
      };
      await WaterStorage.saveWater(resetData);
      await loadWaterData();
      onWaterUpdate?.();
    } catch (error) {
      console.error('Error clearing water:', error);
      Alert.alert('Error', 'Failed to reset water intake');
    }
  };

  const handleUpdateGoal = async () => {
    try {
      const goal = parseInt(customGoal, 10);
      if (isNaN(goal) || goal < 1) {
        Alert.alert('Invalid Goal', 'Please enter a valid number (minimum 1)');
        return;
      }
      const today = new Date().toISOString().split('T')[0];
      await WaterStorage.updateWaterGoal(today, goal);
      await loadWaterData();
      setShowGoalInput(false);
      onWaterUpdate?.();
    } catch (error) {
      console.error('Error updating goal:', error);
      Alert.alert('Error', 'Failed to update goal');
    }
  };

  const percentage = waterData.goal > 0 ? (waterData.current / waterData.goal) * 100 : 0;
  const isGoalReached = waterData.current >= waterData.goal;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>
          💧 Water Intake
        </ThemedText>
        <TouchableOpacity
          style={[styles.goalButton, { backgroundColor: colors.tint + '20' }]}
          onPress={() => setShowGoalInput(!showGoalInput)}>
          <ThemedText style={styles.goalButtonText}>Goal: {waterData.goal} glasses</ThemedText>
        </TouchableOpacity>
      </View>

      {showGoalInput && (
        <View style={styles.goalInputContainer}>
          <TextInput
            style={[
              styles.goalInput,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.icon + '40',
              },
            ]}
            placeholder="Set daily goal"
            placeholderTextColor={colors.icon}
            value={customGoal}
            onChangeText={setCustomGoal}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[styles.updateButton, { backgroundColor: colors.tint }]}
            onPress={handleUpdateGoal}>
            <ThemedText style={styles.updateButtonText}>Update</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <ThemedText style={[styles.percentageTextLarge, isGoalReached && styles.goalReached]}>
            {Math.min(Math.round(percentage), 100)}%
          </ThemedText>
        </View>

        <View style={[styles.progressBarContainer, { backgroundColor: colors.icon + '20' }]}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: isGoalReached ? '#4CAF50' : colors.tint,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.quickAddContainer}>
        <View style={styles.controlsRow}>
          <ThemedText style={styles.quickAddLabel}>Quick Add:</ThemedText>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearWater}
          >
            <ThemedText style={styles.clearButtonText}>Clear</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.quickAddButtons}>
          <TouchableOpacity
            style={[styles.quickAddButton, { backgroundColor: colors.tint }]}
            onPress={() => handleAddWater(1)}>
            <ThemedText style={styles.quickAddButtonText}>+1 Glass</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAddButton, { backgroundColor: colors.tint }]}
            onPress={() => handleAddWater(2)}>
            <ThemedText style={styles.quickAddButtonText}>+2 Glasses</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {isGoalReached && (
        <ThemedView style={[styles.successMessage, { backgroundColor: '#4CAF50' + '20' }]}>
          <ThemedText style={[styles.successText, { color: '#4CAF50' }]}>
            🎉 Great job! You've reached your daily water goal!
          </ThemedText>
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
    flex: 1,
  },
  goalButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  goalButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  goalInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  goalInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  updateButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  updateButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  percentageTextLarge: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  goalReached: {
    color: '#4CAF50',
    opacity: 1,
  },
  progressBarContainer: {
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  quickAddContainer: {
    gap: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  quickAddLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F44336', // Red color for destructive action
  },
  quickAddButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAddButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickAddButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  successMessage: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    fontSize: 14,
    fontWeight: '600',
  },
});




