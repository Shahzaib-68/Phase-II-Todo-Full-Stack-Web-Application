# Implementation Plan: Task Management API Backend

**Branch**: `001-backend-spec` | **Date**: 2026-01-09 | **Spec**: [link to spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-backend-spec/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a FastAPI-based RESTful backend for a multi-user task management system. The backend provides secure CRUD operations for tasks using JWT-based authentication to ensure users can only access their own data. Built with SQLModel ORM connecting to Neon PostgreSQL database.

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: FastAPI, SQLModel, python-jose[cryptography], uvicorn, psycopg2-binary
**Storage**: Neon Serverless PostgreSQL
**Testing**: pytest
**Target Platform**: Linux server (deployable to cloud platforms like Railway/Render/Fly.io)
**Project Type**: Single web backend service
**Performance Goals**: Handle 1000+ concurrent users, <200ms response time for 95% of requests
**Constraints**: <100MB memory usage, secure JWT validation, user data isolation
**Scale/Scope**: Support 10k+ users, 1M+ tasks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

All constitutional requirements are met:
- Uses type-safe request/response models (Pydantic)
- Implements proper authentication and authorization
- Follows RESTful API design principles
- Includes comprehensive error handling
- Has proper separation of concerns in architecture

## Project Structure

### Documentation (this feature)

```text
specs/001-backend-spec/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── main.py                 # FastAPI app entry point
├── models.py               # SQLModel database models
├── schemas.py              # Pydantic request/response models
├── database.py             # Database connection and session
├── auth.py                 # JWT authentication logic
├── config.py               # Environment configuration
├── routes/
│   └── tasks.py            # Task endpoints
├── middleware/
│   └── cors.py             # CORS configuration
├── tests/
│   ├── test_tasks.py       # Task endpoint tests
│   └── test_auth.py        # Authentication tests
├── pyproject.toml          # uv project configuration
├── uv.lock                 # Dependency lock file
├── .env.example            # Environment variable template
├── .env                    # Actual environment variables (gitignored)
├── .gitignore              # Git ignore rules
├── README.md               # Setup and usage instructions
└── QWEN.md               # Backend-specific AI instructions
```

**Structure Decision**: Selected single web backend service structure to implement the task management API with FastAPI, SQLModel, and Neon PostgreSQL as specified in the requirements.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Phase II Backend - Implementation Plan

## Overview
- Total Time: 10-12 hours
- Total Phases: 8
- Total Tasks: ~22

---

## Phase 1: Project Setup & Configuration
**Goal**: Initialize the project with proper dependencies, folder structure, and environment configuration.
**Time**: 1.5 hours
**Tasks**:

### 1.1 Initialize uv Project (15 min)

**Description**: Create a new Python project using uv package manager. This sets up the basic project structure with pyproject.toml and initializes the Python environment for development.

**Files**:
- `pyproject.toml` (create)
- `uv.lock` (auto-generated)
- `.python-version` (create)

**Commands**:
```bash
mkdir backend
cd backend
uv init
uv python install 3.11
```

**Validation**:
✅ Run `ls` and verify pyproject.toml exists
✅ Run `uv --version` to confirm uv is installed
✅ Run `python --version` to confirm Python 3.11

**Dependencies**: None (first task)

**Risk**: None

---

### 1.2 Install Core Dependencies (20 min)

**Description**: Add all required packages for FastAPI backend including web framework, database ORM, authentication libraries, and ASGI server. Using uv ensures reproducible builds with locked dependencies.

**Files**:
- `pyproject.toml` (modify)
- `uv.lock` (update)

**Commands**:
```bash
cd backend
uv add fastapi uvicorn[standard]
uv add sqlmodel psycopg2-binary
uv add python-jose[cryptography] python-multipart
uv add pydantic-settings
uv sync
```

**Validation**:
✅ Run `uv run python -c "import fastapi, sqlmodel; print('OK')"`
✅ Check `pyproject.toml` contains all dependencies
✅ Verify `uv.lock` file updated with new hashes

**Dependencies**: Task 1.1 (Project initialized)

**Risk**: Low - Common dependencies, well-tested versions

---

### 1.3 Create Folder Structure (10 min)

**Description**: Set up the recommended project structure with separate directories for models, routes, middleware, and configuration files. This provides a clean separation of concerns.

**Files**:
- `models/` (create)
- `routes/` (create)
- `middleware/` (create)
- `config/` (create)
- `auth.py` (create)
- `database.py` (create)
- `schemas.py` (create)

**Commands**:
```bash
cd backend
mkdir models routes middleware config tests
touch auth.py database.py schemas.py main.py
```

**Validation**:
✅ Run `ls -R` and verify all directories exist
✅ Check that all specified files were created
✅ Verify directory structure matches plan

**Dependencies**: Task 1.1 (Project initialized)

**Risk**: None

---

### 1.4 Setup Environment Variables (15 min)

**Description**: Create .env.example file with all required environment variables and set up .env file for local development. This ensures secure handling of sensitive configuration.

**Files**:
- `.env.example` (create)
- `.env` (create)
- `.gitignore` (update)

**Commands**:
```bash
cd backend
echo "DATABASE_URL=postgresql://username:password@hostname:5432/database_name
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters-long-random-string
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
ENVIRONMENT=development
LOG_LEVEL=info
PORT=8000
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=20" > .env.example

cp .env.example .env

# Add to .gitignore if not already there
if ! grep -q ".env" .gitignore; then
  echo ".env" >> .gitignore
fi
```

**Validation**:
✅ Check that .env.example contains all required variables
✅ Verify .env file was created as a copy
✅ Confirm .env is in .gitignore

**Dependencies**: None

**Risk**: None

---

## Phase 2: Database Connection & Models
**Goal**: Establish connection to Neon PostgreSQL and define the Task model using SQLModel.
**Time**: 2 hours
**Tasks**:

### 2.1 Configure Database Connection (25 min)

**Description**: Set up database connection using SQLModel with Neon PostgreSQL. This includes creating engine and session factories that will be used throughout the application.

**Files**:
- `database.py` (modify)

**Commands**: None (code implementation)

**Code Implementation**:
- Import SQLModel create_engine and Session
- Create DATABASE_URL from environment variable
- Create engine with appropriate settings for Neon
- Create get_session dependency for FastAPI

**Validation**:
✅ Import statements work without errors
✅ Engine connects to database (when credentials provided)
✅ get_session function returns valid session

**Dependencies**: Task 1.4 (Environment variables set)

**Risk**: Medium - Requires valid database credentials for testing

---

### 2.2 Create Task SQLModel (30 min) ⚠️

**Description**: Define the Task model using SQLModel that combines SQLAlchemy ORM capabilities with Pydantic validation. This model will map to the tasks table in the database.

**Files**:
- `models.py` (modify)

**Commands**: None (code implementation)

**Code Implementation**:
- Import SQLModel, Field, and datetime
- Create Task class inheriting from SQLModel and table=True
- Define all required fields: id, user_id, title, description, completed, created_at, updated_at
- Add appropriate constraints and defaults

**Validation**:
✅ Import statements work without errors
✅ Model definition is syntactically correct
✅ All required fields are present with correct types
✅ Field constraints match specification

**Dependencies**: Task 1.2 (Dependencies installed)

**Risk**: High - Core data model affects entire application

---

### 2.3 Define Indexes and Constraints (20 min)

**Description**: Add database indexes and constraints to the Task model to optimize query performance and ensure data integrity as specified in the technical requirements.

**Files**:
- `models.py` (modify)

**Commands**: None (code implementation)

**Code Implementation**:
- Add index on user_id field for efficient user-specific queries
- Add composite index on user_id and completed for filtered queries
- Ensure proper constraints on title length (1-200 chars)
- Ensure proper constraints on description length (max 1000 chars)

**Validation**:
✅ Indexes defined correctly on model
✅ Field constraints match specification
✅ Model still imports without errors

**Dependencies**: Task 2.2 (Task model exists)

**Risk**: Medium - Performance and data integrity implications

---

### 2.4 Test Database Connectivity (45 min)

**Description**: Create a simple test to verify the database connection works properly with Neon PostgreSQL. This includes creating the tables if they don't exist.

**Files**:
- `database.py` (modify)
- `main.py` (modify)

**Commands**:
```bash
cd backend
uv run python -c "
from database import engine
from models import Task
from sqlmodel import SQLModel

# Create all tables
SQLModel.metadata.create_all(engine)
print('Tables created successfully')
"
```

**Code Implementation**:
- Add table creation logic to main.py or a dedicated script
- Include error handling for connection issues
- Add health check that verifies database connectivity

**Validation**:
✅ Tables created successfully in database
✅ No errors during connection
✅ Health check endpoint confirms database connectivity

**Dependencies**: All previous tasks in Phase 2

**Risk**: Medium - Requires actual database connection

---

## Phase 3: Authentication & Security
**Goal**: Implement JWT token validation and security dependency for user authentication.
**Time**: 2 hours
**Tasks**:

### 3.1 Install JWT Dependencies (10 min)

**Description**: Ensure all JWT-related dependencies are properly installed and available. The python-jose library is needed for JWT token decoding and validation.

**Files**:
- `pyproject.toml` (verify)
- `uv.lock` (verify)

**Commands**:
```bash
cd backend
# Verify installation
uv run python -c "from jose import jwt; print('JWT library available')"
```

**Validation**:
✅ python-jose library imports successfully
✅ JWT functionality works (encoding/decoding test)

**Dependencies**: Task 1.2 (Dependencies installed)

**Risk**: None

---

### 3.2 Create JWT Validation Logic (35 min) ⚠️

**Description**: Implement the core JWT validation logic that decodes tokens, verifies signatures using BETTER_AUTH_SECRET, and extracts user information. This is critical for security.

**Files**:
- `auth.py` (modify)

**Commands**: None (code implementation)

**Code Implementation**:
- Import jwt from jose and datetime
- Create SECRET_KEY from environment variable
- Create ALGORITHM constant
- Implement decode_token function
- Add token expiration check
- Add error handling for invalid tokens

**Validation**:
✅ Valid tokens decode successfully
✅ Invalid tokens raise appropriate exceptions
✅ Expired tokens are rejected
✅ Signature verification works correctly

**Dependencies**: Task 1.4 (Environment variables set)

**Risk**: High - Security-critical functionality

---

### 3.3 Implement Security Dependency (35 min) ⚠️

**Description**: Create the get_current_user dependency that FastAPI will use to validate JWT tokens on protected endpoints. This function ensures the user_id in the token matches the user_id in the URL path.

**Files**:
- `auth.py` (modify)

**Commands**: None (code implementation)

**Code Implementation**:
- Create get_current_user function with proper annotations
- Extract token from Authorization header
- Call decode_token function
- Extract user_id from token claims
- Compare with user_id from path parameters
- Raise HTTPException(401) for invalid tokens
- Raise HTTPException(403) for user_id mismatches

**Validation**:
✅ Function returns user_id for valid tokens
✅ Function raises 401 for invalid tokens
✅ Function raises 403 for user_id mismatches
✅ Function integrates properly with FastAPI

**Dependencies**: Task 3.2 (JWT validation logic implemented)

**Risk**: High - Security-critical functionality

---

### 3.4 Test Authentication Flow (40 min)

**Description**: Create comprehensive tests for the authentication flow to ensure tokens are properly validated and user isolation is maintained.

**Files**:
- `tests/test_auth.py` (create)

**Commands**:
```bash
cd backend
touch tests/test_auth.py
```

**Code Implementation**:
- Create test for valid token authentication
- Create test for invalid token rejection
- Create test for expired token rejection
- Create test for user_id mismatch detection
- Create test for malformed token handling

**Validation**:
✅ All authentication tests pass
✅ Invalid tokens properly rejected
✅ User isolation properly enforced
✅ Error responses match specification

**Dependencies**: All previous tasks in Phase 3

**Risk**: High - Security verification

---

## Phase 4: Data Schemas & Validation
**Goal**: Define Pydantic models for request/response validation and data transfer.
**Time**: 1.5 hours
**Tasks**:

### 4.1 Create TaskCreate Schema (20 min)

**Description**: Define the Pydantic schema for creating new tasks with proper validation rules for required fields and character limits as specified in the requirements.

**Files**:
- `schemas.py` (modify)

**Commands**: None (code implementation)

**Code Implementation**:
- Import SQLModel and Field
- Create TaskCreate class inheriting from SQLModel
- Define title field with min_length=1, max_length=200
- Define description field as optional with max_length=1000
- Ensure proper validation annotations

**Validation**:
✅ Schema validates correctly with valid data
✅ Schema rejects data that violates constraints
✅ Title validation works (1-200 chars)
✅ Description validation works (0-1000 chars)

**Dependencies**: Task 1.2 (Dependencies installed)

**Risk**: Medium - Validation affects API behavior

---

### 4.2 Create TaskUpdate Schema (20 min)

**Description**: Define the Pydantic schema for updating existing tasks. All fields should be optional to allow partial updates as specified in the requirements.

**Files**:
- `schemas.py` (modify)

**Commands**: None (code implementation)

**Code Implementation**:
- Create TaskUpdate class inheriting from SQLModel
- Define all fields as optional
- Apply same validation constraints as TaskCreate
- Allow partial updates for any combination of fields

**Validation**:
✅ Schema accepts partial updates
✅ Validation constraints still applied when fields provided
✅ All fields are optional as required

**Dependencies**: Task 4.1 (TaskCreate schema exists)

**Risk**: Medium - Validation affects API behavior

---

### 4.3 Create Task Response Schemas (25 min)

**Description**: Define the Pydantic schemas for API responses including TaskResponse and TaskListResponse to ensure consistent data formatting.

**Files**:
- `schemas.py` (modify)

**Commands**: None (code implementation)

**Code Implementation**:
- Create TaskResponse class with all Task fields plus id
- Create TaskListResponse class with tasks array and count
- Ensure response schemas match API specification
- Include proper type annotations

**Validation**:
✅ TaskResponse includes all required fields
✅ TaskListResponse has correct structure
✅ Response schemas match API specification
✅ Type annotations are correct

**Dependencies**: Task 4.1 (TaskCreate schema exists)

**Risk**: Medium - Response format affects API consumers

---

### 4.4 Implement Validation Rules (15 min)

**Description**: Add any additional validation rules or custom validators to ensure data integrity and compliance with business requirements.

**Files**:
- `schemas.py` (modify)

**Commands**: None (code implementation)

**Code Implementation**:
- Add custom validators if needed
- Ensure all validation rules from spec are implemented
- Add proper error messages for validation failures

**Validation**:
✅ All validation rules from specification implemented
✅ Custom validators work as expected
✅ Error messages are clear and helpful

**Dependencies**: All previous tasks in Phase 4

**Risk**: Medium - Validation affects API behavior

---

## Phase 5: Health Check & CORS
**Goal**: Implement health check endpoint and configure CORS middleware for frontend integration.
**Time**: 1 hour
**Tasks**:

### 5.1 Create main.py with FastAPI app (15 min)

**Description**: Initialize the main FastAPI application and set up basic configuration including CORS middleware.

**Files**:
- `main.py` (create)

**Commands**:
```bash
touch main.py
```

**Code Implementation**:
- Import FastAPI, CORS middleware
- Create app instance
- Configure CORS with allowed origins from config
- Include task routes

**Validation**:
✅ Create file successfully
✅ Import statements work
✅ App instance created

**Dependencies**: Task 3.3 (config.py exists)

**Risk**: Low - Basic setup task

---

### 5.2 Implement GET /health endpoint (20 min)

**Description**: Create a health check endpoint that verifies API and database connectivity.

**Files**:
- `main.py` (modify)

**Endpoint**: `GET /health`

**Logic**:
1. Return status "healthy"
2. Check database connection
3. Return timestamp

**Commands**: None (code implementation)

**Validation**:
✅ Test with curl: `curl http://localhost:8000/health`
✅ Verify response format matches spec
✅ Test with database disconnected (should return 503)

**Dependencies**: Task 2.1 (database connection)

**Risk**: Low - Simple endpoint

---

### 5.3 Configure CORS middleware (15 min)

**Description**: Set up CORS middleware to allow frontend origins as specified in configuration.

**Files**:
- `main.py` (modify)
- `middleware/cors.py` (create)

**Commands**:
```bash
mkdir middleware
touch middleware/cors.py
```

**Configuration**:
- Allow origins from config.ALLOWED_ORIGINS
- Allow credentials
- Set allowed methods and headers

**Validation**:
✅ CORS headers present in responses
✅ Cross-origin requests work from allowed origins
✅ Block requests from non-allowed origins

**Dependencies**: Task 3.3 (config.py exists)

**Risk**: Low - Standard configuration

---

### 5.4 Test basic server startup (10 min)

**Description**: Verify the server starts correctly and endpoints are accessible.

**Files**:
- `main.py` (modify)

**Commands**:
```bash
uvicorn main:app --reload
```

**Validation**:
✅ Server starts without errors
✅ Health endpoint accessible at http://localhost:8000/health
✅ Documentation available at http://localhost:8000/docs

**Dependencies**: All previous tasks in Phase 5

**Risk**: Low - Verification task

---

## Phase 6: CRUD Endpoints Implementation
**Goal**: Develop all six task management endpoints with proper authentication and validation.
**Time**: 3 hours
**Tasks**:

### 6.1 Create routes/tasks.py file (10 min)

**Description**: Create the routes module for task endpoints with proper imports and router initialization.

**Files**:
- `routes/tasks.py` (create)

**Commands**:
```bash
mkdir routes
touch routes/tasks.py
```

**Imports needed**:
- FastAPI's APIRouter
- SQLModel and database session
- All schemas from schemas.py
- Authentication dependency from auth.py
- Database models from models.py

**Validation**:
✅ File created successfully
✅ All imports work without errors
✅ Router instance created

**Dependencies**: All previous phases

**Risk**: Low - File creation and setup

---

### 6.2 Implement List Tasks Endpoint (25 min) ⚠️

**Description**: Create GET /api/{user_id}/tasks endpoint that returns all tasks for the authenticated user. Support query parameters for filtering by status (all/pending/completed) and sorting (created/title).

**Files**:
- `routes/tasks.py` (modify)

**Endpoint**: `GET /api/{user_id}/tasks?status=pending&sort=created`

**Authentication**: Required (uses get_current_user dependency)

**Logic**:
1. Verify JWT and extract user_id
2. Compare with path user_id (403 if mismatch)
3. Query database: SELECT * FROM tasks WHERE user_id = ?
4. Apply filters (status) and sorting
5. Return TaskListResponse

**Commands**: None (code implementation)

**Validation**:
✅ Test with curl: `curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/user_123/tasks`
✅ Verify only user's tasks returned
✅ Test filters: ?status=pending
✅ Test with wrong user_id (should get 403)

**Dependencies**:
- Task 2.2 (Task model exists)
- Task 3.2 (Security dependency implemented)
- Task 4.4 (TaskListResponse schema exists)

**Risk**: High - User isolation logic must be correct

---

### 6.3 Implement Create Task Endpoint (20 min) ⚠️

**Description**: Create POST /api/{user_id}/tasks endpoint that creates a new task for the authenticated user.

**Files**:
- `routes/tasks.py` (modify)

**Endpoint**: `POST /api/{user_id}/tasks`

**Request Body**:
```json
{
  "title": "New Task",
  "description": "Task description"
}
```

**Authentication**: Required (uses get_current_user dependency)

**Logic**:
1. Verify JWT and extract user_id
2. Compare with path user_id (403 if mismatch)
3. Validate request body with TaskCreate schema
4. Create new Task object with user_id
5. Save to database
6. Return TaskResponse with 201 status

**Commands**: None (code implementation)

**Validation**:
✅ Test with curl: `curl -X POST -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d '{"title":"Test Task"}' http://localhost:8000/api/user_123/tasks`
✅ Verify task saved with correct user_id
✅ Test with wrong user_id (should get 403)
✅ Test validation (missing title should return 400)

**Dependencies**:
- Task 2.2 (Task model exists)
- Task 3.2 (Security dependency implemented)
- Task 4.2 (TaskCreate schema exists)
- Task 4.3 (TaskResponse schema exists)

**Risk**: High - User isolation and validation logic

---

### 6.4 Implement Get Single Task Endpoint (20 min) ⚠️

**Description**: Create GET /api/{user_id}/tasks/{task_id} endpoint that returns a specific task for the authenticated user.

**Files**:
- `routes/tasks.py` (modify)

**Endpoint**: `GET /api/{user_id}/tasks/{task_id}`

**Authentication**: Required (uses get_current_user dependency)

**Logic**:
1. Verify JWT and extract user_id
2. Compare with path user_id (403 if mismatch)
3. Query database for task by task_id
4. Verify task belongs to user (403 if not)
5. Return TaskResponse

**Commands**: None (code implementation)

**Validation**:
✅ Test with curl: `curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/user_123/tasks/1`
✅ Verify only user's tasks accessible
✅ Test with wrong user_id (should get 403)
✅ Test with non-existent task (should get 404)

**Dependencies**:
- Task 2.2 (Task model exists)
- Task 3.2 (Security dependency implemented)
- Task 4.3 (TaskResponse schema exists)

**Risk**: High - User isolation and access control

---

### 6.5 Implement Update Task Endpoint (25 min) ⚠️

**Description**: Create PUT /api/{user_id}/tasks/{task_id} endpoint that updates an existing task for the authenticated user.

**Files**:
- `routes/tasks.py` (modify)

**Endpoint**: `PUT /api/{user_id}/tasks/{task_id}`

**Request Body** (all fields optional):
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "completed": true
}
```

**Authentication**: Required (uses get_current_user dependency)

**Logic**:
1. Verify JWT and extract user_id
2. Compare with path user_id (403 if mismatch)
3. Query database for task by task_id
4. Verify task belongs to user (403 if not)
5. Validate request body with TaskUpdate schema
6. Update task fields
7. Update updated_at timestamp
8. Save to database
9. Return TaskResponse

**Commands**: None (code implementation)

**Validation**:
✅ Test with curl: `curl -X PUT -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d '{"title":"Updated Task"}' http://localhost:8000/api/user_123/tasks/1`
✅ Verify only user's tasks can be updated
✅ Test with wrong user_id (should get 403)
✅ Test with non-existent task (should get 404)
✅ Test validation (title too long should return 400)

