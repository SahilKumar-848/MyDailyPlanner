/**
 * AddTaskForm Component
 * Form for adding new tasks
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TimeSlot } from '@/types';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface AddTaskFormProps {
  onAddTask: (title: string, timeSlot: TimeSlot) => void;
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>('morning');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const timeSlots: { value: TimeSlot; label: string }[] = [
    { value: 'morning', label: 'Morning' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'evening', label: 'Evening' },
    { value: 'night', label: 'Night' },
  ];

  const handleSubmit = () => {
    if (title.trim()) {
      onAddTask(title.trim(), selectedSlot);
      setTitle('');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        Add New Task
      </ThemedText>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: colors.icon + '40',
          },
        ]}
        placeholder="Enter task title..."
        placeholderTextColor={colors.icon}
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={handleSubmit}
      />

      <View style={styles.slotContainer}>
        <ThemedText style={styles.slotLabel}>Time Slot:</ThemedText>
        <View style={styles.slotButtons}>
          {timeSlots.map((slot) => (
            <TouchableOpacity
              key={slot.value}
              style={[
                styles.slotButton,
                selectedSlot === slot.value && {
                  backgroundColor: colors.tint,
                },
                { borderColor: colors.tint },
              ]}
              onPress={() => setSelectedSlot(slot.value)}>
              <ThemedText
                style={[
                  styles.slotButtonText,
                  selectedSlot === slot.value && styles.slotButtonTextActive,
                ]}>
                {slot.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>


      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: colors.tint },
          !title.trim() && styles.addButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!title.trim()}>
        <ThemedText style={styles.addButtonText}>Add Task</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
  },
  slotContainer: {
    gap: 8,
  },
  slotLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  slotButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  slotButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  slotButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  slotButtonTextActive: {
    color: '#fff',
  },
  addButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

