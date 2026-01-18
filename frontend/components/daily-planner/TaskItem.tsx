/**
 * TaskItem Component
 * Displays a single task with check/uncheck functionality
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Task } from '@/types';
import { isTaskMissed } from '@/utils/notifications';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const missed = isTaskMissed(task);

  return (
    <ThemedView
      style={[
        styles.container,
        missed && !task.completed && { backgroundColor: '#ff444420', borderLeftColor: '#ff4444' },
        task.completed && { opacity: 0.6 },
      ]}>
      <TouchableOpacity
        style={styles.content}
        onPress={() => onToggle(task.id)}
        onLongPress={() => onDelete(task.id)}>
        <ThemedView
          style={[
            styles.checkbox,
            task.completed && { backgroundColor: colors.tint },
            { borderColor: colors.tint },
          ]}>
          {task.completed && (
            <ThemedText style={styles.checkmark}>✓</ThemedText>
          )}
        </ThemedView>
        <ThemedText
          style={[
            styles.taskText,
            task.completed && styles.completedText,
            missed && !task.completed && styles.missedText,
          ]}>
          {task.title}
        </ThemedText>
      </TouchableOpacity>
      {missed && !task.completed && (
        <ThemedText style={styles.missedLabel}>Missed</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
    color: '#888',
  },
  missedText: {
    color: '#ff4444',
    fontWeight: '600',
  },
  missedLabel: {
    fontSize: 10,
    color: '#ff4444',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginLeft: 8,
  },
});




