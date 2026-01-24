#!/usr/bin/env python3
"""
Script to verify if the required tables ('users', 'sessions', and 'tasks') 
are correctly created in the PostgreSQL database.
"""

import sys
from sqlalchemy import create_engine, inspect
from config import settings


def verify_tables():
    """Verify that required tables exist in the database."""
    print("Connecting to database...")
    engine = create_engine(settings.database_url)
    
    # Get table names from the database
    inspector = inspect(engine)
    table_names = inspector.get_table_names()
    
    print(f"Tables found in database: {table_names}")
    
    # Required tables
    required_tables = ['users', 'sessions', 'tasks']
    
    # Check if all required tables exist
    missing_tables = []
    for table in required_tables:
        if table not in table_names:
            missing_tables.append(table)
    
    if missing_tables:
        print(f"\n❌ Missing tables: {missing_tables}")
        print("These tables need to be created.")
        return False
    else:
        print(f"\n✅ All required tables exist: {required_tables}")
        
        # Check the structure of each table
        for table in required_tables:
            print(f"\n--- Structure of '{table}' table ---")
            columns = inspector.get_columns(table)
            for col in columns:
                print(f"  {col['name']} ({col['type']}) - nullable: {col['nullable']}")
                
        return True


def verify_foreign_keys():
    """Verify foreign key relationships."""
    print("\n--- Checking Foreign Key Relationships ---")
    engine = create_engine(settings.database_url)
    inspector = inspect(engine)
    
    # Check foreign keys for 'sessions' table
    sessions_fks = inspector.get_foreign_keys('sessions')
    print(f"Foreign keys in 'sessions' table: {sessions_fks}")
    
    # Check foreign keys for 'tasks' table
    tasks_fks = inspector.get_foreign_keys('tasks')
    print(f"Foreign keys in 'tasks' table: {tasks_fks}")
    
    # Verify that sessions table has a foreign key to users
    sessions_has_user_fk = any(
        fk for fk in sessions_fks 
        if fk['referred_table'] == 'users' and 'user_id' in fk['constrained_columns']
    )
    
    # Tasks table should also have a foreign key to users
    tasks_has_user_fk = any(
        fk for fk in tasks_fks
        if fk['referred_table'] == 'users' and 'user_id' in fk['constrained_columns']
    )
    
    if sessions_has_user_fk:
        print("✅ Sessions table has foreign key to users table")
    else:
        print("❌ Sessions table is missing foreign key to users table")
        
    if tasks_has_user_fk:
        print("✅ Tasks table has foreign key to users table")
    else:
        print("❌ Tasks table is missing foreign key to users table")


if __name__ == "__main__":
    print("Verifying database tables...")
    tables_ok = verify_tables()
    
    if tables_ok:
        verify_foreign_keys()
        print("\n🎉 Database verification completed!")
    else:
        print("\n❌ Database verification failed!")
        sys.exit(1)