**Dependencies**:
- Task 2.2 (Task model exists)
- Task 3.2 (Security dependency implemented)
- Task 4.3 (TaskUpdate schema exists)
- Task 4.3 (TaskResponse schema exists)

**Risk**: High - User isolation and validation logic

---

### 6.6 Implement Delete Task Endpoint (15 min) ⚠️

**Description**: Create DELETE /api/{user_id}/tasks/{task_id} endpoint that permanently deletes a task for the authenticated user.

**Files**:
- `routes/tasks.py` (modify)

**Endpoint**: `DELETE /api/{user_id}/tasks/{task_id}`

**Authentication**: Required (uses get_current_user dependency)

**Logic**:
1. Verify JWT and extract user_id
2. Compare with path user_id (403 if mismatch)
3. Query database for task by task_id
4. Verify task belongs to user (403 if not)
5. Delete task from database
6. Return 204 No Content

**Commands**: None (code implementation)

**Validation**:
✅ Test with curl: `curl -X DELETE -H "Authorization: Bearer TOKEN" http://localhost:8000/api/user_123/tasks/1`
✅ Verify only user's tasks can be deleted
✅ Test with wrong user_id (should get 403)
✅ Test with non-existent task (should get 404)
✅ Verify task actually deleted from DB

**Dependencies**:
- Task 2.2 (Task model exists)
- Task 3.2 (Security dependency implemented)

