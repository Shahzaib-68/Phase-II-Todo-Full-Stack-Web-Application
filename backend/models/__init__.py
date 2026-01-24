"""
Database models for the task management API.
"""
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class Task(SQLModel, table=True):
    """
    Database model for tasks table.
    """
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, max_length=255)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class User(SQLModel, table=True):
    """
    Database model for users table.
    """
    __tablename__ = "users"

    id: Optional[str] = Field(default=None, primary_key=True, max_length=255)
    email: str = Field(unique=True, index=True, max_length=255)
    password: str = Field(max_length=255)  # Hashed password
    name: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Session(SQLModel, table=True):
    """
    Database model for sessions table.
    """
    __tablename__ = "sessions"

    id: Optional[str] = Field(default=None, primary_key=True, max_length=255)
    user_id: str = Field(index=True, foreign_key="users.id", max_length=255)
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)