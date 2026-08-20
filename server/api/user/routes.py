from fastapi import APIRouter

from .models import UserCreate
from .service import get_users_all, create_user, delete_user, get_user, update_user

router = APIRouter()


@router.post("/user/login")
def login(username: str, password: str):
    pass


@router.get("/user/all")
def api_get_users_all():
    return get_users_all()


@router.post("/user/")
def api_create_user(user: UserCreate):
    return create_user(user)


@router.post("/user/delete")
def api_delete_user(user_id: int):
    return delete_user(user_id)


@router.get("/user/{user_id}")
def api_get_user(user_id: int):
    return get_user(user_id)


@router.post("/user/update/{user_id}")
def api_update_user(user_id: int, username: str | None, email: str | None, full_name: str | None, disabled: bool | None):
    return update_user(user_id, username, email, full_name, disabled)
