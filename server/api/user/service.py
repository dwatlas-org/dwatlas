from sqlmodel import Session

from .database import sqlite_engine
from .models import User, UserCreate, UserPublic

# TODO 🚨 You probably want to use `session.exec()` instead of `session.query()`.


def get_users_all():
    with Session(sqlite_engine) as session:
        users = session.query(User).all()
    return users


def create_user(user: UserCreate, response_model=UserPublic):
    with Session(sqlite_engine) as session:
        extra_data = {"hashed_password": hash_password(user.password)}
        db_user = User.model_validate(user, update=extra_data)
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
    return db_user


def delete_user(user_id: int):
    with Session(sqlite_engine) as session:
        user = session.query(User).get(user_id)
        session.delete(user)
        session.commit()


def get_user(user_id: int, response_model=UserPublic):
    with Session(sqlite_engine) as session:
        user = session.query(User).get(user_id)
    return user


def hash_password(password: str):
    return "thisisnotahash"


def update_user(
    user_id: int,
    username: str | None,
    email: str | None,
    full_name: str | None,
    disabled: bool | None,
):
    with Session(sqlite_engine) as session:
        user = session.query(User).get(user_id)
        user.username = username
        user.email = email
        user.full_name = full_name
        user.disabled = disabled
        session.commit()
        session.refresh(user)
    return user
