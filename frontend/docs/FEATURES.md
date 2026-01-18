# DailyPlanner - Feature Documentation

## Overview

DailyPlanner is a comprehensive Smart Daily Task Management Application built with React Native Expo and TypeScript. It combines task management with health tracking, mood monitoring, and data visualization.

## Core Features

### 1. Authentication System
- **Login Screen**: Email and password authentication
- **Validation**: Email format validation and password requirements
- **Remember Me**: Persistent login using AsyncStorage
- **Session Management**: Automatic authentication state checking

### 2. Task Management
- **Time-Based Organization**: Tasks categorized by Morning, Afternoon, Evening, Night
- **CRUD Operations**: Add, edit, delete, and complete tasks
- **Progress Tracking**: Real-time progress indicator
- **Missed Task Detection**: Automatic highlighting of missed tasks
- **Notifications**: Time-based reminders for tasks

### 3. Healthy Daily Suggestions

#### Time-Slot Smart Dropdown System
- **Activity Suggestions**: Pre-defined activities for each time slot
- **Custom Activities**: Add your own activities
- **Dropdown Interface**: Easy selection with modal interface
- **Completion Tracking**: Mark activities as done

#### Healthy vs Non-Healthy Food Planner
- **Healthy Foods Section**: Track healthy food choices (green theme)
- **Non-Healthy Foods Section**: Track for awareness (warning theme)
- **Food Selection**: Add foods for each time slot
- **Completion Tracking**: Mark foods as eaten
- **Balance Visualization**: View healthy vs non-healthy ratio

### 4. Mood Tracker Integration
- **Mood Selection**: Choose from Happy, Normal, Tired, or Sad
- **Mood-Based Suggestions**: 
  - Task suggestions based on mood
  - Food recommendations based on mood
- **Daily Mood Logging**: Track mood throughout the day
- **Visual Feedback**: Color-coded mood indicators

### 5. Water Intake Tracker
- **Daily Goal Setting**: Set custom daily water goal (default: 8 glasses)
- **Quick Add Buttons**: +1 or +2 glasses with one tap
- **Progress Visualization**: 
  - Progress bar
  - Percentage indicator
  - Circular progress indicator
- **Goal Achievement**: Celebration when goal is reached
- **Real-time Updates**: Instant progress updates

### 6. Health Score System
- **Automatic Calculation**: Real-time health score (0-100)
- **Score Breakdown**:
  - Tasks (0-25 points): Based on completion rate
  - Healthy Food (0-25 points): Based on healthy vs non-healthy ratio
  - Water Intake (0-25 points): Based on goal achievement
  - Mood (0-25 points): Based on selected mood
- **Score Categories**:
  - Excellent (80-100): 🌟
  - Good (60-79): 👍
  - Fair (40-59): 😐
  - Needs Improvement (0-39): 💪
- **Visual Breakdown**: Bar charts showing each component

### 7. Data Visualization (Charts)

#### Daily Progress Graph
- **Bar Chart**: Shows completed vs pending tasks
- **Color Coding**: Green for completed, Orange for pending
- **Real-time Updates**: Updates as tasks are completed

#### Healthy vs Non-Healthy Food Chart
- **Pie-like Visualization**: Shows food balance
- **Percentage Display**: Shows healthy vs non-healthy percentages
- **Legend**: Clear color-coded legend

#### Water Intake Progress Graph
- **Circular Indicator**: Visual water intake progress
- **Progress Bar**: Linear progress representation
- **Percentage Display**: Current vs goal

## Technical Implementation

### Technology Stack
- **Framework**: React Native Expo
- **Language**: TypeScript (TSX)
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Storage**: AsyncStorage for local persistence
- **Navigation**: Expo Router
- **Notifications**: Expo Notifications

### Component Architecture

```
components/daily-planner/
├── TaskItem.tsx           # Individual task component
├── TaskList.tsx           # Task list grouped by time slot
├── AddTaskForm.tsx        # Form to add new tasks
├── ProgressBar.tsx         # Progress indicator
├── TimeSlotDropdown.tsx    # Activity suggestions dropdown
├── HealthyFoodList.tsx     # Healthy foods list
├── NonHealthyFoodList.tsx  # Non-healthy foods list
├── HealthySuggestions.tsx  # Main suggestions component
├── MoodTracker.tsx         # Mood selection and tracking
├── WaterTracker.tsx        # Water intake tracking
├── HealthScore.tsx         # Health score display
└── DashboardCharts.tsx     # Data visualization charts
```

### Storage Structure

```
AsyncStorage Keys:
- @dailyplanner:tasks                    # All tasks
- @dailyplanner:foods                    # All food items
- @dailyplanner:activities               # Activity suggestions
- @dailyplanner:moods                    # Mood entries
- @dailyplanner:water:YYYY-MM-DD         # Daily water intake
- @dailyplanner:healthScores:YYYY-MM-DD   # Daily health scores
- @dailyplanner:auth                     # Authentication state
- @dailyplanner:rememberMe               # Remember me preference
```

### Utility Modules

```
utils/
├── storage.ts              # Storage utilities (CRUD operations)
├── notifications.ts        # Notification management
├── health-score.ts         # Health score calculation engine
└── suggestions-data.ts     # Default suggestions data
```

## User Interface

### Screen Layout

1. **Home Tab (Tasks)**
   - Header with greeting
   - Progress bar
   - Tab switcher (Tasks / Healthy Suggestions)
   - Task list by time slot
   - Add task form

2. **Dashboard Tab**
   - Health score display
   - Mood tracker
   - Water intake tracker
   - Data visualization charts

3. **Explore Tab**
   - Additional features (customizable)

### Design Principles
- **Responsive Layout**: Works on all screen sizes
- **Theme Support**: Light and dark mode
- **Color Coding**: 
  - Green: Healthy/Positive
  - Orange: Warning/Neutral
  - Red: Non-healthy/Negative
  - Blue: Information/Water
- **Accessibility**: Clear labels and touch targets

## Data Flow

1. **User Input** → Component Event Handler
2. **Event Handler** → State Update (useState)
3. **State Update** → Storage Utility Function
4. **Storage Utility** → AsyncStorage (Persistence)
5. **Storage Update** → State Refresh
6. **State Refresh** → UI Re-render
7. **UI Update** → User sees changes

## Health Score Calculation

```typescript
Health Score = Tasks Score + Healthy Food Score + Water Score + Mood Score

Tasks Score (0-25):
  = (Completed Tasks / Total Tasks) × 25

Healthy Food Score (0-25):
  = (Healthy Foods / Total Foods) × 25

Water Score (0-25):
  = (Current Intake / Goal) × 25

Mood Score (0-25):
  - Happy: 25 points
  - Normal: 18 points
  - Tired: 12 points
  - Sad: 8 points
```

## Future Enhancements

- Weekly/Monthly statistics
- Export data functionality
- Social sharing
- Cloud sync
- Advanced analytics
- Customizable themes
- Multiple language support

## Performance Considerations

- **Lazy Loading**: Components load on demand
- **Memoization**: useCallback for expensive operations
- **Efficient Storage**: Only store necessary data
- **Optimized Re-renders**: React.memo where appropriate

## Security Considerations

- **Local Storage Only**: All data stored locally
- **No Backend**: No data transmission
- **Password Storage**: Currently plain text (should be hashed in production)
- **Input Validation**: All user inputs validated

## Testing Recommendations

- Unit tests for utility functions
- Component tests for UI components
- Integration tests for data flow
- E2E tests for user flows




