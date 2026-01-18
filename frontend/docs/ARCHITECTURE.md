# DailyPlanner - System Architecture Documentation

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        DailyPlanner App                          │
│                    (React Native Expo + TSX)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         Authentication Layer             │
        │  ┌───────────────────────────────────┐  │
        │  │  Login Screen                      │  │
        │  │  - Email/Password Validation       │  │
        │  │  - Remember Me (AsyncStorage)      │  │
        │  └───────────────────────────────────┘  │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         Navigation Layer                │
        │  ┌───────────────────────────────────┐  │
        │  │  Expo Router                        │  │
        │  │  - Tab Navigation                   │  │
        │  │  - Stack Navigation                 │  │
        │  └───────────────────────────────────┘  │
        └─────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  Home Screen  │   │  Dashboard    │   │  Explore      │
│  (Tasks)      │   │  Screen       │   │  Screen       │
└───────────────┘   └───────────────┘   └───────────────┘
        │                     │
        │                     │
        ▼                     ▼
┌───────────────────────────────────────────────┐
│         Feature Components Layer              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ TaskList │  │ Mood      │  │ Water    │  │
│  │ TaskItem │  │ Tracker   │  │ Tracker  │  │
│  │ AddTask  │  │           │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Healthy  │  │ Health   │  │ Dashboard│  │
│  │ Foods    │  │ Score    │  │ Charts   │  │
│  │ Non-     │  │ Engine   │  │          │  │
│  │ Healthy  │  │          │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└───────────────────────────────────────────────┘
        │                     │
        │                     │
        ▼                     ▼
┌───────────────────────────────────────────────┐
│         State Management Layer                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ React    │  │ Custom    │  │ Context  │  │
│  │ Hooks    │  │ Hooks     │  │ Providers│  │
│  │ (useState│  │ (useAuth) │  │          │  │
│  │ useEffect│  │           │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└───────────────────────────────────────────────┘
        │                     │
        │                     │
        ▼                     ▼
┌───────────────────────────────────────────────┐
│         Storage Layer (AsyncStorage)          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Task     │  │ Mood     │  │ Water    │  │
│  │ Storage  │  │ Storage  │  │ Storage  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Food     │  │ Activity │  │ Health   │  │
│  │ Storage  │  │ Storage  │  │ Score    │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────┐                               │
│  │ Auth     │                               │
│  │ Storage  │                               │
│  └──────────┘                               │
└───────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────┐
│         Notification Layer                     │
│  ┌──────────────────────────────────────────┐ │
│  │ Expo Notifications                       │ │
│  │ - Task Reminders                         │ │
│  │ - Time-based Alerts                     │ │
│  └──────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

## Component Hierarchy

```
App Root
├── RootLayout (_layout.tsx)
│   ├── Stack Navigator
│   │   ├── Index Screen (Auth Check)
│   │   ├── Login Screen
│   │   └── Tabs Navigator
│   │       ├── Home Tab (index.tsx)
│   │       │   ├── TaskList
│   │       │   ├── AddTaskForm
│   │       │   └── HealthySuggestions
│   │       ├── Dashboard Tab (dashboard.tsx)
│   │       │   ├── HealthScore
│   │       │   ├── MoodTracker
│   │       │   ├── WaterTracker
│   │       │   └── DashboardCharts
│   │       └── Explore Tab
```

## Data Flow Architecture

```
User Input
    │
    ▼
Component (UI Layer)
    │
    ▼
State Management (React Hooks)
    │
    ▼
Storage Utilities (Storage Layer)
    │
    ▼
AsyncStorage (Persistence)
    │
    ▼
Data Retrieval
    │
    ▼
State Update
    │
    ▼
UI Re-render
```

## Key Modules

1. **Authentication Module**
   - Login validation
   - Session management
   - Remember Me functionality

2. **Task Management Module**
   - CRUD operations for tasks
   - Time slot categorization
   - Progress tracking

3. **Health Tracking Module**
   - Mood tracking
   - Water intake monitoring
   - Food selection (healthy vs non-healthy)
   - Health score calculation

4. **Analytics Module**
   - Data visualization
   - Progress charts
   - Health metrics

5. **Storage Module**
   - AsyncStorage wrappers
   - Data persistence
   - State synchronization




