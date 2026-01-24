#!/usr/bin/env python3
"""
Script to update the database schema to include new columns.
"""

from sqlmodel import SQLModel
from database import engine
from models import Task, User, Session as SessionModel

def update_schema():
    """Update the database schema to include new columns."""
    print("Updating database schema...")
    
    # Import all models to ensure they are registered with SQLModel
    # The models are already imported above
    
    # Create all tables based on the current model definitions
    SQLModel.metadata.create_all(engine)
    
    print("Database schema updated successfully!")

if __name__ == "__main__":
    update_schema()