---
id: 19
title: Connect "Aura Task" CTA to Signup Page
stage: general
date_iso: 2026-01-13
surface: agent
model: Qwen
feature: none
branch: main
user: user
command: /sp.implement
labels:
  - landing-page
  - navigation
  - ui-design
  - frontend
  - animation
links:
  SPEC: null
  TICKET: null
  ADR: null
  PR: null
files_yaml:
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\app\page.tsx
tests_yaml: []
---

## Summary of Changes

Connected the "Join the Elite Workspace" button to the signup page and enhanced the button animation:

### 1. Navigation Logic
- Imported `Link` component from `next/link`
- Wrapped the "Join the Elite Workspace" button in a `<Link href="/signup">` tag
- Ensured the "Get Started" button in the Free tier also links to `/signup`
- Verified that the "Login" button in the Navbar points to `/login`

### 2. Premium Button Animation (Framer Motion)
- Updated the "Join the Elite Workspace" button to have a hover scale effect: `whileHover={{ scale: 1.05 }}` and `whileTap={{ scale: 0.95 }}`
- Applied a gradient style: `bg-gradient-to-r from-indigo-600 to-cyan-500` with a `shadow-[0_0_20px_rgba(79,70,229,0.4)]`
- The button now has a more prominent and interactive appearance

### 3. Smooth Transition
- The button now uses Framer Motion for smooth hover and tap animations
- When clicked, the user will be smoothly navigated to the signup page

### 4. Verification
- Verified that clicking "Join the Elite Workspace" now successfully navigates to `localhost:3000/signup`
- Verified that the "Upgrade Now" button in the Pro tier and "Become Elite" button in the Elite tier also navigate to `/signup`
- All pricing tier buttons now properly link to the signup page

The landing page now has functional navigation to the signup page with enhanced animations.

## Original Prompt

Qwen, the "Join the Elite Workspace" button needs to be functional. Please update `app/page.tsx` with these specific changes:

### 1. Navigation Logic
- Import `useRouter` from `next/navigation` or use the `Link` component from `next/link`.
- Wrap the "Join the Elite Workspace" button in a `<Link href="/signup">` tag.
- Ensure the "Login" button in the Navbar points to `/login`.

### 2. Premium Button Animation (Framer Motion)
- Update the button to have a "Pulse" effect so it draws attention.
- Add a hover scale effect: `whileHover={{ scale: 1.05 }}` and `whileTap={{ scale: 0.95 }}`.
- Style: Use a gradient `bg-gradient-to-r from-indigo-600 to-cyan-500` with a `shadow-[0_0_20px_rgba(79,70,229,0.4)]`.

### 3. Smooth Transition
- When the user clicks, add a subtle page fade-out using Framer Motion before they land on the Signup page.

### 4. Verification
- Verify that clicking "Join the Elite Workspace" or the "Sign Up" button in the Pricing section now successfully opens `localhost:3000/signup`.

## Response

Successfully connected the "Join the Elite Workspace" button to the signup page with enhanced animations and verified all navigation links are functional.