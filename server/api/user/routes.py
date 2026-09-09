from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from .database import get_session
from .models import UserCreate, UserPublic, UserSignup, UserUpdate
from .service import (
    DuplicateUserEmailError,
    UserNotFoundError,
    create_user,
    delete_user,
    read_user,
    read_users,
    signup_user,
    update_user,
)

router = APIRouter()


@router.get("/user/all")
def api_read_users(*, session: Annotated[Session, Depends(get_session)]):
    return read_users(session)


@router.post("/user/", response_model=UserPublic)
def api_create_user(*, session: Session = Depends(get_session), user: UserCreate):
    try:
        user = create_user(user, session)
    except DuplicateUserEmailError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    return user


@router.delete("/user/{user_id}")
def api_delete_user(*, session: Session = Depends(get_session), user_id: int):
    try:
        delete_user(user_id, session)
    except UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return {"ok": True}


@router.get("/user/{user_id}", response_model=UserPublic)
def api_read_user(*, session: Session = Depends(get_session), user_id: int):
    user = read_user(user_id, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


@router.post("/user/signup", response_model=UserPublic)
def api_signup(*, session: Session = Depends(get_session), user: UserSignup):
    try:
        user = signup_user(user, session)
    except DuplicateUserEmailError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    return user


@router.post("/user/update/{user_id}", response_model=UserPublic)
def api_update_user(
    *, session: Session = Depends(get_session), user_id: int, user: UserUpdate
):
    user = update_user(user_id, user, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user
