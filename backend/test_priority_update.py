"""
Test script to verify that priority updates work correctly with proper authentication
"""
import requests
import os
from datetime import datetime, timedelta

# Get the auth token from environment variable or use a placeholder
auth_token = os.getenv("AUTH_TOKEN", "YOUR_VALID_AUTH_TOKEN_HERE")

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {auth_token}"
}

# Example update payload
update_data = {
    "title": "Updated Task Title",
    "description": "Updated description",
    "priority": "high",  # This was causing the original error
    "due_date": (datetime.now() + timedelta(days=7)).isoformat(),
    "completed": False
}

# Replace with a valid task ID and user ID from your database
task_id = 1  # Change this to a valid task ID
user_id = "your_user_id_here"  # Change this to your user ID

try:
    response = requests.put(
        f"http://localhost:8000/api/tasks/{task_id}",
        json=update_data,
        headers=headers
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("\n✅ SUCCESS: Priority update worked!")
    elif response.status_code == 401:
        print("\n⚠️  AUTH ERROR: Invalid or missing authentication token.")
        print("   Please set the AUTH_TOKEN environment variable with a valid token.")
    elif response.status_code == 404:
        print("\n⚠️  NOT FOUND: Task with the specified ID doesn't exist.")
        print("   Please use a valid task ID from your database.")
    else:
        print(f"\n❌ FAILED: Unexpected status code {response.status_code}")
        
except requests.exceptions.ConnectionError:
    print("❌ CONNECTION ERROR: Could not connect to the server.")
    print("   Make sure the backend server is running on localhost:8000")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")