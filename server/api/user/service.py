from sqlmodel import Session

from .database import sqlite_engine
from .models import User


def get_users_all():
    with Session(sqlite_engine) as session:
        users = session.query(User).all()
    return users
