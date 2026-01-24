---
id: 11
title: Live Data Integration & Task Logic
stage: general
date_iso: 2026-01-13
surface: agent
model: Qwen
feature: none
branch: main
user: user
command: /sp.implement
labels:
  - api-integration
  - task-management
  - frontend
  - backend
  - auth
links:
  SPEC: null
  TICKET: null
  ADR: null
  PR: null
files_yaml:
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\app\dashboard\page.tsx
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\components\NewTaskDialog.tsx
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\components\layout\header.tsx
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\components\layout\sidebar.tsx
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\app\dashboard\tasks\page.tsx
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\app\dashboard\completed\page.tsx
tests_yaml: []
---

## Summary of Changes

Implemented live data integration and task logic to connect the frontend to the FastAPI backend:

### 1. Fetch Real Stats
- Updated `app/dashboard/page.tsx` to fetch task counts from the backend API (`http://localhost:8000/api/tasks/stats`)
- Used `useEffect` and `useState` to replace hardcoded numbers with real data from the API
- Added proper error handling with toast notifications

### 2. Functional "New Task" (+) Button
- Created a new component `components/NewTaskDialog.tsx` with a Shadcn Dialog (Modal)
- Added form fields: Task Title (Input), Description (Textarea), and Priority (Select)
- Implemented POST request to `http://localhost:8000/api/tasks` using the `authClient` token for authentication
- Added success/error toasts for user feedback

### 3. Sidebar Navigation Logic
- Updated sidebar to make "All Tasks" and "Completed" links functional
- Created/updated routes (`/dashboard/tasks`, `/dashboard/completed`)
- Ensured the Sign Out button in the sidebar calls `authClient.signOut()` and clears the session with proper error handling

### 4. API Error Handling
- Implemented Shadcn Toasts to show:
  - "Task created successfully!" on success
  - "Failed to fetch tasks. Please check your backend." on error
- Verified that the 'Authorization' header is being sent correctly in every fetch request

### 5. Task Pages
- Created functional tasks page (`/dashboard/tasks`) that fetches and displays all tasks
- Created completed tasks page (`/dashboard/completed`) that filters and displays completed tasks
- Added proper loading states and empty state messages

The frontend now connects to the backend API and displays real data with full task management functionality.

## Original Prompt

Qwen, the UI looks great but it's all dummy data. Now, connect the Frontend to our FastAPI backend (localhost:8000).

### 1. Fetch Real Stats
- Update `app/dashboard/page.tsx` to fetch task counts from the backend API (`/api/tasks/stats` or equivalent).
- Use `useEffect` and `useState` to replace the hardcoded numbers (12, 8, 4) with real data from the API.

### 2. Functional "New Task" (+) Button
- When the Blue (+) button is clicked, open a **Shadcn Dialog (Modal)**.
- **Form Fields**: Task Title (Input), Description (Textarea), and Priority (Select).
- **Action**: On "Create", send a `POST` request to `http://localhost:8000/api/tasks` using the `authClient` token for authentication.

### 3. Sidebar Navigation Logic
- Make the "All Tasks" and "Completed" links functional by creating/updating the respective routes (`/dashboard/tasks`, etc.).
- Ensure the **Sign Out** button in the sidebar actually calls `authClient.signOut()` and clears the session.

### 4. API Error Handling
- Use **Shadcn Toasts** to show:
  - "Task created successfully!"
  - "Failed to fetch tasks. Please check your backend."

Verify that the 'Authorization' header is being sent correctly in every fetch request.

## Response

Successfully implemented live data integration and task logic, connecting the frontend to the FastAPI backend with all requested functionality.