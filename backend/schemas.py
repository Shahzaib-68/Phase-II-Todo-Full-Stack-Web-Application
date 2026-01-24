"""
Pydantic models for request/response validation and data transfer.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator
from sqlmodel import SQLModel


# Request schemas
class TaskCreate(SQLModel):
    """
    Model for creating a new task.
    Used in POST /api/{user_id}/tasks
    """
    title: str = Field(..., min_length=1, max_length=200, description="Task title (1-200 characters)")
    description: Optional[str] = Field(default=None, max_length=1000, description="Task description (up to 1000 characters)")
    priority: Optional[str] = Field(default='medium', max_length=20, description="Task priority (low, medium, high)")
    due_date: Optional[datetime] = Field(default=None, description="Task due date")


class TaskUpdate(SQLModel):
    """
    Model for updating an existing task.
    Used in PUT /api/{user_id}/tasks/{id}
    All fields optional.
    """
    title: Optional[str] = Field(default=None, min_length=1, max_length=200, description="Task title (1-200 characters)")
    description: Optional[str] = Field(default=None, max_length=1000, description="Task description (up to 1000 characters)")
    priority: Optional[str] = Field(default=None, max_length=20, description="Task priority (low, medium, high)")
    due_date: Optional[datetime] = Field(default=None, description="Task due date")
    completed: Optional[bool] = None

    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        if v is not None and (len(v) < 1 or len(v) > 200):
            raise ValueError('Title must be between 1 and 200 characters')
        return v


# Response schemas
class TaskResponse(SQLModel):
    """
    Model for task responses.
    Used in all endpoints returning task data.
    """
    id: int
    user_id: str
    title: str
    description: Optional[str]
    priority: str
    due_date: Optional[datetime]
    completed: bool
    created_at: datetime
    updated_at: datetime


class TaskListResponse(SQLModel):
    """
    Model for list of tasks.
    Used in GET /api/{user_id}/tasks
    """
    tasks: List[TaskResponse]
    count: int


# Error response schema
class ErrorResponse(SQLModel):
    """
    Model for error responses.
    Used in all error responses.
    """
    detail: str
    code: str