**Risk**: High - User isolation and data integrity

---

### 6.7 Implement Toggle Task Completion Endpoint (25 min) ⚠️

**Description**: Create PATCH /api/{user_id}/tasks/{task_id}/complete endpoint that toggles the completion status of a task for the authenticated user.

**Files**:
- `routes/tasks.py` (modify)

**Endpoint**: `PATCH /api/{user_id}/tasks/{task_id}/complete`

**Authentication**: Required (uses get_current_user dependency)

**Logic**:
1. Verify JWT and extract user_id
2. Compare with path user_id (403 if mismatch)
3. Query database for task by task_id
4. Verify task belongs to user (403 if not)
5. Toggle completed field
6. Update updated_at timestamp
7. Save to database
8. Return TaskResponse

**Commands**: None (code implementation)

**Validation**:
✅ Test with curl: `curl -X PATCH -H "Authorization: Bearer TOKEN" http://localhost:8000/api/user_123/tasks/1/complete`
✅ Verify completion status toggled
✅ Verify only user's tasks can be toggled
✅ Test with wrong user_id (should get 403)
✅ Test with non-existent task (should get 404)

**Dependencies**:
- Task 2.2 (Task model exists)
- Task 3.2 (Security dependency implemented)
- Task 4.3 (TaskResponse schema exists)

