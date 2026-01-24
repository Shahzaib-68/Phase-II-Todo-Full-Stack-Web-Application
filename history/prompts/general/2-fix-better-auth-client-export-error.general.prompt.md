---
id: 2
title: Fix Better Auth Client Export Error
stage: general
date_iso: 2026-01-13
surface: agent
model: Qwen
feature: none
branch: main
user: user
command: /sp.implement
labels:
  - bug-fix
  - auth
  - frontend
  - better-auth
links:
  SPEC: null
  TICKET: null
  ADR: null
  PR: null
files_yaml:
  - D:\My Life Next Chapter Start\MY_TODO_APP_II\frontend\src\lib\auth-client.ts
tests_yaml: []
---

## Summary of Changes

Fixed the Better Auth Client export error by simplifying the auth-client.ts file:

- Removed the import for `JWTPlugin` from `better-auth/client/plugins`
- Removed the JWTPlugin from the authClient initialization
- Left only the necessary `createAuthClient` initialization with the baseURL configuration

This resolves the version mismatch or incorrect import issue for `JWTPlugin` as Better Auth handles JWT functionality automatically via the session, so the explicit plugin is not needed on the client-side.

## Original Prompt

Qwen, there is a version mismatch or incorrect import for `JWTPlugin` in `lib/auth-client.ts`. Please fix it with these steps:

### 1. Simplify auth-client.ts
- Remove the import for `JWTPlugin` from `better-auth/client/plugins`.
- Re-initialize the `authClient` without the explicit JWT plugin on the client-side (Better Auth handles this automatically via the session).
- Ensure the code looks like this:
  ```typescript
  import { createAuthClient } from "better-auth/react";

  export const authClient = createAuthClient({
      baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:8000",
  });
  ```

## Response

Successfully simplified the auth-client.ts file by removing the JWTPlugin import and initialization, resolving the version mismatch issue.