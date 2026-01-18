/**
 * HealthScore Component
 * Displays daily health score with breakdown
 * Enhanced UI with proper icons, shadows, and spacing
 */

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ActivitySuggestion, FoodItem, HealthScore as HealthScoreType, MoodType, Task, WaterIntake } from '@/types';
import { calculateHealthScore, getHealthScoreCategory } from '@/utils/health-score';
import { HealthScoreStorage } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, UIManager, View } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface HealthScoreProps {
  tasks: Task[];
  activities: ActivitySuggestion[];
  foods: FoodItem[];
  waterIntake: WaterIntake;
  mood: MoodType | null;
}

export function HealthScore({
  tasks,
  activities,
  foods,
  waterIntake,
  mood,
}: HealthScoreProps) {
  const [healthScore, setHealthScore] = useState<HealthScoreType | null>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    calculateAndSaveScore();
  }, [tasks, activities, foods, waterIntake, mood]);

  const calculateAndSaveScore = async () => {
    try {
      const score = calculateHealthScore({
        tasks,
        activities,
        foods,
        waterIntake,
        mood,
      });

      // Simple animation for updates
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      // Save to storage
      await HealthScoreStorage.saveHealthScore(score);
      setHealthScore(score);
    } catch (error) {
      console.error('Error calculating health score:', error);
    }
  };

  if (!healthScore) {
    return null;
  }

  const category = getHealthScoreCategory(healthScore.score);

  const taskCount = activities.filter(a => a.selected).length;
  const healthyFoodCount = foods.filter(f => f.category === 'healthy' && f.selected).length;

  return (
    <View style={[
      styles.cardContainer,
      {
        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        shadowColor: colors.shadow || '#000',
      }
    ]}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.headerLabel}>Today's Health Score</ThemedText>
          <View style={[styles.statusChip, { backgroundColor: category.color + '20' }]}>
            <ThemedText style={[styles.statusText, { color: category.color }]}>
              {category.emoji} {category.category}
            </ThemedText>
          </View>
        </View>
        <View style={styles.scoreCircle}>
          <ThemedText style={[styles.scoreValue, { color: category.color }]}>{healthScore.score}</ThemedText>
          <ThemedText style={styles.scoreUnit}>%</ThemedText>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.icon + '20' }]} />

      {/* Breakdown Section */}
      <View style={styles.breakdownContainer}>
        <ThemedText style={styles.sectionTitle}>Breakdown</ThemedText>

        {/* Tasks Row */}
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkbox-outline" size={20} color={colors.tint} />
          </View>
          <View style={styles.barContainer}>
            <View style={styles.barHeader}>
              <ThemedText style={styles.barLabel}>Tasks</ThemedText>
              <ThemedText style={styles.barValue}>{taskCount} Tasks</ThemedText>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${(healthScore.breakdown.tasks / 25) * 100}%`,
                    backgroundColor: colors.tint
                  }
                ]}
              />
            </View>
          </View>
        </View>

        {/* Food Row */}
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <Ionicons name="nutrition-outline" size={20} color="#4CAF50" />
          </View>
          <View style={styles.barContainer}>
            <View style={styles.barHeader}>
              <ThemedText style={styles.barLabel}>Healthy Food</ThemedText>
              <ThemedText style={styles.barValue}>{healthyFoodCount} Items</ThemedText>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${(healthScore.breakdown.healthyFood / 25) * 100}%`,
                    backgroundColor: '#4CAF50'
                  }
                ]}
              />
            </View>
          </View>
        </View>

        {/* Non-Healthy Food Row */}
        <View style={styles.row}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="fast-food-outline" size={20} color="#F44336" />
          </View>
          <View style={styles.barContainer}>
            <View style={styles.barHeader}>
              <ThemedText style={styles.barLabel}>Non-Healthy</ThemedText>
              <ThemedText style={styles.barValue}>{healthScore.breakdown.nonHealthyFood} Items</ThemedText>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.min(healthScore.breakdown.nonHealthyFood * 10, 100)}%`, // Arbitrary scale for visual
                    backgroundColor: '#F44336'
                  }
                ]}
              />
            </View>
          </View>
        </View>

        {/* Water Row */}
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <Ionicons name="water-outline" size={20} color="#2196F3" />
          </View>
          <View style={styles.barContainer}>
            <View style={styles.barHeader}>
              <ThemedText style={styles.barLabel}>Hydration</ThemedText>
              <ThemedText style={styles.barValue}>{waterIntake.current} Glasses</ThemedText>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${(healthScore.breakdown.waterIntake / 25) * 100}%`,
                    backgroundColor: '#2196F3'
                  }
                ]}
              />
            </View>
          </View>
        </View>

        {/* Mood Row */}
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <Ionicons name="happy-outline" size={20} color="#FF9800" />
          </View>
          <View style={styles.barContainer}>
            <View style={styles.barHeader}>
              <ThemedText style={styles.barLabel}>Mood</ThemedText>
              <ThemedText style={styles.barValue}>
                {mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : 'None'}
              </ThemedText>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${(healthScore.breakdown.mood / 25) * 100}%`,
                    backgroundColor: '#FF9800'
                  }
                ]}
              />
            </View>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5, // Android shadow
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scoreCircle: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 40,
  },
  scoreUnit: {
    fontSize: 14,
    opacity: 0.6,
    fontWeight: '600',
    marginTop: -4,
  },
  divider: {
    height: 1,
    marginVertical: 16,
    width: '100%',
  },
  breakdownContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    opacity: 0.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(128,128,128,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barContainer: {
    flex: 1,
    gap: 6,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  barValue: {
    fontSize: 12,
    opacity: 0.6,
    fontFamily: 'monospace', // optional for alignment
  },
  track: {
    height: 6,
    backgroundColor: 'rgba(128,128,128,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