**Risk**: High - User isolation and state transition logic

---

## Phase 7: Error Handling & Logging
**Goal**: Implement standardized error responses and logging for debugging and monitoring.
**Time**: 1.5 hours
**Tasks**:

### 7.1 Standardize error response format (20 min)

**Description**: Create a consistent error response format across all endpoints as specified in the requirements.

**Files**:
- `schemas.py` (modify)
- `main.py` (modify)

**Error Format**:
```json
{
  "detail": "Human-readable error message",
  "code": "ERROR_CODE_CONSTANT"
}
```

**Commands**: None (code implementation)

**Validation**:
✅ All error responses follow the same format
✅ 400 errors return validation details
✅ 401/403 errors return appropriate messages
✅ 404 errors return appropriate messages

**Dependencies**: All previous tasks

**Risk**: Medium - Affects all endpoints

---

### 7.2 Add HTTPException handlers (25 min)

**Description**: Implement global exception handlers for common HTTP errors to ensure consistent responses.

**Files**:
- `main.py` (modify)

**Handlers needed**:
- 404 Not Found handler
- 422 Validation Error handler
- 500 Internal Server Error handler

**Commands**: None (code implementation)

**Validation**:
✅ Non-existent endpoints return proper error format
✅ Validation errors return proper format
✅ Server errors return proper format

