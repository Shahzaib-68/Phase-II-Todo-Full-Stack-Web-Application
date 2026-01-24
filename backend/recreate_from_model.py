"""
Script to recreate the tasks table with the proper schema based on the current model
"""
from sqlalchemy import text
from database import engine
from models import Task
from sqlmodel import SQLModel
import sqlalchemy

def recreate_with_proper_schema():
    """Drop and recreate the tasks table with proper schema from the model."""
    print("Recreating tasks table with proper schema from model...")
    
    # First, drop the tasks table
    with engine.connect() as conn:
        conn.execute(text("DROP TABLE IF EXISTS tasks CASCADE;"))
        conn.commit()
        print("Tasks table dropped")
    
    # Now recreate the table based on the model definition
    # This should create the table with all the fields defined in the model
    SQLModel.metadata.create_all(engine)
    print("Tasks table recreated based on model definition")
    
    # Verify the columns
    from sqlalchemy import inspect
    inspector = inspect(engine)
    columns = inspector.get_columns('tasks')
    print(f"Columns in recreated tasks table: {[col['name'] for col in columns]}")
    
    for col in columns:
        print(f"  {col['name']}: {col['type']} (nullable: {col['nullable']})")

if __name__ == "__main__":
    recreate_with_proper_schema()