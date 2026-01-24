from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel

class SimpleTask(SQLModel, table=True):
    __tablename__ = "simple_tasks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(max_length=255)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: str = Field(default='medium', max_length=20)
    due_date: Optional[datetime] = Field(default=None)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

print("SimpleTask fields:", list(SimpleTask.model_fields.keys()))