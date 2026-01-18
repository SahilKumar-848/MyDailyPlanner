/**
 * DashboardCharts Component
 * Professional charts for data visualization using react-native-chart-kit
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ActivitySuggestion, FoodItem, Task, WaterIntake } from '@/types';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  BarChart
} from 'react-native-chart-kit';

interface DashboardChartsProps {
  tasks?: Task[]; // Legacy
  activities: ActivitySuggestion[];
  foods: FoodItem[];
  waterIntake: WaterIntake;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 32;

export function DashboardCharts({ tasks = [], activities, foods, waterIntake }: DashboardChartsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  // Calculate data for charts
  const allItems = [...tasks, ...activities, ...foods];
  const totalItems = allItems.length;
  const tasksCompleted = allItems.filter((t) => t.completed).length;
  const tasksPending = totalItems - tasksCompleted;

  const waterPercentage = waterIntake.goal > 0
    ? Math.min((waterIntake.current / waterIntake.goal), 1)
    : 0;

  const chartConfig = {
    backgroundGradientFrom: isDark ? '#1E1E1E' : '#FFFFFF',
    backgroundGradientTo: isDark ? '#1E1E1E' : '#FFFFFF',
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // Solid Blue
    strokeWidth: 2,
    barPercentage: 0.9, // Thicker bars
    useShadowColorFromDataset: false,
    labelColor: (opacity = 1) => isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
    decimalPlaces: 0,
    propsForBackgroundLines: {
      strokeDasharray: '', // solid lines
      stroke: isDark ? '#333' : '#F0F0F0',
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: '600',
    },
    fillShadowGradient: '#2196F3', // Primary Blue
    fillShadowGradientOpacity: 1, // Solid color for bars
  };

  const barData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [tasksCompleted, tasksPending],
      },
    ],
  };

  // Standard BarChart uses one color. We'll stick to a nice tint color or gradient.

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        📊 Daily Analytics
      </ThemedText>

      {/* Daily Progress Chart - Bar Chart */}
      <ThemedView style={[styles.chartContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        <ThemedText style={styles.chartTitle}>Task Progress</ThemedText>
        {totalItems > 0 ? (
          <BarChart
            data={barData}
            width={CHART_WIDTH - 48}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => colors.tint,
            }}
            verticalLabelRotation={0}
            fromZero
            showValuesOnTopOfBars
            flatColor={true}
            style={styles.chartStyle}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <ThemedText style={styles.emptyStateText}>No tasks for today yet.</ThemedText>
            <ThemedText style={styles.emptyStateSubtext}>Add tasks to see your progress!</ThemedText>
          </View>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 60,
  },
  sectionTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
  },
  chartContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 5,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20, // More spacing
    textAlign: 'center',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
    paddingRight: 0,
  },
  centeredChart: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
    opacity: 0.7,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.5,
  },
});
