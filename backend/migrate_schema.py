#!/usr/bin/env python3
"""
Script to migrate the database schema to add new columns.
"""

from sqlalchemy import text
from database import engine


def migrate_schema():
    """Migrate the database schema to add new columns."""
    print("Migrating database schema...")
    
    with engine.connect() as conn:
        # Check if priority column exists, if not, add it
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'tasks' AND column_name = 'priority'
        """))
        
        if not result.fetchone():
            print("Adding priority column to tasks table...")
            conn.execute(text("ALTER TABLE tasks ADD COLUMN priority VARCHAR(20) DEFAULT 'medium'"))
            conn.commit()
            print("Priority column added successfully!")
        else:
            print("Priority column already exists.")
            
        # Check if due_date column exists, if not, add it
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'tasks' AND column_name = 'due_date'
        """))
        
        if not result.fetchone():
            print("Adding due_date column to tasks table...")
            conn.execute(text("ALTER TABLE tasks ADD COLUMN due_date TIMESTAMP"))
            conn.commit()
            print("Due date column added successfully!")
        else:
            print("Due date column already exists.")
    
    print("Database schema migration completed!")


if __name__ == "__main__":
    migrate_schema()