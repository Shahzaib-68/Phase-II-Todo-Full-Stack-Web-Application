# Backend AI Instructions

This file contains specific instructions for AI assistants working with the backend code.

## Project Overview

The backend is a FastAPI-based RESTful API for a multi-user task management system. It provides secure CRUD operations for tasks using JWT-based authentication to ensure users can only access their own data. Built with SQLModel ORM connecting to Neon PostgreSQL database.

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL (with SQLModel ORM)
- **Authentication**: JWT using python-jose
- **Package Manager**: uv (though pip is fallback)
- **ASGI Server**: Uvicorn

## Key Files and Their Purposes

- `main.py`: FastAPI app entry point, CORS configuration, health check, exception handlers
- `models.py`: SQLModel database models (Task model)
- `schemas.py`: Pydantic request/response models (TaskCreate, TaskUpdate, TaskResponse, etc.)
- `database.py`: Database connection and session management
- `auth.py`: JWT authentication logic and security dependency
- `config.py`: Environment configuration using pydantic-settings
- `routes/tasks.py`: All task-related endpoint implementations
- `tests/`: Unit and integration tests

## Important Implementation Details

1. **User Isolation**: All endpoints verify that the user_id in the JWT token matches the user_id in the URL path. Additionally, when retrieving or modifying tasks, the system verifies that the task belongs to the authenticated user.

2. **Authentication Flow**: 
   - All endpoints (except health check) require a valid JWT token
   - The `get_current_user` dependency extracts and validates the token
   - The user_id from the token is compared with the user_id in the path
   - If they don't match, a 403 Forbidden error is raised

3. **Error Handling**:
   - Global exception handlers for HTTPException, RequestValidationError, and general exceptions
   - Standardized error response format with `detail` and `code` fields
   - Comprehensive logging for authentication failures and server errors

4. **Database Operations**:
   - Uses SQLModel which combines SQLAlchemy ORM with Pydantic validation
   - Sessions are dependency-injected into endpoints
   - All database operations are wrapped in transactions

## Common Tasks

### Adding a New Endpoint
1. Add the endpoint function in `routes/tasks.py` (or create a new route file)
2. Use the `get_current_user` dependency for authentication
3. Validate input with schemas from `schemas.py`
4. Use the injected database session for DB operations
5. Return responses using schemas from `schemas.py`

### Adding a New Model
1. Add the model class in `models.py` extending SQLModel with `table=True`
2. Define fields with appropriate constraints and validations
3. Remember to run the startup event to create/update tables in the database

### Modifying Authentication
1. Update the logic in `auth.py`
2. Be very careful with security implications
3. Test thoroughly to ensure user isolation is maintained

## Security Considerations

- Never expose sensitive information in logs
- Always validate that users can only access their own data
- Ensure JWT tokens are properly validated
- Sanitize inputs to prevent injection attacks
- Use parameterized queries to prevent SQL injection