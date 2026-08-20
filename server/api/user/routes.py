from fastapi import APIRouter

router = APIRouter()


@router.post("/user/login")
def login(username: str, password: str):
    pass
