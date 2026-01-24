"""
Test script to manually run the startup event to sync database tables
"""
from sqlmodel import SQLModel
from database import engine
from models import User, Session as SessionModel, Task

def sync_tables():
    print("Syncing database tables...")
    try:
        # This is what happens in the startup event
        SQLModel.metadata.create_all(engine)
        print("Database tables synced successfully!")
        
        # Let's inspect the metadata to see what tables/columns are defined
        from sqlalchemy import inspect
        inspector = inspect(engine)
        
        # Get all tables
        tables = inspector.get_table_names()
        print(f"Tables in database: {tables}")
        
        # Get columns for the tasks table
        if 'tasks' in tables:
            columns = inspector.get_columns('tasks')
            print(f"Columns in tasks table: {[col['name'] for col in columns]}")
            
            # Print detailed info about each column
            for col in columns:
                print(f"  {col['name']}: {col['type']} (nullable: {col['nullable']})")
    except Exception as e:
        print(f"Error syncing tables: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    sync_tables()