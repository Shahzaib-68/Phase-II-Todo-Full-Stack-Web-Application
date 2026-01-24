"""
Better Auth setup for the task management API.
"""
from better_auth import auth, sqlstate
from better_auth.types import User
from config import settings
from database import engine


# Initialize Better Auth
auth = auth.BetterAuth(
    secret='aiAskTBYxIn805GlWXadO4DS_US3WccRXKrGY4vrA0s',  # Hardcoded for debugging
    # Use the database connection
    db_client=engine,  # This would need to be adapted for SQLModel
    advanced={
        'cookieOptions': {
            'domain': None,  # Allow default localhost behavior
            'sameSite': 'lax',
            'secure': False  # Set to False for localhost HTTP
        }
    },
    # Add other configuration as needed
)

# Define the user model if needed
# Better Auth typically handles user management internally