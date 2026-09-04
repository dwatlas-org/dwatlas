from datetime import UTC, datetime, timedelta
from typing import Annotated, Any

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session

from api.config import settings
from api.user.database import get_session
from api.user.models import User
from api.user.service import get_user

from .models import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


class UnauthorizedError(HTTPException):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        status_code: int = status.HTTP_401_UNAUTHORIZED
        detail: str = "Could not validate credentials"
        headers: dict[str, str] = {"WWW-Authenticate": "Bearer"}
        super().__init__(status_code=status_code, detail=detail, headers=headers)


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Annotated[Session, Depends(get_session)],
):
    try:
        payload = jwt.decode(
            token, settings.AUTH_SECRET_KEY, algorithms=[settings.AUTH_ALGORITHM]
        )
        username = payload.get("sub")
        if username is None:
            raise UnauthorizedError
        token_data = TokenData(username=username)
    except jwt.InvalidTokenError:
        raise UnauthorizedError
    user = get_user(username=token_data.username, session=session)
    if user is None:
        raise UnauthorizedError
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    return current_user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.AUTH_SECRET_KEY, algorithm=settings.AUTH_ALGORITHM
    )
    return encoded_jwt
