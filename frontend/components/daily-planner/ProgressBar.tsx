/**
 * ProgressBar Component
 * Shows task completion progress
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { TaskProgress } from '@/types';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ProgressBarProps {
  progress: TaskProgress;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Progress</ThemedText>
        <ThemedText style={styles.percentage}>
          {progress.completed} / {progress.total}
        </ThemedText>
      </View>
      <View
        style={[
          styles.barContainer,
          { backgroundColor: colors.icon + '20' },
        ]}>
        <View
          style={[
            styles.barFill,
            {
              width: `${progress.percentage}%`,
              backgroundColor: colors.tint,
            },
          ]}
        />
      </View>
      <ThemedText style={styles.percentageText}>
        {Math.round(progress.percentage)}% Complete
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 16,
    fontWeight: '600',
  },
  barContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
});




