"""
SQLModel database models for the task management API.
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
    user_id: str = Field(max_length=255, index=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: str = Field(default='medium', max_length=20)
    due_date: Optional[datetime] = Field(default=None)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class User(SQLModel, table=True):
    """
    Database model for users table.
    """
    __tablename__ = "users"

    id: str = Field(primary_key=True, max_length=255)
    email: str = Field(unique=True, max_length=255, index=True)
    password: str = Field(max_length=255)
    name: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Session(SQLModel, table=True):
    """
    Database model for sessions table.
    """
    __tablename__ = "sessions"

    id: str = Field(primary_key=True, max_length=255)
    user_id: str = Field(foreign_key="users.id", max_length=255)
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)