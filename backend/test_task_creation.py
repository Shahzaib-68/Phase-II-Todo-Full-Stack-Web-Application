#!/usr/bin/env python3
"""
Simple test script to check if the Task model works with the database.
"""

from datetime import datetime
from sqlmodel import Session
from database import engine
from models import Task

def test_task_creation():
    """Test creating a task directly in the database."""
    print("Testing task creation...")
    
    # Create a new task instance
    task = Task(
        user_id="test-user-id",
        title="Test Task",
        description="This is a test task",
        priority="medium",  # This is the new field
        due_date=None,      # This is the new field
        completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    print(f"Task created in memory: {task}")
    
    # Try to save to database
    with Session(engine) as session:
        session.add(task)
        try:
            session.commit()
            print("Task saved successfully!")
            session.refresh(task)
            print(f"Saved task ID: {task.id}")
        except Exception as e:
            print(f"Error saving task: {e}")
            session.rollback()
            return False
    
    return True

if __name__ == "__main__":
    test_task_creation()