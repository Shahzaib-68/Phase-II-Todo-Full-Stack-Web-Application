---
id: 6
title: Fix Dashboard Layout to Full Screen & Enable Sidebar
stage: general
date_iso: 2026-01-13
surface: agent
model: Qwen
feature: none
branch: main
user: user
command: /sp.implement
labels:
  - dashboard
  - layout
  - ui-fix
  - frontend
  - sidebar
links:
  SPEC: null
  TICKET: null
  ADR: null
  PR: null
files_yaml:
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\app\dashboard\layout.tsx
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\components\layout\sidebar.tsx
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\components\layout\header.tsx
tests_yaml: []
---

## Summary of Changes

Fixed the dashboard layout to full screen and enabled the sidebar with the following changes:

### 1. Fixed Root Dashboard Layout (app/dashboard/layout.tsx)
- Updated the parent container to have `h-screen`, `w-full`, and `overflow-hidden`
- Applied the radial gradient background: `bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black`
- Restructured the layout to include both the sidebar and header components
- Organized the layout as: Sidebar + (Header + Main Content) flex column

### 2. Updated Sidebar Component (components/layout/sidebar.tsx)
- Modified the Sidebar component to accept a className prop
- Integrated the className prop into the motion.aside element
- Maintained all existing functionality while allowing external styling

### 3. Moved Header Component (components/layout/header.tsx)
- Moved the header component from app/dashboard/ to components/layout/
- Maintained all header functionality including dynamic titles and search bar
- Ensured the header appears in the correct position in the layout

The dashboard now properly takes up the full screen with the sidebar visible and all components properly positioned.

## Original Prompt

Qwen, the dashboard is currently showing in half-screen and the Sidebar is missing. Please fix the layout structure immediately.

### 1. Fix Root Dashboard Layout (`app/dashboard/layout.tsx`)
- Ensure the parent container has `min-h-screen`, `w-full`, and `display: flex`.
- The background should be a fixed radial gradient covering the ENTIRE screen: `bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black`.
- **Structure**:
  ```tsx
  <div className="flex h-screen w-full overflow-hidden bg-black text-white">
    <Sidebar className="w-64 shrink-0 border-r border-white/10" />
    <main className="flex-1 overflow-y-auto p-8">
      {children}
    </main>
  </div>

## Response

Successfully fixed the dashboard layout to full screen and enabled the sidebar with proper positioning and styling.