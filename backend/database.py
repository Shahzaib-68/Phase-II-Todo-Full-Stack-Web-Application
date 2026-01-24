"""
Database connection and session management for the task management API.
"""
from typing import Generator
from sqlmodel import create_engine, Session, SQLModel
from config import settings


# Create the database engine with connection pooling and SSL fix
engine = create_engine(
    settings.database_url,
    pool_size=settings.db_pool_size,
    max_overflow=settings.db_max_overflow,
    pool_pre_ping=True,          # ✅ CRITICAL: Tests connection before use (fixes SSL errors)
    pool_recycle=3600,           # ✅ Recycle connections after 1 hour (prevents stale connections)
    echo=(settings.environment == "development"),  # Show SQL in development
    connect_args={
        "connect_timeout": 10,   # 10 second connection timeout
    }
)


def create_db_and_tables():
    """
    Create all database tables.
    Call this on application startup.
    """
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Get a database session with proper error handling.

    Yields:
        Database session for use in requests
    
    Example:
        @app.get("/items")
        def get_items(session: Session = Depends(get_session)):
            items = session.exec(select(Item)).all()
            return items
    """
    with Session(engine) as session:
        try:
            yield session
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()