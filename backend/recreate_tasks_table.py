#!/usr/bin/env python3
"""
Script to properly recreate the tasks table with the correct schema.
"""

from sqlmodel import SQLModel
from sqlalchemy import text
from database import engine
from models import Task, User, Session as SessionModel

def recreate_tasks_table():
    """Drop and recreate the tasks table with the correct schema."""
    print("Recreating tasks table with correct schema...")
    
    # First, backup existing data (just print a warning)
    print("WARNING: This will drop and recreate the tasks table, losing all existing task data.")
    
    with engine.connect() as conn:
        # Drop the tasks table
        print("Dropping tasks table...")
        conn.execute(text("DROP TABLE IF EXISTS tasks CASCADE"))
        conn.commit()
        
        # Now recreate all tables based on the current model definitions
        print("Recreating all tables based on model definitions...")
        SQLModel.metadata.create_all(conn)
        
        # Verify the tasks table has the correct columns
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'tasks'
            ORDER BY ordinal_position
        """))
        
        columns = [row[0] for row in result.fetchall()]
        print(f"Columns in recreated tasks table: {columns}")
        
        conn.commit()
    
    print("Tasks table recreated successfully with correct schema!")

if __name__ == "__main__":
    recreate_tasks_table()