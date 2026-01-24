"""
Script to manually add missing columns to the tasks table
"""
from sqlalchemy import text
from database import engine

def add_missing_columns():
    """Add missing columns to the tasks table."""
    print("Adding missing columns to tasks table...")
    
    with engine.connect() as conn:
        # Add priority column with default value
        try:
            conn.execute(text("ALTER TABLE tasks ADD COLUMN priority VARCHAR(20) DEFAULT 'medium';"))
            print("Added priority column")
        except Exception as e:
            print(f"Priority column may already exist: {e}")
        
        # Add due_date column
        try:
            conn.execute(text("ALTER TABLE tasks ADD COLUMN due_date TIMESTAMP;"))
            print("Added due_date column")
        except Exception as e:
            print(f"Due date column may already exist: {e}")
        
        # Commit the transaction
        conn.commit()
    
    print("Missing columns added successfully!")

if __name__ == "__main__":
    add_missing_columns()