#!/usr/bin/env python3
"""
Comprehensive test to replicate the exact authentication flow and identify the issue.
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000/api/auth"

def test_comprehensive_auth_flow():
    print("Starting comprehensive authentication flow test...")
    
    # Create a session to persist cookies
    session = requests.Session()
    
    # Step 1: Try to get session without any authentication (should fail)
    print("\n1. Trying to get session without authentication (should fail)...")
    response = session.get(f"{BASE_URL}/get-session")
    print(f"Get session without auth response: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Step 2: Sign up a new user
    print("\n2. Signing up a new user...")
    signup_data = {
        "email": "comprehensive_test@example.com",
        "password": "testpassword123",
        "name": "Comprehensive Test User"
    }
    
    response = session.post(f"{BASE_URL}/sign-up/email", json=signup_data)
    print(f"Signup response: {response.status_code}")
    if response.status_code != 200:
        print(f"Signup error: {response.text}")
        return
    
    # Print cookies after signup
    print(f"Cookies after signup: {dict(session.cookies)}")
    
    # Step 3: Try to get session immediately after signup
    print("\n3. Getting session after signup...")
    response = session.get(f"{BASE_URL}/get-session")
    print(f"Get session after signup response: {response.status_code}")
    if response.status_code != 200:
        print(f"Get session after signup error: {response.text}")
        return
    else:
        print(f"Get session after signup response: {response.text[:200]}...")
    
    # Step 4: Sign in with the user (this should create a new session)
    print("\n4. Signing in with the user...")
    signin_data = {
        "email": "comprehensive_test@example.com",
        "password": "testpassword123"
    }
    
    response = session.post(f"{BASE_URL}/sign-in/email", json=signin_data)
    print(f"Signin response: {response.status_code}")
    if response.status_code != 200:
        print(f"Signin error: {response.text}")
        return
    
    # Print cookies after sign-in
    print(f"Cookies after sign-in: {dict(session.cookies)}")
    
    # Step 5: Get session after sign-in
    print("\n5. Getting session after sign-in...")
    response = session.get(f"{BASE_URL}/get-session")
    print(f"Get session after sign-in response: {response.status_code}")
    if response.status_code != 200:
        print(f"Get session after sign-in error: {response.text}")
        return
    else:
        print(f"Get session after sign-in response: {response.text[:200]}...")
    
    # Step 6: Simulate a delay and then try again (to test if session expires)
    print("\n6. Waiting 2 seconds and then getting session again...")
    time.sleep(2)
    response = session.get(f"{BASE_URL}/get-session")
    print(f"Get session after delay response: {response.status_code}")
    if response.status_code != 200:
        print(f"Get session after delay error: {response.text}")
        return
    else:
        print(f"Get session after delay response: {response.text[:200]}...")
    
    # Step 7: Test with a direct request using the JWT token from the response
    print("\n7. Testing with JWT token directly in Authorization header...")
    # Get the JWT token from the last sign-in response (we need to make another sign-in request to get fresh data)
    signin_data = {
        "email": "comprehensive_test@example.com",
        "password": "testpassword123"
    }
    response = session.post(f"{BASE_URL}/sign-in/email", json=signin_data)
    if response.status_code == 200:
        response_data = response.json()
        jwt_token = response_data.get('token', '')
        
        # Make a new request without cookies but with the JWT token
        headers = {
            'Authorization': f'Bearer {jwt_token}',
            'Content-Type': 'application/json'
        }
        direct_response = requests.get(f"{BASE_URL}/get-session", headers=headers)
        print(f"Direct request with JWT token response: {direct_response.status_code}")
        print(f"Direct response: {direct_response.text}")
    
    print("\nComprehensive authentication flow test completed!")

if __name__ == "__main__":
    test_comprehensive_auth_flow()