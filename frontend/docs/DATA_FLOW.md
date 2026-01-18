# DailyPlanner - Data Flow Diagram

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION LAYER                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   UI     │  │   Forms  │  │  Buttons │  │  Charts  │   │
│  │ Components│ │          │  │          │  │          │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                  EVENT HANDLING LAYER                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ onPress  │  │ onChange  │  │ onSubmit │  │ onToggle  │   │
│  │ Handlers │  │ Handlers  │  │ Handlers │  │ Handlers  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                  STATE MANAGEMENT LAYER                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ useState │  │ useEffect│  │ useCallback│ │ Custom   │   │
│  │ Hooks    │  │ Hooks    │  │ Hooks     │  │ Hooks    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                  BUSINESS LOGIC LAYER                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Task     │  │ Health   │  │ Mood     │  │ Water    │   │
│  │ Logic    │  │ Score    │  │ Logic    │  │ Logic    │   │
│  │          │  │ Engine   │  │          │  │          │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                  STORAGE UTILITY LAYER                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Task     │  │ Food     │  │ Mood     │  │ Water    │   │
│  │ Storage  │  │ Storage  │  │ Storage  │  │ Storage  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ Activity │  │ Health   │  │ Auth     │                  │
│  │ Storage  │  │ Score    │  │ Storage  │                  │
│  │          │  │ Storage  │  │          │                  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
└───────┼─────────────┼─────────────┼────────────────────────┘
        │             │             │
        │             │             │
        ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                  PERSISTENCE LAYER                           │
│                    AsyncStorage                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Key-Value Storage                                    │   │
│  │  - @dailyplanner:tasks                                │   │
│  │  - @dailyplanner:foods                                │   │
│  │  - @dailyplanner:moods                                │   │
│  │  - @dailyplanner:water:YYYY-MM-DD                     │   │
│  │  - @dailyplanner:healthScores:YYYY-MM-DD              │   │
│  │  - @dailyplanner:auth                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### Example 1: Adding a Task

```
User Input (Add Task Form)
    │
    ▼
handleAddTask()
    │
    ▼
Create Task Object
    │
    ▼
TaskStorage.addTask()
    │
    ▼
AsyncStorage.setItem('@dailyplanner:tasks', JSON.stringify(tasks))
    │
    ▼
loadTasks() - Refresh State
    │
    ▼
setTasks(updatedTasks)
    │
    ▼
UI Re-renders with New Task
```

### Example 2: Calculating Health Score

```
Dashboard Component Mounts
    │
    ▼
Load All Data (Tasks, Foods, Water, Mood)
    │
    ▼
calculateHealthScore(inputs)
    │
    ├─► Calculate Tasks Score (0-25)
    ├─► Calculate Healthy Food Score (0-25)
    ├─► Calculate Water Score (0-25)
    └─► Calculate Mood Score (0-25)
    │
    ▼
Total Score (0-100)
    │
    ▼
HealthScoreStorage.saveHealthScore()
    │
    ▼
setHealthScore(score)
    │
    ▼
UI Displays Health Score with Breakdown
```

### Example 3: Water Intake Update

```
User Clicks "+1 Glass" Button
    │
    ▼
handleAddWater(1)
    │
    ▼
WaterStorage.addWaterEntry(date, 1)
    │
    ├─► Load Current Water Data
    ├─► Add New Entry
    ├─► Recalculate Current Total
    └─► Save Updated Data
    │
    ▼
AsyncStorage.setItem('@dailyplanner:water:YYYY-MM-DD', ...)
    │
    ▼
loadWaterData() - Refresh State
    │
    ▼
setWaterIntake(updatedData)
    │
    ▼
UI Updates Progress Bar & Counter
```

### Example 4: Mood Selection

```
User Selects Mood (e.g., "Happy")
    │
    ▼
handleMoodSelect('happy')
    │
    ▼
Create MoodEntry Object
    │
    ▼
MoodStorage.saveMood(moodEntry)
    │
    ├─► Load All Moods
    ├─► Update or Add Entry
    └─► Save to Storage
    │
    ▼
AsyncStorage.setItem('@dailyplanner:moods', ...)
    │
    ▼
setTodayMood(moodEntry)
    │
    ▼
onMoodChange?.(mood) - Callback
    │
    ▼
UI Updates:
    - Mood Selection Highlighted
    - Suggestions Displayed
    - Health Score Recalculated
```

## Data Synchronization

```
Component State ←──┐
    │              │
    │              │
    ▼              │
Storage Utility    │
    │              │
    │              │
    ▼              │
AsyncStorage       │
    │              │
    │              │
    ▼              │
On App Reload ─────┘
    │
    ▼
Load from Storage
    │
    ▼
Initialize State
    │
    ▼
Render UI
```

## Real-time Updates Flow

```
User Action
    │
    ▼
State Update (useState)
    │
    ▼
Storage Update (AsyncStorage)
    │
    ▼
Component Re-render (React)
    │
    ▼
UI Update (Visible to User)
    │
    ▼
Related Components Update
    (via props/callbacks)
    │
    ▼
Cascading Updates
    (Health Score, Charts, etc.)
```

## Error Handling Flow

```
Operation Attempt
    │
    ▼
Try Block
    │
    ├─► Success ──► Update State ──► UI Update
    │
    └─► Error ──► Catch Block
                    │
                    ├─► Log Error
                    ├─► Show Alert
                    └─► Maintain Previous State
```




