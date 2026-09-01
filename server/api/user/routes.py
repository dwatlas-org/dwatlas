from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from .database import get_session
from .models import UserCreate, UserPublic, UserUpdate
from .service import (
    UserNotFoundError,
    create_user,
    delete_user,
    read_user,
    read_users,
    update_user,
)

router = APIRouter()


@router.get("/user/all")
def api_read_users(*, session: Annotated[Session, Depends(get_session)]):
    return read_users(session)


@router.post("/user/", response_model=UserPublic)
def api_create_user(*, session: Session = Depends(get_session), user: UserCreate):
    return create_user(user, session)


@router.delete("/user/{user_id}")
def api_delete_user(*, session: Session = Depends(get_session), user_id: int):
    try:
        delete_user(user_id, session)
    except UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found")
    return {"ok": True}


@router.get("/user/{user_id}", response_model=UserPublic)
def api_read_user(*, session: Session = Depends(get_session), user_id: int):
    user = read_user(user_id, session)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/user/update/{user_id}", response_model=UserPublic)
def api_update_user(
    *, session: Session = Depends(get_session), user_id: int, user: UserUpdate
):
    user = update_user(user_id, user, session)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
