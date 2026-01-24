# Task Management API Backend

A secure RESTful API for managing personal tasks with JWT-based authentication to ensure users can only access their own data. Built with FastAPI, SQLModel, and Neon PostgreSQL.

## Prerequisites

- Python 3.11+
- uv package manager (install with `pip install uv`)
- Access to a PostgreSQL database (Neon recommended)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies using uv:
   ```bash
   uv sync
   ```

3. Create a `.env` file based on `.env.example` and set your environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. Start the development server:
   ```bash
   uv run uvicorn main:app --reload
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: JWT signing secret (minimum 32 characters)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS
- `ENVIRONMENT`: Environment name (development/production)
- `LOG_LEVEL`: Logging level (debug/info/warning/error)
- `PORT`: Server port (default: 8000)
- `DB_POOL_SIZE`: Database connection pool size (default: 10)
- `DB_MAX_OVERFLOW`: Maximum database connections overflow (default: 20)

## API Usage Examples

Once the server is running (by default at http://localhost:8000), you can use the API:

### Health Check (No Auth Required)
```bash
curl http://localhost:8000/health
```

### List Tasks
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     "http://localhost:8000/api/user_123/tasks?status=all&sort=created"
```

### Create Task
```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"New Task","description":"Task description"}' \
     http://localhost:8000/api/user_123/tasks
```

### Get Single Task
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8000/api/user_123/tasks/1
```

### Update Task
```bash
curl -X PUT \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"Updated Task","completed":true}' \
     http://localhost:8000/api/user_123/tasks/1
```

### Toggle Task Completion
```bash
curl -X PATCH \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8000/api/user_123/tasks/1/complete
```

### Delete Task
```bash
curl -X DELETE \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8000/api/user_123/tasks/1
```

## Running Tests

To run the unit tests:
```bash
uv run pytest
```

## API Documentation

Interactive API documentation is available at:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run tests (`uv run pytest`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

[Specify your license here]