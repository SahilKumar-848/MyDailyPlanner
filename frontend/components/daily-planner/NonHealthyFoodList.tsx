/**
 * NonHealthyFoodList Component
 * Displays and manages non-healthy food items for awareness
 */

import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { FoodItem, TimeSlot } from '@/types';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface NonHealthyFoodListProps {
  timeSlot: TimeSlot;
  foods: FoodItem[];
  availableFoods: string[];
  onAdd: (foodName: string) => void;
  onToggle: (foodId: string) => void;
  onDelete: (foodId: string) => void;
}

const timeSlotLabels: Record<TimeSlot, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
};

export function NonHealthyFoodList({
  timeSlot,
  foods,
  availableFoods,
  onAdd,
  onToggle,
  onDelete,
}: NonHealthyFoodListProps) {
  const [customInput, setCustomInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const slotFoods = foods.filter(
    (f) => f.timeSlot === timeSlot && f.category === 'nonHealthy'
  );

  const handleAdd = () => {
    if (customInput.trim()) {
      onAdd(customInput.trim());
      setCustomInput('');
      setShowInput(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedView style={styles.headerContent}>
          <ThemedView style={[styles.iconBadge, { backgroundColor: '#FF5722' + '30' }]}>
            <ThemedText style={[styles.iconText, { color: '#FF5722' }]}>⚠️</ThemedText>
          </ThemedView>
          <ThemedText type="subtitle" style={styles.title}>
            Non-Healthy Foods - {timeSlotLabels[timeSlot]}
          </ThemedText>
        </ThemedView>
        <TouchableOpacity
          style={[styles.addIconButton, { backgroundColor: colors.tint }]}
          onPress={() => setShowInput(!showInput)}>
          <ThemedText style={styles.addIconText}>+</ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedText style={styles.awarenessText}>
        Track for awareness and moderation
      </ThemedText>

      {showInput && (
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.icon + '40',
              },
            ]}
            placeholder="Add non-healthy food..."
            placeholderTextColor={colors.icon}
            value={customInput}
            onChangeText={setCustomInput}
            onSubmitEditing={handleAdd}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: '#FF5722' }]}
            onPress={handleAdd}>
            <ThemedText style={styles.addButtonText}>Add</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.foodList}>
        {slotFoods.map((food) => (
          <TouchableOpacity
            key={food.id}
            style={[
              styles.foodItem,
              food.completed && styles.completedItem,
              { borderColor: '#FF5722' + '40' },
            ]}
            onPress={() => onToggle(food.id)}
            onLongPress={() => onDelete(food.id)}>
            <ThemedView
              style={[
                styles.checkbox,
                food.completed && { backgroundColor: '#FF5722' },
                { borderColor: '#FF5722' },
              ]}>
              {food.completed && (
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              )}
            </ThemedView>
            <ThemedText
              style={[
                styles.foodText,
                food.completed && styles.completedText,
              ]}>
              {food.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
        {slotFoods.length === 0 && (
          <ThemedText style={styles.emptyText}>
            No non-healthy foods tracked yet. Tap + to add.
          </ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF5722' + '30',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  title: {
    fontSize: 16,
  },
  awarenessText: {
    fontSize: 11,
    opacity: 0.7,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  addIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  foodList: {
    gap: 8,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    gap: 10,
  },
  completedItem: {
    opacity: 0.6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  foodText: {
    flex: 1,
    fontSize: 14,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  emptyText: {
    textAlign: 'center',
    padding: 12,
    opacity: 0.6,
    fontSize: 12,
  },
});




