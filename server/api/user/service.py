from sqlmodel import Session

from .database import sqlite_engine
from .models import User


def get_users_all():
    with Session(sqlite_engine) as session:
        users = session.query(User).all()
    return users


def create_user(username: str, email: str | None, full_name: str | None, disabled: bool | None):
    with Session(sqlite_engine) as session:
        user = User(username=username, email=email, full_name=full_name, disabled=disabled)
        session.add(user)
        session.commit()
        session.refresh(user)
    return user


def delete_user(user_id: int):
    with Session(sqlite_engine) as session:
        user = session.query(User).get(user_id)
        session.delete(user)
        session.commit()


def get_user(user_id: int):
    with Session(sqlite_engine) as session:
        user = session.query(User).get(user_id)
    return user


def update_user(user_id: int, username: str | None, email: str | None, full_name: str | None, disabled: bool | None):
    with Session(sqlite_engine) as session:
        user = session.query(User).get(user_id)
        user.username = username
        user.email = email
        user.full_name = full_name
        user.disabled = disabled
        session.commit()
        session.refresh(user)
    return user
