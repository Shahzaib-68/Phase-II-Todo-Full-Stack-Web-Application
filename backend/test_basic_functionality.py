"""
Basic functionality test for the task management API.
This script tests that the basic components are properly implemented.
"""
import os
import sys
from pathlib import Path

# Add the backend directory to the path so we can import modules
sys.path.insert(0, str(Path(__file__).parent))

def test_basic_imports():
    """Test that all required modules can be imported."""
    try:
        from main import app
        from models import Task
        from schemas import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
        from auth import get_current_user, verify_token
        from database import engine, get_session
        from config import settings
        print("✓ All modules imported successfully")
        return True
    except ImportError as e:
        print(f"✗ Import error: {e}")
        return False


def test_models():
    """Test that the Task model is properly defined."""
    try:
        from models import Task
        task = Task(
            user_id="test_user",
            title="Test Task",
            description="Test Description",
            completed=False
        )
        print("✓ Task model created successfully")
        return True
    except Exception as e:
        print(f"✗ Task model error: {e}")
        return False


def test_schemas():
    """Test that the schemas are properly defined."""
    try:
        from schemas import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
        
        # Test TaskCreate schema
        task_create = TaskCreate(title="Test", description="Description")
        print("✓ TaskCreate schema works")
        
        # Test TaskUpdate schema
        task_update = TaskUpdate(title="Updated", completed=True)
        print("✓ TaskUpdate schema works")
        
        return True
    except Exception as e:
        print(f"✗ Schema error: {e}")
        return False


def test_config():
    """Test that configuration is properly loaded."""
    try:
        from config import settings
        # Check that required settings exist
        assert hasattr(settings, 'database_url')
        assert hasattr(settings, 'better_auth_secret')
        assert hasattr(settings, 'allowed_origins')
        print("✓ Configuration loaded successfully")
        return True
    except Exception as e:
        print(f"✗ Configuration error: {e}")
        return False


def run_tests():
    """Run all basic functionality tests."""
    print("Running basic functionality tests...\n")
    
    tests = [
        test_basic_imports,
        test_models,
        test_schemas,
        test_config
    ]
    
    results = []
    for test in tests:
        results.append(test())
    
    print(f"\nCompleted {sum(results)}/{len(results)} tests successfully")
    
    if all(results):
        print("✓ All basic functionality tests passed!")
        return True
    else:
        print("✗ Some tests failed")
        return False


if __name__ == "__main__":
    run_tests()