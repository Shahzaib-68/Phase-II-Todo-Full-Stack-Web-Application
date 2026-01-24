---
id: 1
title: Fix Pricing Tag Overlap Spacing
stage: general
date: '2026-01-13'
surface: agent
model: Qwen
feature: none
branch: main
user: user
command: /sp.implement
labels:
  - frontend
  - styling
  - pricing
links:
  SPEC: null
  TICKET: null
  ADR: null
  PR: null
files_yaml:
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\app\page.tsx
tests_yaml: []
---

# Fix Pricing Tag Overlap & Spacing

## Summary
Fixed the "POPULAR" badge positioning on the Pro pricing card to address overlap and spacing issues.

## Changes Made
- Updated the "POPULAR" tag container with `top-[-16px]` to lift it higher above the card
- Added `z-20` to ensure the badge stays on top of any borders
- Added subtle glow effect with `shadow-[0_0_10px_rgba(79,70,229,0.5)]`
- Added `mt-4` margin to the Pro card for more breathing room
- Centered the tag horizontally using `left-1/2 -translate-x-1/2`
- Changed the Pro card button text from "Upgrade Now" to "Get Started" to match the design consistency

## Original Prompt
Fix Pricing Tag Overlap & Spacing

Qwen, the "POPULAR" badge on the Pro pricing card is sticking to the card's border and looks overlapped. Please fix the styling in `app/page.tsx`:

### 1. Fix Badge Positioning
- Update the "POPULAR" tag container:
  - Add `top-[-12px]` or `top-[-16px]` to lift it higher above the card.
  - Ensure it has `z-index: 20` to stay on top of any borders.
  - Add a subtle glow to the tag: `shadow-[0_0_10px_rgba(79,70,229,0.5)]`.

### 2. Card Padding & Border
- Add a slight `mt-4` (margin-top) to the Pro card itself so there is more breathing room for the floating tag.
- Ensure the tag is perfectly centered horizontally using `left-1/2 -translate-x-1/2`.

### 3. Polish Navigation
- Just a reminder: Make sure the "Become Elite" and "Get Started" buttons link correctly to `/signup` as discussed.

### 4. Background Continuity
- Ensure the background remains the obsidian black theme and doesn't reset to white.

## Response
Updated the pricing section in `frontend/src/app/page.tsx` with the requested styling changes to fix the "POPULAR" badge positioning and spacing.