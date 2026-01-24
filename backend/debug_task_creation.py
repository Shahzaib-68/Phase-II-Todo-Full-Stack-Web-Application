"""
Simple test to isolate the create_task functionality
"""
from datetime import datetime, timezone
from sqlmodel import Session
from models import Task
from database import engine

def test_create_task():
    print("Testing task creation...")
    
    # Create a task directly using SQLModel
    task = Task(
        user_id="test_user_id",
        title="Test Task",
        description="This is a test task",
        priority='medium',
        due_date=None,
        completed=False,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    
    print(f"Task object created: {task}")
    
    # Try to save to database
    try:
        with Session(engine) as session:
            print("Session opened successfully")
            session.add(task)
            print("Task added to session")
            session.commit()
            print("Transaction committed")
            session.refresh(task)
            print(f"Task refreshed from DB: {task}")
            
            # Verify the task was saved
            retrieved_task = session.get(Task, task.id)
            print(f"Retrieved task from DB: {retrieved_task}")
            
    except Exception as e:
        print(f"Error during database operations: {e}")
        import traceback
        traceback.print_exc()
        
if __name__ == "__main__":
    test_create_task()