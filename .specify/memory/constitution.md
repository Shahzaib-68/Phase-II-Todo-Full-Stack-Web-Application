# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Spec-First Development
You are FORBIDDEN from writing any code unless you have first read the corresponding specification file in the `/specs/` directory. Workflow: Read Spec -> Propose Plan -> Break into Tasks -> Implementation.

### II. No Manual Intervention
The AI assistant is responsible for all coding tasks. The human provides guidance and approval only.

### III. Tech Stack Enforcement
- **Frontend:** Next.js 16+ (App Router), TypeScript, Tailwind CSS
- **Backend:** Python FastAPI using `uv` for package management
- **Database:** SQLModel (ORM) with Neon Serverless PostgreSQL
- **Auth:** Better Auth (TS) on frontend, integrated via JWT tokens with the FastAPI backend

### IV. Authentication Standard
- Every API endpoint (except login/signup) MUST verify the JWT token
- The `user_id` must be extracted from the token and used to filter all database queries
- Users must NEVER be able to see each other's tasks

### V. Monorepo Structure
- Backend code goes to `/backend`
- Frontend code goes to `/frontend`
- All specs stay in `/specs`

### VI. Code Quality
Use deduplication logic for sources (no repetitive lists). Maintain clean, modular, and academic-grade code.

## Additional Constraints

### Technology Stack Requirements
- Frontend: Next.js 16+ with App Router, TypeScript, Tailwind CSS
- Backend: Python FastAPI with uv package manager
- Database: SQLModel ORM with Neon Serverless PostgreSQL
- Authentication: Better Auth on frontend with JWT integration to FastAPI backend

### Security Requirements
- JWT token verification for all authenticated endpoints
- User data isolation - users cannot access other users' data
- Secure token handling and storage

### Performance Standards
- Efficient database queries with proper indexing
- Optimized API responses
- Fast page load times in the frontend

## Development Workflow

### Implementation Process
1. Read the specification in `/specs/` directory
2. Propose implementation plan
3. Break plan into specific tasks
4. Implement following the defined tech stack
5. Test functionality before moving to next task

### Code Review Requirements
- All code must follow the specified tech stack
- Authentication requirements must be properly implemented
- Database queries must filter by user_id where appropriate
- Clean, modular code structure maintained

### Quality Gates
- All endpoints must verify JWT tokens (except auth endpoints)
- User data isolation must be enforced
- Code must be modular and maintainable
- Proper error handling implemented

## Governance

This constitution serves as the permanent instruction set for the Todo Full-Stack Web Application project. All development activities must comply with these principles. Amendments to this constitution require explicit documentation and approval.

All development must follow the spec-first workflow: specifications are read first, then implementation plans are proposed, tasks are broken down, and finally implementation occurs.

**Version**: 1.0.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08
