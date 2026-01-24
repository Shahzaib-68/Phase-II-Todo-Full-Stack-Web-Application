#!/usr/bin/env python3
"""
Debug script to test task creation process step by step.
"""

from datetime import datetime
from sqlmodel import Session
from database import engine
from models import Task
from schemas import TaskCreate

def debug_task_creation_process():
    """Debug the task creation process step by step."""
    print("=== Debugging Task Creation Process ===")
    
    # Step 1: Create TaskCreate object (simulating what comes from API)
    print("\nStep 1: Creating TaskCreate object")
    task_data = TaskCreate(
        title="Test Task",
        description="This is a test task to verify authentication flow",
        priority="medium",
        due_date=None
    )
    print(f"  TaskCreate object: {task_data}")
    print(f"  Priority: {task_data.priority}")
    print(f"  Due date: {task_data.due_date}")
    
    # Step 2: Create Task object (simulating what happens in the endpoint)
    print("\nStep 2: Creating Task object for database insertion")
    task = Task(
        user_id="test-user-id",
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        due_date=task_data.due_date,
        completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    print(f"  Task object: {task}")
    
    # Step 3: Attempt to save to database
    print("\nStep 3: Attempting to save to database")
    try:
        with Session(engine) as session:
            session.add(task)
            session.commit()
            print("  SUCCESS: Task saved to database!")
            session.refresh(task)
            print(f"  Saved task ID: {task.id}")
            print(f"  Saved task details: id={task.id}, title='{task.title}', priority='{task.priority}', due_date={task.due_date}")
    except Exception as e:
        print(f"  ERROR: Failed to save task - {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print("\n=== Debugging Complete ===")
    return True

if __name__ == "__main__":
    debug_task_creation_process()