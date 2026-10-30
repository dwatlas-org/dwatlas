from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlmodel import Session

from .database import get_session
from .models import (
    PasswordResetData,
    PasswordUpdateData,
    RequestAccessData,
    UserCreate,
    UserPublic,
    UserSignup,
    UserUpdate,
)
from .service import (
    DuplicateUserEmailError,
    UserNotFoundError,
    UserUpdateError,
    create_user,
    delete_user,
    get_user_email,
    read_user,
    read_users,
    send_access_request,
    send_password_reset,
    signup_user,
    update_user,
    verify_password_reset_token,
)

router = APIRouter(prefix="/api/user", tags=["user"])


@router.get("/all")
def api_read_users(*, session: Annotated[Session, Depends(get_session)]):
    return read_users(session)


@router.post("/", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def api_create_user(*, session: Session = Depends(get_session), user: UserCreate):
    try:
        user = create_user(user, session)
    except DuplicateUserEmailError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    return user


@router.delete("/{user_id}")
def api_delete_user(*, session: Session = Depends(get_session), user_id: int):
    try:
        delete_user(user_id, session)
    except UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return {"ok": True}


@router.get("/{user_id}", response_model=UserPublic)
def api_read_user(*, session: Session = Depends(get_session), user_id: int):
    user = read_user(user_id, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


@router.post("/signup", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def api_signup(*, session: Session = Depends(get_session), user: UserSignup):
    try:
        user = signup_user(user, session)
    except DuplicateUserEmailError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    return user


@router.post("/update/{user_id}", response_model=UserPublic)
def api_update_user(
    *, session: Session = Depends(get_session), user_id: int, user: UserUpdate
):
    try:
        user = update_user(user_id, user, session)
    except UserUpdateError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


@router.post("/request_access")
def api_request_access(form_data: RequestAccessData, background_tasks: BackgroundTasks):
    return send_access_request(form_data, background_tasks)


@router.post("/reset_password")
def api_reset_password(
    background_tasks: BackgroundTasks,
    data: PasswordResetData,
    session: Session = Depends(get_session),
):
    user = get_user_email(data.email, session)
    if user:
        send_password_reset(background_tasks, user, session)

    return {"ok": True}


@router.put("/password")
def api_update_password(
    data: PasswordUpdateData, session: Session = Depends(get_session)
):
    user = get_user_email(data.email, session)
    if user and verify_password_reset_token(user, data.token):
        update_user(user.id, UserUpdate(password=data.password), session)
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    return {"ok": True}
