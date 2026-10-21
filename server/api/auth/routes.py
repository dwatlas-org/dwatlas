from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session

from api.config import settings
from api.user.database import get_session
from api.user.models import User
from api.user.service import authenticate_user

from .models import LoginData
from .service import create_access_token, get_current_active_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/token")
async def api_login(
    response: Response,
    login_data: LoginData,
    session: Annotated[Session, Depends(get_session)],
):
    user = authenticate_user(
        email=login_data.email, password=login_data.password, session=session
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.AUTH_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    if login_data.remember:
        max_age = settings.AUTH_ACCESS_TOKEN_EXPIRE_MINUTES * 60  # convert to seconds
    else:
        max_age = None

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=max_age,
        path="/",
    )
    return {"message": "Login successful"}


@router.get("/me/")
async def api_auth_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> User:
    return current_user
