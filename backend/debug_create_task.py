"""
Debug script to test the create_task functionality step by step
"""
from datetime import datetime, timezone
from sqlmodel import Session
from models import Task
from database import engine
from schemas import TaskCreate, TaskResponse

def test_create_task_step_by_step():
    print("Testing create_task functionality step by step...")
    
    # Simulate the input data
    user_id = "test_user_id"
    task_data = TaskCreate(title="Test Task", description="This is a test")
    
    print(f"Input: user_id={user_id}, task_data={task_data}")
    
    # Create the task object
    task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority or 'medium',  # Use provided priority or default
        due_date=task_data.due_date,  # Can be None
        completed=False,  # Default to not completed
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
            
            # Create the response object
            task_response = TaskResponse(
                id=task.id,
                user_id=task.user_id,
                title=task.title,
                description=task.description,
                priority=task.priority,
                due_date=task.due_date,
                completed=task.completed,
                created_at=task.created_at,
                updated_at=task.updated_at
            )
            
            print(f"Task response created successfully: {task_response}")
            
    except Exception as e:
        print(f"Error during database operations: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_create_task_step_by_step()