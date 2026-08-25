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


<<<<<<< HEAD
@router.post("/user/delete")
def api_delete_user(user_id: int):
    return delete_user(user_id)
||||||| parent of dc59e2d (fix missing session arg in calls to service functinos)
@router.delete("/user/{user_id}")
def api_delete_user(*, session: Session = Depends(get_session), user_id: int):
    try:
        delete_user(user_id)
    except UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found")
    return {"ok": True}
=======
@router.delete("/user/{user_id}")
def api_delete_user(*, session: Session = Depends(get_session), user_id: int):
    try:
        delete_user(user_id, session)
    except UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found")
    return {"ok": True}
>>>>>>> dc59e2d (fix missing session arg in calls to service functinos)


<<<<<<< HEAD
@router.get("/user/{user_id}")
def api_get_user(user_id: int):
    return get_user(user_id)
||||||| parent of dc59e2d (fix missing session arg in calls to service functinos)
@router.get("/user/{user_id}", response_model=UserPublic)
def api_read_user(*, session: Session = Depends(get_session), user_id: int):
    user = read_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
=======
@router.get("/user/{user_id}", response_model=UserPublic)
def api_read_user(*, session: Session = Depends(get_session), user_id: int):
    user = read_user(user_id, session)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
>>>>>>> dc59e2d (fix missing session arg in calls to service functinos)


<<<<<<< HEAD
@router.post("/user/update/{user_id}")
def api_update_user(user_id: int, username: str | None, email: str | None, full_name: str | None, disabled: bool | None):
    return update_user(user_id, username, email, full_name, disabled)
||||||| parent of dc59e2d (fix missing session arg in calls to service functinos)
@router.post("/user/update/{user_id}", response_model=UserPublic)
def api_update_user(
    *, session: Session = Depends(get_session), user_id: int, user: UserUpdate
):
    user = update_user(user_id, user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
=======
@router.post("/user/update/{user_id}", response_model=UserPublic)
def api_update_user(
    *, session: Session = Depends(get_session), user_id: int, user: UserUpdate
):
    user = update_user(user_id, user, session)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
>>>>>>> dc59e2d (fix missing session arg in calls to service functinos)
