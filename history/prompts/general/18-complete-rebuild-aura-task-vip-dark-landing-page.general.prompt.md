---
id: 18
title: Complete Rebuild - "Aura Task" VIP Dark Landing Page
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
  - ui-design
  - frontend
  - shadcn
  - animation
  - premium
links:
  SPEC: null
  TICKET: null
  ADR: null
  PR: null
files_yaml:
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\components\layout\AuraNavbar.tsx
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\app\page.tsx
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\components\ui\accordion.tsx
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\components\ui\switch.tsx
tests_yaml: []
---

## Summary of Changes

Created a complete rebuild of the landing page with the "Aura Task" premium design:

### 1. Aesthetic & Brand
- Named the product "Aura Task" (The VIP Productivity Command Center)
- Implemented a Deep Obsidian Black theme with Electric Indigo and Cyan accents
- Applied Glassmorphism using `backdrop-blur-2xl` and `bg-white/5` for all cards

### 2. Header (Glassmorphic)
- Created a sticky navbar with Logo (Indigo Glow), "Features", "Pricing", "Enterprise"
- Added Action Buttons: "Login" (Ghost) and "Get Aura Pro" (Gradient Button)
- Used Framer Motion for hover effects on the logo

### 3. Hero Section (The "10-Minute" Visual)
- Implemented Framer Motion for a "Floating" effect on the dashboard mockup
- Added Headline: "Work at the Speed of Thought."
- Added Sub-headline: "Aura Task combines minimalist design with AI-powered precision. The ultimate workspace for high-performers."
- Created a Moving Gradient Border button: "Join the Elite Workspace"

### 4. Interactive Pricing Section (The "Chat Board" Future)
- Created 3 tiers using Shadcn Cards:
  - Free: $0/mo. Essential task tracking, 3 projects.
  - Pro: $19/mo. Unlimited tasks, AI Dashboard, Priority Support.
  - Elite (VIP): $49/mo. Includes "Nexus Chat Board" (Real-time collaboration), Advanced Automation, and Dedicated Server.
- Added logic for a toggle switch for Monthly/Yearly (20% off)

### 5. Production Elements (Shadcn)
- Added Accordions for "How Aura AI works"
- Created a Marquee/Logos section: "Trusted by industry leaders"
- Implemented Toasts to show "Welcome to Aura Task" when page loads
- Used a Bento-style layout for features

### 6. Verification
- Verified that framer-motion is installed
- Ensured the page is 100% responsive
- All components are properly integrated and styled

The landing page now features a premium, ultra-modern design with all requested functionality.

## Original Prompt

Qwen, DELETE the current landing page and default Next.js screen. Build a production-ready, ultra-premium landing page named "Aura Task". 

### 1. Aesthetic & Brand
- **Name**: "Aura Task" (The VIP Productivity Command Center).
- **Theme**: Deep Obsidian Black with Electric Indigo and Cyan accents.
- **Glassmorphism**: Use `backdrop-blur-2xl` and `bg-white/5` for all cards.

### 2. Header (Glassmorphic)
- Sticky navbar with Logo (Indigo Glow), "Features", "Pricing", "Enterprise".
- Action Buttons: "Login" (Ghost) and "Get Aura Pro" (Gradient Button).

### 3. Hero Section (The "10-Minute" Visual)
- Use **Framer Motion** for a "Floating" effect on a main dashboard mockup image (or a placeholder glowing div).
- **Headline**: "Work at the Speed of Thought."
- **Sub-headline**: "Aura Task combines minimalist design with AI-powered precision. The ultimate workspace for high-performers."
- Add a **Moving Gradient Border** button: "Join the Elite Workspace".

### 4. Interactive Pricing Section (The "Chat Board" Future)
Create 3 tiers using Shadcn Cards:
- **Free**: $0/mo. Essential task tracking, 3 projects.
- **Pro**: $19/mo. Unlimited tasks, AI Dashboard, Priority Support.
- **Elite (VIP)**: $49/mo. Includes "Nexus Chat Board" (Real-time collaboration), Advanced Automation, and Dedicated Server.
- *Logic*: Use a toggle switch for Monthly/Yearly (20% off).

### 5. Production Elements (Shadcn)
- **Accordions**: For "How Aura AI works".
- **Marquee/Logos**: "Trusted by industry leaders".
- **Toasts**: Show a toast "Welcome to Aura Task" when page loads.
- **Bento Grid**: Use a Bento-style layout for features.

### 6. Verification
- Use `npm install framer-motion` if not present.
- Ensure the page is 100% responsive.

## Response

Successfully completed the rebuild of the landing page with the "Aura Task" premium design and all requested features.