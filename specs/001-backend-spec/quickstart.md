# Quickstart Guide: Task Management API

## Prerequisites
- Python 3.11+
- uv package manager
- Neon PostgreSQL account
- Better Auth configured for frontend

## Setup Instructions

### 1. Clone and Navigate
```bash
# If you're setting up the backend separately
mkdir backend && cd backend
```

### 2. Install uv Package Manager
```bash
# Install uv globally (if not already installed)
pip install uv
```

### 3. Initialize the Project
```bash
# Create new project
uv init
# Or if starting from scratch in the backend directory
uv init .
```

### 4. Create Virtual Environment and Install Dependencies
```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies (using pyproject.toml)
uv pip install fastapi
uv pip install "sqlmodel>=0.0.14"
uv pip install "python-jose[cryptography]"
uv pip install uvicorn[standard]
uv pip install psycopg2-binary
uv pip install pydantic-settings
```

### 5. Set Up Environment Variables
Create a `.env` file in your project root:
```bash
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters-long-random-string
ENVIRONMENT=development
LOG_LEVEL=info
PORT=8000
```

### 6. Create Project Structure
```
backend/
├── main.py
├── models.py
├── schemas.py
├── database.py
├── auth.py
├── config.py
├── routes/
│   └── tasks.py
├── middleware/
│   └── cors.py
├── tests/
│   ├── test_tasks.py
│   └── test_auth.py
├── pyproject.toml
└── .env
```

### 7. Run the Application
```bash
# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Run the development server
uvicorn main:app --reload --port 8000
```

## API Usage Examples

### Authentication
All endpoints except `/health` require JWT authentication:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     http://localhost:8000/api/user_id/tasks
```

### Create a Task
```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title": "New Task", "description": "Task description"}' \
     http://localhost:8000/api/user_id/tasks
```

### Get All Tasks
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8000/api/user_id/tasks
```

### Update a Task
```bash
curl -X PUT \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title": "Updated Task", "completed": true}' \
     http://localhost:8000/api/user_id/tasks/1
```

### Delete a Task
```bash
curl -X DELETE \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8000/api/user_id/tasks/1
```

### Toggle Task Completion
```bash
curl -X PATCH \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8000/api/user_id/tasks/1/complete
```

## Testing the API
```bash
# Run unit tests
python -m pytest tests/

# Or with coverage
python -m pytest tests/ --cov=.
```