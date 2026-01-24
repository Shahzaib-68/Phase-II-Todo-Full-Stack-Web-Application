"""
Test script to isolate the field definition issue
"""
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel

# Define a simple test model with the problematic fields
class TestTask(SQLModel, table=True):
    __tablename__ = "test_tasks_field_issue"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    # Test the priority field
    priority: str = Field(default='medium', max_length=20)
    # Test the due_date field
    due_date: Optional[datetime] = Field(default=None)

def check_test_model():
    print("Checking TestTask model definition...")
    
    # Get the table columns from the model
    table = TestTask.__table__
    print(f"Table name: {table.name}")
    print(f"Columns in test model:")
    for column in table.columns:
        print(f"  {column.name}: {column.type} (nullable: {column.nullable})")

if __name__ == "__main__":
    check_test_model()