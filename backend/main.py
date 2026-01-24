"""
FastAPI application entry point for Aura Task API.
"""
import logging
from datetime import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlmodel import SQLModel, Session
from database import engine
from config import settings
# from schemas import ErrorResponse  # agar use nahi ho raha to comment kar do
from models import User, Session as SessionModel, Task
from routes import tasks, auth  # auth.router hai yahan se

# Logging setup
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format='[%(asctime)s] [%(levelname)s] [%(funcName)s:%(lineno)d] %(message)s'
)
logger = logging.getLogger(__name__)

# Lifespan handler (deprecated on_event ki jagah)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: yeh code app start hone pe chalega
    logger.info("Database tables sync kar raha hoon...")
    SQLModel.metadata.create_all(engine)
    logger.info("Database tables sync ho gaye!")
    
    yield  # App chalti rahegi iske beech mein
    
    # Shutdown: yeh code app band hone pe chalega
    logger.info("Application shutdown ho raha hai...")

# FastAPI app with lifespan
app = FastAPI(
    title="Aura Task API",
    description="Secure task management API with authentication",
    version="1.0.0",
    lifespan=lifespan  # ← Yeh line add ki
)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["set-cookie", "Set-Cookie", "Authorization"],
    max_age=600,
)

# Exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"HTTP {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "code": getattr(exc, 'error_code', 'HTTP_ERROR')}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error: {exc}")
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "code": "VALIDATION_ERROR", "errors": exc.errors()}
    )

# Routes include
app.include_router(auth.router, prefix="/api")  # /api/auth/...
app.include_router(tasks.router, prefix="/api")  # /api/tasks/*

# Health check
@app.get("/health")
async def health_check():
    try:
        with Session(engine) as session:
            pass
        return {"status": "healthy", "database": "connected", "timestamp": datetime.utcnow().isoformat()}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "unhealthy", "database": "disconnected"}