"""
Test model to debug field recognition issue.
"""
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, SQLModel


class TestTask(SQLModel, table=True):
    __tablename__ = "test_tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(max_length=255)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: str = Field(default='medium', max_length=20)  # This field should be recognized
    due_date: Optional[datetime] = Field(default=None)  # This field should be recognized
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


if __name__ == "__main__":
    print("TestTask fields:", list(TestTask.model_fields.keys()))