"""
Test script to recreate the exact Task model
"""
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel

# Recreate the exact Task model
class Task(SQLModel, table=True):
    __tablename__ = "tasks_exact_test"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(max_length=255, index=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: str = Field(default='medium', max_length=20)
    due_date: Optional[datetime] = Field(default=None)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

def check_exact_model():
    print("Checking exact Task model definition...")
    
    # Get the table columns from the model
    table = Task.__table__
    print(f"Table name: {table.name}")
    print(f"Columns in exact model:")
    for column in table.columns:
        print(f"  {column.name}: {column.type} (nullable: {column.nullable})")

if __name__ == "__main__":
    check_exact_model()