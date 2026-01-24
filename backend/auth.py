"""
JWT + Cookie authentication dependency
"""
import logging
from datetime import datetime
from fastapi import HTTPException, status, Depends, Request
from fastapi.security import HTTPBearer
from jose import JWTError, jwt
from sqlmodel import Session, select
from database import get_session
from models import User, Session as SessionModel

logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)  # Header optional

SECRET_KEY = 'aiAskTBYxIn805GlWXadO4DS_US3WccRXKrGY4vrA0s'
ALGORITHM = "HS256"

def is_jwt_format(token: str) -> bool:
    """Check if token looks like JWT (has 2 dots)"""
    return token.count('.') == 2

def verify_jwt_token(token: str) -> dict:
    if token.startswith("Bearer "):
        token = token[7:]
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as e:
        logger.warning(f"JWT decode fail: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid JWT token")

async def get_current_user(
    request: Request,
    session: Session = Depends(get_session),
    authorization = Depends(security),
) -> str:
    # 1. Authorization header se
    if authorization:
        token = authorization.credentials
        if is_jwt_format(token):
            payload = verify_jwt_token(token)
            user_id = payload.get("sub")
            if user_id:
                user = session.get(User, user_id)
                if user:
                    logger.info(f"Authenticated via Bearer JWT: {user_id}")
                    return user_id

    # 2. auth-token cookie (JWT) se
    jwt_cookie = request.cookies.get("auth-token")
    if jwt_cookie and is_jwt_format(jwt_cookie):
        payload = verify_jwt_token(jwt_cookie)
        user_id = payload.get("sub")
        if user_id:
            user = session.get(User, user_id)
            if user:
                logger.info(f"Authenticated via auth-token cookie (JWT): {user_id}")
                return user_id

    # 3. better-auth.session_token cookie (UUID se DB lookup) – yeh sabse important!
    session_token = request.cookies.get("better-auth.session_token")
    if session_token:
        db_session = session.exec(select(SessionModel).where(SessionModel.id == session_token)).first()
        if db_session and db_session.expires_at > datetime.utcnow():
            user = session.get(User, db_session.user_id)
            if user:
                logger.info(f"Authenticated via better-auth.session_token (UUID): {db_session.user_id}")
                return db_session.user_id
        else:
            logger.warning("Session token expired or invalid")

    logger.warning("Koi bhi valid auth nahi mila")
    raise HTTPException(status_code=401, detail="Not authenticated")