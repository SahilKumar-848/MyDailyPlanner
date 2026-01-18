/**
 * TaskList Component
 * Displays tasks grouped by time slot
 */

import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { TaskItem } from './TaskItem';
import { Task, TimeSlot } from '@/types';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const timeSlotLabels: Record<TimeSlot, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
};

export function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  const getTasksBySlot = (slot: TimeSlot): Task[] => {
    return tasks.filter((task) => task.timeSlot === slot);
  };

  const renderTimeSlot = (slot: TimeSlot) => {
    const slotTasks = getTasksBySlot(slot);
    
    if (slotTasks.length === 0) {
      return null;
    }

    return (
      <ThemedView key={slot} style={styles.slotContainer}>
        <ThemedText type="subtitle" style={styles.slotTitle}>
          {timeSlotLabels[slot]}
        </ThemedText>
        {slotTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
          />
        ))}
      </ThemedView>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderTimeSlot('morning')}
      {renderTimeSlot('afternoon')}
      {renderTimeSlot('evening')}
      {renderTimeSlot('night')}
      {tasks.length === 0 && (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            No tasks yet. Add your first task below!
          </ThemedText>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slotContainer: {
    marginBottom: 24,
  },
  slotTitle: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
});