**Dependencies**: Task 7.1 (error format defined)

**Risk**: Medium - Affects error handling globally

---

### 7.3 Configure logging (25 min)

**Description**: Set up logging configuration to track requests, errors, and authentication failures.

**Files**:
- `config.py` (modify)
- `main.py` (modify)
- Create `logging_config.py` (optional)

**Logging requirements**:
- Log all authentication failures (401, 403)
- Log all 500 errors with full stack trace
- Never log sensitive data (JWT tokens, passwords)
- Log format: [TIMESTAMP] [LEVEL] [USER_ID] [ENDPOINT] [MESSAGE]

**Commands**: None (code implementation)

**Validation**:
✅ Authentication failures logged appropriately
✅ 500 errors include stack traces
✅ No sensitive data in logs
✅ Log levels configurable via environment

**Dependencies**: Task 3.3 (config.py exists)

**Risk**: Medium - Security implications

---

### 7.4 Test error scenarios (20 min)

**Description**: Test all error conditions to ensure proper responses and logging.

**Files**:
- Various files (verification)

**Test scenarios**:
- Invalid JWT token
- User ID mismatch
- Non-existent task access
- Validation errors
- Server errors

**Commands**:
```bash
# Test invalid token
curl -H "Authorization: Bearer invalid_token" http://localhost:8000/api/user_123/tasks

# Test user ID mismatch
curl -H "Authorization: Bearer valid_token_for_user_a" http://localhost:8000/api/user_b/tasks

# Test validation error
curl -X POST -H "Authorization: Bearer valid_token" -H "Content-Type: application/json" -d '{"title":""}' http://localhost:8000/api/user_123/tasks
```

