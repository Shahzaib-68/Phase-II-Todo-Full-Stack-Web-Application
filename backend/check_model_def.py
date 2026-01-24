"""
Test script to check the Task model definition
"""
from models import Task
from sqlmodel import inspect

def check_model():
    print("Checking Task model definition...")
    
    # Get the table columns from the model
    table = Task.__table__
    print(f"Table name: {table.name}")
    print(f"Columns in model:")
    for column in table.columns:
        print(f"  {column.name}: {column.type} (nullable: {column.nullable})")
        
    # Check model attributes
    print(f"\nModel attributes:")
    for attr_name in dir(Task):
        if not attr_name.startswith('_'):
            attr = getattr(Task, attr_name)
            print(f"  {attr_name}: {type(attr)}")

if __name__ == "__main__":
    check_model()