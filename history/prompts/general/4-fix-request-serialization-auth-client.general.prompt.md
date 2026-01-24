---
id: 4
title: Fix Request Serialization in auth-client.ts
stage: general
date_iso: 2026-01-17
surface: agent
model: qwen
feature: none
branch: main
user: user
command: /sp.implement
labels:
  - auth
  - serialization
  - better-auth
  - json
  - frontend
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\lib\auth-client.ts
tests_yaml: []
---

# Fix Request Serialization in auth-client.ts

## User Intent
Fix the issue where the Signup page is sending data correctly, but the backend receives b'[object Object]' instead of actual JSON data. This indicates that the Better Auth client is not properly stringifying the body for FastAPI.

## Changes Made

### 1. Update auth-client.ts
- Added a `bodySerializer` function to the `fetchOptions` configuration in `src/lib/auth-client.ts`
- The `bodySerializer` function ensures that every request body is properly stringified using `JSON.stringify(body)`
- This forces the Better Auth client to serialize request bodies correctly before sending them to the backend

## Technical Details

### Before
The auth client configuration only included headers and credentials settings, but didn't ensure proper serialization of request bodies.

### After
The auth client now includes a `bodySerializer` function that explicitly converts request bodies to JSON strings, ensuring that the backend receives properly formatted JSON data instead of "[object Object]".

## Outcome
The frontend should now properly serialize request bodies as JSON strings before sending them to the backend, resolving the "[object Object]" issue.

## Verification
- The `bodySerializer` function is added to the fetchOptions
- Request bodies will be properly stringified using JSON.stringify
- The backend should now receive actual JSON data instead of "[object Object]"