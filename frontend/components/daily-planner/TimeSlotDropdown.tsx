/**
 * TimeSlotDropdown Component
 * Dropdown for selecting activity suggestions AND food for each time slot
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ActivitySuggestion, FoodCategory, FoodItem, TimeSlot } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

interface TimeSlotDropdownProps {
  timeSlot: TimeSlot;
  // Activity Props
  suggestions: ActivitySuggestion[];
  availableSuggestions: string[];
  onSelect: (suggestion: string) => void;
  onToggle: (activityId: string) => void;
  onDelete: (activityId: string) => void;
  // Food Props
  foods: FoodItem[];
  availableFoods: { healthy: string[]; nonHealthy: string[] };
  onSelectFood: (food: string, category: FoodCategory) => void;
  onToggleFood: (foodId: string) => void;
  onDeleteFood: (foodId: string) => void;
}

const timeSlotLabels: Record<TimeSlot, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
};

type Tab = 'activities' | 'food';

export function TimeSlotDropdown({
  timeSlot,
  suggestions,
  availableSuggestions,
  onSelect,
  onToggle,
  onDelete,
  foods,
  availableFoods,
  onSelectFood,
  onToggleFood,
  onDeleteFood,
}: TimeSlotDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('activities');
  const [customInput, setCustomInput] = useState('');
  const [foodCategory, setFoodCategory] = useState<FoodCategory>('healthy'); // Default to healthy
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const slotSuggestions = suggestions.filter((s) => s.timeSlot === timeSlot);
  const slotFoods = foods.filter((f) => f.timeSlot === timeSlot);

  const handleSelectActivity = (suggestion: string) => {
    onSelect(suggestion);
    // Don't close immediately to allow multiple selections if desired, or close? 
    // UX: Close to confirm.
    setIsOpen(false);
    setCustomInput('');
  };

  const handleSelectFoodItem = (food: string) => {
    onSelectFood(food, foodCategory);
    setIsOpen(false);
    setCustomInput('');
  };

  const handleAddCustom = () => {
    if (customInput.trim()) {
      if (activeTab === 'activities') {
        onSelect(customInput.trim());
      } else {
        onSelectFood(customInput.trim(), foodCategory);
      }
      setCustomInput('');
    }
  };

  const renderBadge = (count: number) => {
    if (count === 0) return null;
    return (
      <View style={[styles.badge, { backgroundColor: colors.tint }]}>
        <ThemedText style={[styles.badgeText, { color: colors.background }]}>{count}</ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={[styles.dropdownButton, { borderColor: colors.tint }]}
        onPress={() => setIsOpen(!isOpen)}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.dropdownButtonText}>
            {timeSlotLabels[timeSlot]}
          </ThemedText>
          {renderBadge(slotSuggestions.length + slotFoods.length)}
        </View>
        <ThemedText style={styles.arrow}>{isOpen ? '▲' : '▼'}</ThemedText>
      </TouchableOpacity>

      {/* Summary View (Collapsed) */}
      <View style={styles.summaryList}>
        {/* Activities Summary */}
        {slotSuggestions.map((suggestion) => (
          <View
            key={suggestion.id}
            style={[
              styles.suggestionRowContainer,
              { borderColor: colors.icon + '40' }
            ]}>
            <TouchableOpacity
              style={[
                styles.suggestionItem,
                suggestion.completed && styles.completedItem,
              ]}
              onPress={() => onToggle(suggestion.id)}
            >
              <ThemedView
                style={[
                  styles.checkbox,
                  suggestion.completed && { backgroundColor: colors.tint },
                  { borderColor: colors.tint },
                ]}>
                {suggestion.completed && (
                  <ThemedText style={[styles.checkmark, { color: colors.background }]}>✓</ThemedText>
                )}
              </ThemedView>
              <ThemedText
                style={[
                  styles.suggestionText,
                  suggestion.completed && styles.completedText,
                ]}>
                {suggestion.title}
              </ThemedText>
              <View style={styles.statusContainer}>
                <ThemedText style={[
                  styles.statusLabel,
                  { color: suggestion.completed ? '#4CAF50' : '#FF9800' }
                ]}>
                  {suggestion.completed ? 'Completed' : 'Pending'}
                </ThemedText>
                <ThemedText style={styles.typeLabel}>Activity</ThemedText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(suggestion.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Foods Summary */}
        {slotFoods.map((food) => (
          <View
            key={food.id}
            style={[
              styles.suggestionRowContainer,
              { borderColor: food.category === 'healthy' ? '#4CAF50' : '#F44336' }
            ]}>
            <TouchableOpacity
              style={[
                styles.suggestionItem,
                food.completed && styles.completedItem,
              ]}
              onPress={() => onToggleFood(food.id)}
            >
              <ThemedView
                style={[
                  styles.checkbox,
                  food.completed && { backgroundColor: food.category === 'healthy' ? '#4CAF50' : '#F44336' },
                  { borderColor: food.category === 'healthy' ? '#4CAF50' : '#F44336' },
                ]}>
                {food.completed && (
                  <ThemedText style={styles.checkmark}>✓</ThemedText>
                )}
              </ThemedView>
              <ThemedText
                style={[
                  styles.suggestionText,
                  food.completed && styles.completedText,
                ]}>
                {food.name}
              </ThemedText>
              <View style={styles.statusContainer}>
                <ThemedText style={[
                  styles.statusLabel,
                  { color: food.completed ? '#4CAF50' : '#FF9800' }
                ]}>
                  {food.completed ? 'Completed' : 'Pending'}
                </ThemedText>
                <ThemedText style={[styles.typeLabel, { color: food.category === 'healthy' ? '#4CAF50' : '#F44336' }]}>
                  {food.category === 'healthy' ? 'Healthy' : 'Unhealthy'}
                </ThemedText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDeleteFood(food.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}>
          <TouchableWithoutFeedback>
            <ThemedView
              style={[styles.modalContent, { backgroundColor: colors.background }]}>

              <ThemedText type="subtitle" style={styles.modalTitle}>
                Add to {timeSlotLabels[timeSlot]}
              </ThemedText>

              {/* Tabs */}
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'activities' && { borderBottomColor: colors.tint, borderBottomWidth: 2 }]}
                  onPress={() => setActiveTab('activities')}
                >
                  <ThemedText style={[styles.tabText, activeTab === 'activities' && { color: colors.tint }]}>Activities</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'food' && { borderBottomColor: colors.tint, borderBottomWidth: 2 }]}
                  onPress={() => setActiveTab('food')}
                >
                  <ThemedText style={[styles.tabText, activeTab === 'food' && { color: colors.tint }]}>Food</ThemedText>
                </TouchableOpacity>
              </View>

              {activeTab === 'activities' ? (
                // Activity List
                <FlatList
                  data={availableSuggestions}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.modalItem,
                        { borderColor: colors.icon + '40' },
                      ]}
                      onPress={() => handleSelectActivity(item)}>
                      <ThemedText>{item}</ThemedText>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <ThemedText style={styles.emptyText}>No suggestions available</ThemedText>
                  }
                />
              ) : (
                // Food List with Category Toggle
                <View style={{ flex: 1 }}>
                  <View style={[styles.foodCategorySelector, { backgroundColor: colors.icon + '20' }]}>
                    <TouchableOpacity
                      style={[
                        styles.categoryBtn,
                        foodCategory === 'healthy' && { backgroundColor: '#4CAF50' }
                      ]}
                      onPress={() => setFoodCategory('healthy')}
                    >
                      <ThemedText style={[styles.categoryBtnText, foodCategory === 'healthy' && { color: '#fff' }]}>Healthy</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.categoryBtn,
                        foodCategory === 'nonHealthy' && { backgroundColor: '#F44336' }
                      ]}
                      onPress={() => setFoodCategory('nonHealthy')}
                    >
                      <ThemedText style={[styles.categoryBtnText, foodCategory === 'nonHealthy' && { color: '#fff' }]}>Non-Healthy</ThemedText>
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={foodCategory === 'healthy' ? availableFoods.healthy : availableFoods.nonHealthy}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.modalItem,
                          { borderColor: colors.icon + '40' },
                        ]}
                        onPress={() => handleSelectFoodItem(item)}>
                        <ThemedText>{item}</ThemedText>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                      <ThemedText style={styles.emptyText}>No food items available</ThemedText>
                    }
                  />
                </View>
              )}

              <View style={styles.customInputContainer}>
                <TextInput
                  style={[
                    styles.customInput,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.icon + '40',
                    },
                  ]}
                  placeholder={activeTab === 'activities' ? "Add custom activity..." : "Add custom food..."}
                  placeholderTextColor={colors.icon}
                  value={customInput}
                  onChangeText={setCustomInput}
                  onSubmitEditing={handleAddCustom}
                />
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: colors.tint }]}
                  onPress={handleAddCustom}>
                  <ThemedText style={[styles.addButtonText, { color: colors.background }]}>Add</ThemedText>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.icon + '20' }]}
                onPress={() => setIsOpen(false)}>
                <ThemedText>Close</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 12,
    opacity: 0.6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryList: {
    gap: 8,
  },
  suggestionRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
  },
  suggestionItem: {
    flex: 1, // Take up remaining space
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  deleteButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(128,128,128,0.2)',
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
  suggestionText: {
    flex: 1,
    fontSize: 14,
  },
  typeLabel: {
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.7,
    textTransform: 'uppercase',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
    color: '#888',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '80%', // Fixed height for modal content
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  foodCategorySelector: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  categoryBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  categoryBtnText: {
    fontWeight: '600',
    fontSize: 12,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    opacity: 0.6,
  },
  customInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  closeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
});
