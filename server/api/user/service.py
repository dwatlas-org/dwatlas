import datetime

from pwdlib import PasswordHash
from sqlmodel import Session, select

from .models import User, UserCreate, UserUpdate

ph = PasswordHash.recommended()
_dummy_hash: str | None = None


def _get_dummy_hash() -> str:
    global _dummy_hash
    if _dummy_hash is None:
        _dummy_hash = ph.hash("dummypassword")
    return _dummy_hash


class UserNotFoundError(Exception):
    pass


def get_user(username: str, session: Session):
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    return user


def authenticate_user(*, username: str, password: str, session: Session) -> User | None:
    user = get_user(username, session)
    if not user:
        verify_password(password, _get_dummy_hash())
        user = None
    elif not verify_password(password, user.hashed_password):
        user = None
    else:
        user.last_login = datetime.datetime.now(datetime.UTC)
        session.add(user)
        session.commit()
    return user


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
    password_hash = ph.hash(password_plain)
    return password_hash


def verify_password(password_plain: str, password_hashed: str) -> bool:
    return ph.verify(password_plain, password_hashed)


def update_user(user_id: int, user: UserUpdate, session: Session):
    db_user = session.get(User, user_id)
    if db_user:
        user_data: dict = user.model_dump(exclude_unset=True)
        plaintext_password: str | None = user_data.pop("password", None)
        if plaintext_password:
            hashed_password = hash_password(user.password)
            user_data["hashed_password"] = hashed_password
        db_user.sqlmodel_update(user_data)
        session.add(db_user)
        session.commit()
