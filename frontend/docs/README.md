# DailyPlanner - Smart Daily Task Management Application

## 📱 Overview

DailyPlanner is a comprehensive React Native Expo application that combines task management with health tracking, mood monitoring, and data visualization. Built with TypeScript, it provides a complete solution for managing daily tasks while maintaining awareness of health and wellness.

## ✨ Key Features

### 🎯 Task Management
- Time-based task organization (Morning, Afternoon, Evening, Night)
- Add, edit, delete, and complete tasks
- Real-time progress tracking
- Missed task detection
- Push notifications for reminders

### 🥗 Healthy Daily Suggestions
- **Activity Suggestions**: Pre-defined activities for each time slot
- **Food Planning**: Track healthy vs non-healthy foods
- **Smart Dropdowns**: Easy selection interface
- **Completion Tracking**: Mark activities and foods as done

### 😊 Mood Tracker
- Select daily mood (Happy, Normal, Tired, Sad)
- Mood-based task and food suggestions
- Visual mood indicators
- Daily mood logging

### 💧 Water Intake Tracker
- Set daily water goal (default: 8 glasses)
- Quick add buttons (+1, +2 glasses)
- Progress visualization
- Goal achievement celebration

### 📊 Health Score System
- Automatic calculation (0-100 score)
- Score breakdown by category:
  - Tasks completion (0-25 points)
  - Healthy food ratio (0-25 points)
  - Water intake (0-25 points)
  - Mood selection (0-25 points)
- Visual score categories

### 📈 Data Visualization
- **Task Progress Chart**: Bar chart showing completed vs pending
- **Food Balance Chart**: Pie-like visualization of healthy vs non-healthy
- **Water Progress Chart**: Circular and linear progress indicators

## 🏗️ Architecture

### System Architecture
```
App Root
├── Authentication Layer
├── Navigation Layer (Expo Router)
├── Feature Components Layer
├── State Management Layer (React Hooks)
├── Storage Layer (AsyncStorage)
└── Notification Layer (Expo Notifications)
```

### Component Structure
```
components/daily-planner/
├── TaskItem.tsx
├── TaskList.tsx
├── AddTaskForm.tsx
├── ProgressBar.tsx
├── TimeSlotDropdown.tsx
├── HealthyFoodList.tsx
├── NonHealthyFoodList.tsx
├── HealthySuggestions.tsx
├── MoodTracker.tsx
├── WaterTracker.tsx
├── HealthScore.tsx
└── DashboardCharts.tsx
```

## 📂 Project Structure

```
MyDailyPlanner/
├── app/
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Auth check & redirect
│   ├── login.tsx            # Login screen
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigation
│       ├── index.tsx        # Home/Tasks screen
│       ├── dashboard.tsx    # Dashboard screen
│       └── explore.tsx      # Explore screen
├── components/
│   └── daily-planner/        # Feature components
├── types/
│   └── index.ts             # TypeScript types
├── utils/
│   ├── storage.ts           # Storage utilities
│   ├── notifications.ts     # Notification utilities
│   ├── health-score.ts      # Health score engine
│   └── suggestions-data.ts  # Default data
├── hooks/
│   └── use-auth.ts          # Auth hook
├── constants/
│   └── theme.ts             # Theme colors
└── docs/
    ├── ARCHITECTURE.md      # System architecture
    ├── USER_FLOW.md         # User flow diagrams
    ├── DATA_FLOW.md         # Data flow diagrams
    └── FEATURES.md          # Feature documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator / Physical Device

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MyDailyPlanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   npm run web    # For web
   npm run ios    # For iOS
   npm run android # For Android
   ```

### Login Credentials
For demo purposes, you can use any valid email and password:
- **Email**: `user@example.com` (or any valid email format)
- **Password**: `password123` (or any non-empty password)

## 📱 Usage

### Daily Workflow

1. **Login**: Enter email and password, optionally enable "Remember Me"

2. **Home Tab - Task Management**:
   - View tasks organized by time slots
   - Add new tasks with time slot selection
   - Mark tasks as complete
   - Delete tasks (long press)
   - Switch to "Healthy Suggestions" tab for activities and foods

3. **Dashboard Tab - Health Tracking**:
   - **Select Mood**: Choose how you're feeling
   - **Track Water**: Add water intake, view progress
   - **View Health Score**: See your daily health score
   - **View Charts**: Analyze your daily progress

4. **Healthy Suggestions Tab**:
   - Select activities from dropdowns
   - Add healthy foods
   - Track non-healthy foods (for awareness)
   - Mark items as completed

## 🔧 Technical Details

### Technology Stack
- **Framework**: React Native Expo (~54.0.30)
- **Language**: TypeScript (5.9.2)
- **Navigation**: Expo Router (6.0.21)
- **Storage**: AsyncStorage (2.2.0)
- **Notifications**: Expo Notifications (0.32.15)
- **React**: 19.1.0
- **React Native**: 0.81.5

### Storage Keys
```
@dailyplanner:tasks
@dailyplanner:foods
@dailyplanner:activities
@dailyplanner:moods
@dailyplanner:water:YYYY-MM-DD
@dailyplanner:healthScores:YYYY-MM-DD
@dailyplanner:auth
@dailyplanner:rememberMe
```

### Health Score Formula
```
Total Score = Tasks Score + Healthy Food Score + Water Score + Mood Score

Tasks Score = (Completed / Total) × 25
Healthy Food Score = (Healthy / Total Foods) × 25
Water Score = (Current / Goal) × 25
Mood Score = Based on mood type (8-25 points)
```

## 📊 Data Flow

```
User Input
    ↓
Component Event Handler
    ↓
State Update (useState)
    ↓
Storage Utility Function
    ↓
AsyncStorage (Persistence)
    ↓
State Refresh
    ↓
UI Re-render
```

## 📚 Documentation

- **[Architecture](./ARCHITECTURE.md)**: System architecture and component hierarchy
- **[User Flow](./USER_FLOW.md)**: User journey and flow diagrams
- **[Data Flow](./DATA_FLOW.md)**: Data flow and state management
- **[Features](./FEATURES.md)**: Detailed feature documentation

## 🎨 UI/UX Features

- **Responsive Design**: Works on all screen sizes
- **Theme Support**: Light and dark mode
- **Color Coding**: 
  - 🟢 Green: Healthy/Positive
  - 🟠 Orange: Warning/Neutral
  - 🔴 Red: Non-healthy/Negative
  - 🔵 Blue: Information/Water
- **Accessibility**: Clear labels and touch targets
- **Smooth Animations**: Enhanced user experience

## 🔐 Security

- All data stored locally (no backend)
- Input validation on all forms
- Password storage (should be hashed in production)
- No data transmission

## 🚧 Future Enhancements

- [ ] Weekly/Monthly statistics
- [ ] Data export functionality
- [ ] Cloud sync
- [ ] Social sharing
- [ ] Advanced analytics
- [ ] Customizable themes
- [ ] Multiple language support
- [ ] Widget support
- [ ] Apple Watch / Wear OS integration

## 🐛 Known Issues

- Password stored in plain text (should be hashed in production)
- No data backup/restore functionality
- Limited to single device (no sync)

## 📝 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. For questions or suggestions, please contact the development team.

## 📞 Support

For issues or questions, please refer to the documentation or contact the development team.

---

**Built with ❤️ using React Native Expo and TypeScript**




