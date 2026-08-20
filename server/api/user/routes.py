from fastapi import APIRouter

from .service import get_users_all

router = APIRouter()


@router.post("/user/login")
def login(username: str, password: str):
    pass


@router.get("/user/all")
def get_allusers():
    users = get_users_all()
    return users
