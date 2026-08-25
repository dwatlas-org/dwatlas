from fastapi import APIRouter

from .models import UserCreate
from .service import create_user, delete_user, update_user

router = APIRouter()


@router.post("/user/login")
def login(username: str, password: str):
    pass


@router.get("/user/all")
def api_read_users(*, session: Session = Depends(get_session)):
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
