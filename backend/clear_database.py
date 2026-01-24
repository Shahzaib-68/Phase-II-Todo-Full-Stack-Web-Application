#!/usr/bin/env python3
"""
Script to clear the users, sessions, and tasks tables in the database.
Usage:
    python clear_database.py              # Clear all tables (drop & recreate)
    python clear_database.py all          # Same as above
    python clear_database.py expired_sessions  # Remove only expired sessions
    python clear_database.py inactive_users    # Remove users without active sessions
"""

import sys
from datetime import datetime, timezone
from sqlmodel import SQLModel, delete, select

# Import models first to ensure they're registered
from models import Task, User, Session as SessionModel
from database import engine, get_session


def clear_database_tables():
    """Drop and recreate all tables (complete reset)."""
    try:
        print("🗑️  Dropping all tables...")
        SQLModel.metadata.drop_all(engine)
        
        print("🔨 Creating fresh tables...")
        SQLModel.metadata.create_all(engine)
        
        print("✅ Database reset successfully!")
        print("   - Users table: CLEARED")
        print("   - Sessions table: CLEARED")
        print("   - Tasks table: CLEARED")
    except Exception as e:
        print(f"❌ Error clearing database: {str(e)}")
        sys.exit(1)


def clear_expired_sessions():
    """Remove only expired sessions."""
    try:
        print("🔍 Checking for expired sessions...")
        
        # Ensure tables exist
        SQLModel.metadata.create_all(engine)
        
        # Get session
        with next(get_session()) as session:
            # Delete expired sessions
            now = datetime.now(timezone.utc)
            stmt = delete(SessionModel).where(SessionModel.expires_at < now)
            result = session.exec(stmt)
            deleted_count = result.rowcount
            
            session.commit()
            
            if deleted_count > 0:
                print(f"✅ Cleared {deleted_count} expired session(s)")
            else:
                print("✅ No expired sessions found")
    except Exception as e:
        print(f"❌ Error clearing expired sessions: {str(e)}")
        sys.exit(1)


def clear_users_without_active_sessions():
    """Remove users that don't have active sessions."""
    try:
        print("🔍 Finding users without active sessions...")
        
        # Ensure tables exist
        SQLModel.metadata.create_all(engine)
        
        with next(get_session()) as session:
            now = datetime.now(timezone.utc)
            
            # Find users with active sessions
            active_session_user_ids = session.exec(
                select(SessionModel.user_id).where(SessionModel.expires_at > now)
            ).all()
            
            # Get all users
            all_users = session.exec(select(User)).all()
            
            # Delete users without active sessions
            deleted_count = 0
            for user in all_users:
                if user.id not in active_session_user_ids:
                    # Also delete their tasks
                    task_stmt = delete(Task).where(Task.user_id == user.id)
                    session.exec(task_stmt)
                    
                    # Delete user
                    session.delete(user)
                    deleted_count += 1
            
            session.commit()
            
            if deleted_count > 0:
                print(f"✅ Cleared {deleted_count} inactive user(s) and their tasks")
            else:
                print("✅ No inactive users found")
    except Exception as e:
        print(f"❌ Error clearing inactive users: {str(e)}")
        sys.exit(1)


def show_stats():
    """Show current database statistics."""
    try:
        with next(get_session()) as session:
            user_count = len(session.exec(select(User)).all())
            session_count = len(session.exec(select(SessionModel)).all())
            task_count = len(session.exec(select(Task)).all())
            
            now = datetime.now(timezone.utc)
            active_sessions = len(
                session.exec(
                    select(SessionModel).where(SessionModel.expires_at > now)
                ).all()
            )
            
            print("\n📊 Current Database Stats:")
            print(f"   Users: {user_count}")
            print(f"   Sessions: {session_count} (Active: {active_sessions})")
            print(f"   Tasks: {task_count}")
    except Exception as e:
        print(f"⚠️  Could not fetch stats: {str(e)}")


def main():
    """Main function to handle command line arguments."""
    print("=" * 50)
    print("🗄️  Database Cleanup Utility")
    print("=" * 50)
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "all":
            clear_database_tables()
        elif command == "expired_sessions":
            clear_expired_sessions()
        elif command == "inactive_users":
            clear_users_without_active_sessions()
        elif command == "stats":
            show_stats()
        else:
            print("\n❌ Invalid command!")
            print("\nUsage:")
            print("  python clear_database.py                    # Clear all tables")
            print("  python clear_database.py all                # Clear all tables")
            print("  python clear_database.py expired_sessions   # Remove expired sessions")
            print("  python clear_database.py inactive_users     # Remove inactive users")
            print("  python clear_database.py stats              # Show database stats")
            sys.exit(1)
    else:
        # Default: clear all
        response = input("\n⚠️  This will DELETE ALL DATA. Continue? (yes/no): ")
        if response.lower() in ['yes', 'y']:
            clear_database_tables()
        else:
            print("❌ Operation cancelled")
            sys.exit(0)
    
    # Show stats after operation
    show_stats()
    print("\n✅ Done!\n")


if __name__ == "__main__":
    main()