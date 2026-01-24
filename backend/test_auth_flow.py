#!/usr/bin/env python3
"""
Test script to simulate the authentication flow and debug the unauthorized error.
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/auth"

def test_auth_flow():
    print("Testing authentication flow...")
    
    # Create a session to persist cookies
    session = requests.Session()
    
    # Step 1: Sign up a new user
    print("\n1. Signing up a new user...")
    signup_data = {
        "email": "testuser@example.com",
        "password": "testpassword123",
        "name": "Test User"
    }
    
    response = session.post(f"{BASE_URL}/sign-up/email", json=signup_data)
    print(f"Signup response: {response.status_code}")
    if response.status_code != 200:
        print(f"Signup error: {response.text}")
        return
    
    # Print cookies after signup
    print(f"Cookies after signup: {session.cookies}")
    
    # Step 2: Sign in with the user
    print("\n2. Signing in with the user...")
    signin_data = {
        "email": "testuser@example.com",
        "password": "testpassword123"
    }
    
    response = session.post(f"{BASE_URL}/sign-in/email", json=signin_data)
    print(f"Signin response: {response.status_code}")
    if response.status_code != 200:
        print(f"Signin error: {response.text}")
        return
    
    # Print cookies after sign-in
    print(f"Cookies after sign-in: {session.cookies}")
    
    # Step 3: Get session information
    print("\n3. Getting session information...")
    response = session.get(f"{BASE_URL}/get-session")
    print(f"Get session response: {response.status_code}")
    print(f"Get session response body: {response.text}")
    
    if response.status_code != 200:
        print(f"Get session error: {response.text}")
        return
        
    print("\nAuthentication flow completed successfully!")

if __name__ == "__main__":
    test_auth_flow()