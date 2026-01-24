import requests
import json

BASE_URL = "http://localhost:8000"

def test_auth_flow():
    # Test signup
    signup_data = {
        "email": "test@example.com",
        "password": "securepassword123",
        "name": "Test User"
    }
    
    print("Testing signup...")
    signup_response = requests.post(f"{BASE_URL}/api/auth/sign-up/email", json=signup_data)
    print(f"Signup response: {signup_response.status_code}")
    print(f"Signup response body: {signup_response.text}")
    
    # Test sign in
    signin_data = {
        "email": "test@example.com",
        "password": "securepassword123"
    }
    
    print("\nTesting sign in...")
    signin_response = requests.post(f"{BASE_URL}/api/auth/sign-in/email", json=signin_data)
    print(f"Signin response: {signin_response.status_code}")
    print(f"Signin response body: {signin_response.text}")
    
    # Extract session cookie if available
    cookies = signin_response.cookies
    
    # Test get session
    print("\nTesting get session...")
    session_response = requests.get(f"{BASE_URL}/api/auth/get-session", cookies=cookies)
    print(f"Get session response: {session_response.status_code}")
    print(f"Get session response body: {session_response.text}")
    
    # Test creating a task (this would require the user ID from the session)
    if session_response.status_code == 200:
        session_data = session_response.json()
        user_id = session_data['user']['id']
        
        # Create a task
        task_data = {
            "title": "Test task",
            "description": "This is a test task"
        }
        
        print(f"\nTesting task creation for user {user_id}...")
        # Note: We need to get the JWT token from the response to use in the Authorization header
        headers = {
            "Authorization": f"Bearer {session_data['session']['token']}"
        }
        task_response = requests.post(f"{BASE_URL}/api/{user_id}/tasks", 
                                   json=task_data, 
                                   headers=headers)
        print(f"Task creation response: {task_response.status_code}")
        print(f"Task creation response body: {task_response.text}")

if __name__ == "__main__":
    test_auth_flow()