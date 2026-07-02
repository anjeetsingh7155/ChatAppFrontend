# 💻 StudySpace Frontend - Collaborative Learning Dashboard

This is the frontend client for **StudySpace**, a real-time collaborative workspace where users join course-specific channels to communicate and learn with their peers. Built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS v4**, the application features a dark glassmorphic design and incorporates reusable component patterns.

---

## 🎨 Design & Layout Features

1. **Split-Pane Authentication System**:
   - **Left Panel**: Highlights StudySpace branding and features along with clean, styled typography.
   - **Right Panel**: Houses a glassmorphic authentication card containing email/password register and login forms.
2. **Interactive Live Dashboard**:
   - **Study Channels Sidebar**: Lets users switch between dynamically isolated rooms: `#general`, `#web-development`, `#dsa-prep`, `#system-design`.
   - **Real-time Connection Banner**: Shows a status indicator dot matching WebSocket states (`connected`, `connecting`, `disconnected`).
   - **Chat Feed**: Segregates message bubbles (sender vs peers), displaying dynamically generated initials-based avatars, sender names, and format-correct timestamps.
3. **Session Persistence**: Reads and validates saved tokens and user profiles from `localStorage` directly during state construction to ensure smooth user page reloads without cascading flash-renders.
4. **Auto-scrolling Container**: Tracks incoming message updates and automatically snaps viewports down to the bottom scroll state.

---

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin)
- **Icons**: Lucide React
- **Language**: TypeScript

---

## 📁 Project Structure

```bash
ChatApplicationFrontend/
├── src/
│   ├── assets/
│   │   └── workspace.jpg      # Ambient background illustration
│   ├── components/
│   │   ├── ui/                # Reusable UI Atoms
│   │   │   ├── Button.tsx     # Custom Button component (Primary/Outline)
│   │   │   ├── FeatureItem.tsx# Informative sidebar bullets
│   │   │   └── Input.tsx      # Form Input (with built-in validation & toggle)
│   │   ├── Auth.tsx           # Authentication page wrapper (Login/SignUp)
│   │   └── ChatDashboard.tsx  # Workspace chat panel (WS hooks & REST history)
│   ├── App.tsx                # App state shell and routing manager
│   ├── index.css              # Custom Tailwind reset stylesheet
│   └── main.tsx               # App entrypoint
├── vite.config.ts             # Vite server configurations
├── tsconfig.json              # TypeScript configuration
└── package.json               # App configuration & scripts
```

---

## 🧩 Reusable UI Components Guide

The application uses customizable atoms to enforce design consistency.

### 1. `Input` Component
A wrapper for standard inputs, adding icons, labels, password visibility toggles, and validation helpers.
```tsx
import Input from "./components/ui/Input";
import { Lock, CheckCircle2 } from "lucide-react";

<Input
  label="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Create a password"
  icon={Lock}
  helperText="At least 8 characters"
  helperIcon={CheckCircle2}
  required
/>
```

### 2. `Button` Component
Handles submit logic, gradient themes, border variants, loading states, and leading icons.
```tsx
import Button from "./components/ui/Button";
import { LogIn } from "lucide-react";

<Button
  type="submit"
  loading={loading}
  icon={LogIn}
>
  Login
</Button>
```

### 3. `FeatureItem` Component
Renders the icon cards and description lists displayed on the brand dashboard.
```tsx
import FeatureItem from "./components/ui/FeatureItem";
import { Users } from "lucide-react";

<FeatureItem
  icon={Users}
  title="Collaborative Learning"
  description="Study together and achieve more"
/>
```

---

## 🚀 Setup & Installation

### 1. Install Dependencies
Navigate into the directory and install dependencies:
```bash
npm install
```

### 2. Configure Environment URL
If your backend port changes, update the URLs:
- **REST APIs** in `Auth.tsx` and `ChatDashboard.tsx`: `http://localhost:8080/api/...`
- **WebSocket URL** in `ChatDashboard.tsx`: `ws://localhost:8080`

### 3. Start Development Server
Launch the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build and Compile
Verify and package resources for production build:
```bash
npm run build
```
The compiled assets will compile into the `/dist` directory.
