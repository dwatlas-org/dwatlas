from pwdlib import PasswordHash
from sqlmodel import Session, select

from .models import User, UserCreate, UserUpdate


class UserNotFoundError(Exception):
    pass


def read_users(session: Session):
    statement = select(User)
    users = session.exec(statement).all()
    return users


def create_user(user: UserCreate, session: Session):
    extra_data = {"hashed_password": hash_password(user.password)}
    db_user = User.model_validate(user, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def delete_user(user_id: int, session: Session):
    user = session.get(User, user_id)
    if not user:
        raise UserNotFoundError
    session.delete(user)
    session.commit()


def read_user(user_id: int, session: Session):
    user = session.get(User, user_id)
    return user


def hash_password(password_plain: str) -> str:
    hasher = PasswordHash.recommended()
    password_hash = hasher.hash(password_plain)
    return password_hash


def verify_password(password_plain: str, password_hashed: str) -> bool:
    hasher = PasswordHash.recommended()
    return hasher.verify(password_plain, password_hashed)


def update_user(user_id: int, user: UserUpdate, session: Session):
    db_user = session.get(User, user_id)
    if db_user:
        user_data = user.model_dump(exclude_unset=True)
        db_user.sqlmodel_update(user_data)
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
    return db_user
