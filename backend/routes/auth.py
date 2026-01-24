"""
Auth endpoints for Aura Task API - Simple & Clean Version for better-auth/react client
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
import uuid
from datetime import datetime, timedelta
from jose import jwt
import bcrypt
from sqlmodel import Session, select
from database import get_session
from models import User, Session as SessionModel

auth_router = APIRouter(prefix="/auth")  # prefix add kiya taake /api/auth/... bane

SECRET_KEY = 'aiAskTBYxIn805GlWXadO4DS_US3WccRXKrGY4vrA0s'
ALGORITHM = "HS256"

# Helpers
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# Sign Up Endpoint
@auth_router.post("/sign-up/email")
async def sign_up_email(request: Request, db: Session = Depends(get_session)):
    try:
        body = await request.json()
        email = body.get("email")
        password = body.get("password")
        name = body.get("name") or (email.split("@")[0] if email else "User")

        if not email or not password:
            raise HTTPException(400, "Email aur password zaroori hain")

        # Check if user already exists
        existing = db.exec(select(User).where(User.email == email)).first()
        if existing:
            raise HTTPException(400, "Yeh email pehle se registered hai")

        # Create new user
        user = User(
            id=str(uuid.uuid4()),
            email=email,
            password=hash_password(password),
            name=name
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Create session
        session_token = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(days=7)

        db_session = SessionModel(id=session_token, user_id=user.id, expires_at=expires_at)
        db.add(db_session)
        db.commit()

        # JWT token
        token = jwt.encode({"sub": user.id, "exp": int(expires_at.timestamp())}, SECRET_KEY, algorithm=ALGORITHM)

        # Better-auth compatible response
        response_data = {
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "emailVerified": None,
                "image": None,
                "createdAt": datetime.utcnow().isoformat(),
                "updatedAt": datetime.utcnow().isoformat()
            },
            "session": {
                "id": session_token,
                "expiresAt": expires_at.isoformat(),
                "createdAt": datetime.utcnow().isoformat(),
                "updatedAt": datetime.utcnow().isoformat(),
                "ipAddress": None,
                "userAgent": None
            },
            "token": token
        }

        response = JSONResponse(content=response_data)

        # Set cookies
        response.set_cookie(
            key="better-auth.session_token",
            value=session_token,
            httponly=True,
            max_age=7 * 24 * 60 * 60,
            secure=False,  # localhost ke liye False
            samesite="lax",
            path="/"
        )
        response.set_cookie(
            key="auth-token",
            value=token,
            httponly=False,
            max_age=7 * 24 * 60 * 60,
            secure=False,
            samesite="lax",
            path="/"
        )

        return response

    except Exception as e:
        raise HTTPException(400, f"Signup fail: {str(e)}")

# Sign In Endpoint
@auth_router.post("/sign-in/email")
async def sign_in_email(request: Request, db: Session = Depends(get_session)):
    try:
        body = await request.json()
        email = body.get("email")
        password = body.get("password")

        if not email or not password:
            raise HTTPException(400, "Email aur password zaroori hain")

        user = db.exec(select(User).where(User.email == email)).first()
        if not user or not verify_password(password, user.password):
            raise HTTPException(400, "Galat email ya password")

        # Create new session
        session_token = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(days=7)

        db_session = SessionModel(id=session_token, user_id=user.id, expires_at=expires_at)
        db.add(db_session)
        db.commit()

        # JWT
        token = jwt.encode({"sub": user.id, "exp": int(expires_at.timestamp())}, SECRET_KEY, algorithm=ALGORITHM)

        # Response
        response_data = {
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "emailVerified": None,
                "image": None,
                "createdAt": datetime.utcnow().isoformat(),
                "updatedAt": datetime.utcnow().isoformat()
            },
            "session": {
                "id": session_token,
                "expiresAt": expires_at.isoformat(),
                "createdAt": datetime.utcnow().isoformat(),
                "updatedAt": datetime.utcnow().isoformat(),
                "ipAddress": None,
                "userAgent": None
            },
            "token": token
        }

        response = JSONResponse(content=response_data)

        # Cookies set
        response.set_cookie(
            key="better-auth.session_token",
            value=session_token,
            httponly=True,
            max_age=7 * 24 * 60 * 60,
            secure=False,
            samesite="lax",
            path="/"
        )
        response.set_cookie(
            key="auth-token",
            value=token,
            httponly=False,
            max_age=7 * 24 * 60 * 60,
            secure=False,
            samesite="lax",
            path="/"
        )

        return response

    except Exception as e:
        raise HTTPException(400, f"Login fail: {str(e)}")

# Get Session Endpoint
@auth_router.get("/get-session")
async def get_session(request: Request, db: Session = Depends(get_session)):
    session_token = request.cookies.get("better-auth.session_token")
    if not session_token:
        raise HTTPException(401, "No session found")

    db_session = db.exec(select(SessionModel).where(SessionModel.id == session_token)).first()
    if not db_session or db_session.expires_at < datetime.utcnow():
        raise HTTPException(401, "Session expired or invalid")

    user = db.get(User, db_session.user_id)
    if not user:
        raise HTTPException(401, "User not found")

    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "emailVerified": None,
            "image": None,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat()
        },
        "session": {
            "id": session_token,
            "expiresAt": db_session.expires_at.isoformat(),
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat()
        }
    }

router = auth_router