**Validation**:
✅ All error scenarios return appropriate responses
✅ Error responses follow standard format
✅ Errors are properly logged
✅ No sensitive information exposed

**Dependencies**: All previous tasks in Phase 7

**Risk**: Medium - Verification of error handling

---

## Phase 8: Testing & Documentation
**Goal**: Conduct comprehensive testing and create documentation for the API.
**Time**: 1.5 hours
**Tasks**:

### 8.1 Write unit tests (30 min)

**Description**: Create unit tests for all endpoints and business logic to ensure functionality and prevent regressions.

**Files**:
- `tests/test_tasks.py` (create)
- `tests/test_auth.py` (create)

**Commands**:
```bash
mkdir tests
touch tests/test_tasks.py
touch tests/test_auth.py
```

**Test Coverage**:
- All CRUD operations
- Authentication and authorization
- User isolation
- Error handling
- Validation

**Validation**:
✅ All endpoints tested
✅ Authentication tested
✅ User isolation tested
✅ Error conditions tested
✅ 80%+ code coverage achieved

**Dependencies**: All previous tasks

**Risk**: Medium - Ensures code quality

---

### 8.2 Perform manual testing (25 min)

**Description**: Manually test the API using tools like curl or Postman to verify end-to-end functionality.

**Files**:
- Various files (verification)

