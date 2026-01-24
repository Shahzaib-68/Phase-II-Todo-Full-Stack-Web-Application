#!/usr/bin/env python3
"""
Script to inspect the SQLModel metadata for the Task model.
"""

from models import Task
from sqlmodel import SQLModel
from sqlalchemy import inspect

def inspect_model_metadata():
    """Inspect the SQLModel metadata for the Task model."""
    print("Inspecting Task model metadata...")
    
    # Print model fields
    print("\nModel fields:")
    for field_name in Task.model_fields:
        print(f"  {field_name}: {Task.model_fields[field_name]}")
    
    # Check SQLModel registry
    print(f"\nSQLModel registry: {SQLModel.registry._class_registry}")
    
    # Check table name
    print(f"\nTable name: {Task.__tablename__ if hasattr(Task, '__tablename__') else 'No table name'}")
    
    # Check if the model is properly registered with SQLModel
    print(f"\nModel bases: {Task.__bases__}")
    
    # Check the table representation
    print(f"\nModel representation: {repr(Task)}")

if __name__ == "__main__":
    inspect_model_metadata()