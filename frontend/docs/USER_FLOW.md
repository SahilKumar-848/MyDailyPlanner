# DailyPlanner - User Flow Diagram

## User Flow Diagram

```
┌─────────────────┐
│   App Launch    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Check Auth     │
│  State          │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌─────────┐
│Logged In│ │Not Logged│
└────┬────┘ └────┬─────┘
     │          │
     │          ▼
     │    ┌──────────┐
     │    │ Login    │
     │    │ Screen   │
     │    └────┬─────┘
     │         │
     │         ▼
     │    ┌──────────┐
     │    │ Validate │
     │    │ Credentials│
     │    └────┬─────┘
     │         │
     │    ┌────┴────┐
     │    │         │
     │    ▼         ▼
     │ ┌─────┐  ┌──────┐
     │ │Valid│  │Invalid│
     │ └──┬──┘  └──┬───┘
     │    │        │
     │    │        └──► (Show Error)
     │    │
     └────┴─────────────┐
                        │
                        ▼
              ┌─────────────────┐
              │  Main App        │
              │  (Tab Navigator) │
              └────────┬─────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Home Tab   │ │ Dashboard   │ │  Explore   │
│  (Tasks)    │ │  Tab        │ │  Tab        │
└──────┬──────┘ └──────┬──────┘ └─────────────┘
       │               │
       │               │
       ▼               ▼
┌─────────────┐ ┌─────────────────────────┐
│ Task        │ │  Dashboard Features     │
│ Management  │ │  ┌───────────────────┐  │
│             │ │  │ 1. Select Mood     │  │
│ - Add Task  │ │  │    (Happy/Normal/  │  │
│ - Edit Task │ │  │     Tired/Sad)     │  │
│ - Complete  │ │  └─────────┬─────────┘  │
│ - Delete    │ │            │            │
└──────┬──────┘ │            ▼            │
       │         │  ┌───────────────────┐  │
       │         │  │ 2. View Suggestions│  │
       │         │  │    (Based on Mood) │  │
       │         │  └─────────┬─────────┘  │
       │         │            │            │
       │         │            ▼            │
       │         │  ┌───────────────────┐  │
       │         │  │ 3. Track Water     │  │
       │         │  │    Intake         │  │
       │         │  │    (+1, +2 glasses)│  │
       │         │  └─────────┬─────────┘  │
       │         │            │            │
       │         │            ▼            │
       │         │  ┌───────────────────┐  │
       │         │  │ 4. View Health     │  │
       │         │  │    Score          │  │
       │         │  │    (Auto-calculated)│
       │         │  └─────────┬─────────┘  │
       │         │            │            │
       │         │            ▼            │
       │         │  ┌───────────────────┐  │
       │         │  │ 5. View Charts    │  │
       │         │  │    - Task Progress │  │
       │         │  │    - Food Balance │  │
       │         │  │    - Water Progress│ │
       │         │  └───────────────────┘  │
       │         └─────────────────────────┘
       │
       ▼
┌─────────────┐
│ Healthy     │
│ Suggestions │
│             │
│ - Activities│
│ - Foods     │
│   (Healthy/ │
│   Non-      │
│   Healthy)  │
└─────────────┘
```

## Detailed User Journey

### 1. Login Flow
```
Start → Check Auth → Not Authenticated → Login Screen
  → Enter Email/Password → Validate → Save Auth State
  → Navigate to Main App
```

### 2. Daily Planning Flow
```
Main App → Home Tab → View Tasks
  → Add New Task → Select Time Slot → Enter Title
  → Save Task → Task Appears in List
  → Complete Task → Mark as Done → Progress Updates
```

### 3. Mood Selection Flow
```
Dashboard Tab → Mood Tracker → Select Mood
  → Save Mood → View Suggestions
  → (Tasks & Foods suggested based on mood)
```

### 4. Water Tracking Flow
```
Dashboard Tab → Water Tracker → View Current Intake
  → Quick Add (+1 or +2 glasses) → Update Progress
  → View Progress Bar → Goal Reached? → Celebration
```

### 5. Health Score Flow
```
Dashboard Tab → Health Score Component
  → Auto-calculates based on:
     - Tasks Completed
     - Healthy Food Ratio
     - Water Intake
     - Mood Selection
  → Display Score with Breakdown
```

### 6. Food Planning Flow
```
Home Tab → Healthy Suggestions Tab
  → Select Time Slot → View Dropdown
  → Select Activity → Add to List
  → Add Healthy Food → Mark as Eaten
  → Add Non-Healthy Food (for awareness)
  → View Food Balance
```

## State Transitions

```
Initial State
    │
    ├─► Loading State (Fetching Data)
    │
    ├─► Authenticated State
    │   │
    │   ├─► Home Tab State
    │   │   ├─► Task List View
    │   │   ├─► Add Task View
    │   │   └─► Healthy Suggestions View
    │   │
    │   └─► Dashboard Tab State
    │       ├─► Mood Selection
    │       ├─► Water Tracking
    │       ├─► Health Score View
    │       └─► Charts View
    │
    └─► Unauthenticated State
        └─► Login View
```

## Data Persistence Flow

```
User Action → Component Update → State Change
    │
    ▼
Storage Utility Function
    │
    ▼
AsyncStorage.setItem()
    │
    ▼
Data Saved Locally
    │
    ▼
On App Reload → AsyncStorage.getItem()
    │
    ▼
Data Restored → State Initialized
```