**Manual Tests**:
- Create a task
- List tasks
- Get single task
- Update task
- Toggle completion
- Delete task
- Test authentication
- Test user isolation

**Commands**:
```bash
# Example test sequence
export TOKEN="your_jwt_token_here"
export USER_ID="user_123"

# Create task
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"title":"Test Task","description":"Test Description"}' http://localhost:8000/api/$USER_ID/tasks

# List tasks
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/$USER_ID/tasks

# Get single task
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/$USER_ID/tasks/1

# Update task
curl -X PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"title":"Updated Task","completed":true}' http://localhost:8000/api/$USER_ID/tasks/1

# Toggle completion
curl -X PATCH -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/$USER_ID/tasks/1/complete

# Delete task
curl -X DELETE -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/$USER_ID/tasks/1
```

**Validation**:
✅ All CRUD operations work correctly
✅ Authentication enforced on all endpoints
✅ User isolation works (can't access other users' tasks)
✅ Error responses are appropriate
✅ All endpoints return correct status codes

**Dependencies**: All previous tasks

**Risk**: Medium - Verification of complete functionality

---

### 8.3 Create API documentation (25 min)

**Description**: Generate and customize API documentation using FastAPI's built-in documentation features.

**Files**:
- `main.py` (modify)
- `README.md` (create)

**Documentation elements**:
- API title and description
- Contact information
- Version
- Custom documentation for endpoints
- Example requests/responses

**Commands**:
```bash
touch README.md
```

**Validation**:
✅ Interactive documentation available at /docs
✅ Redoc available at /redoc
✅ All endpoints documented
✅ Example requests/responses shown
✅ Authentication requirements clear

**Dependencies**: All previous tasks

**Risk**: Low - Documentation improvement

---

### 8.4 Update README with setup instructions (20 min)

**Description**: Create comprehensive README with setup instructions, environment variables, and usage examples.

**Files**:
- `README.md` (modify)

**Content needed**:
- Project description
- Prerequisites
- Setup instructions
- Environment variables
- API usage examples
- Running tests
- Contributing guidelines

**Commands**: None (documentation)

**Validation**:
✅ Clear setup instructions
✅ All environment variables documented
✅ API usage examples provided
✅ Testing instructions included
✅ Another developer could set up project from README

**Dependencies**: All previous tasks

**Risk**: Low - Documentation task

---

---
