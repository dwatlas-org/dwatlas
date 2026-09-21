import datetime
from email.message import EmailMessage

from fastapi import BackgroundTasks
from pwdlib import PasswordHash
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from api.config import settings

from .email import EmailService
from .models import RequestAccessData, User, UserCreate, UserSignup, UserUpdate

ph = PasswordHash.recommended()
_dummy_hash: str | None = None


email_service = EmailService()


def _get_dummy_hash() -> str:
    global _dummy_hash
    if _dummy_hash is None:
        _dummy_hash = ph.hash("dummypassword")
    return _dummy_hash


class UserNotFoundError(Exception):
    pass


class DuplicateUserEmailError(Exception):
    pass


class UserUpdateError(Exception):
    pass


def get_user_username(username: str, session: Session):
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    return user


def get_user_email(email: str, session: Session) -> User:
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    return user


def authenticate_user(*, email: str, password: str, session: Session) -> User | None:
    user = get_user_email(email, session)
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


def read_users(session: Session) -> list[User]:
    statement = select(User)
    users = session.exec(statement).all()
    return users


def create_user(user: UserCreate, session: Session) -> User:
    try:
        extra_data = {"hashed_password": hash_password(user.password)}
        db_user = User.model_validate(user, update=extra_data)
        session.add(db_user)
        session.commit()
    except IntegrityError:
        raise DuplicateUserEmailError
    session.refresh(db_user)
    return db_user


def delete_user(user_id: int, session: Session) -> None:
    user = session.get(User, user_id)
    if not user:
        raise UserNotFoundError
    session.delete(user)
    session.commit()


def read_user(user_id: int, session: Session) -> User:
    user = session.get(User, user_id)
    return user


def hash_password(password_plain: str) -> str:
    password_hash = ph.hash(password_plain)
    return password_hash


def verify_password(password_plain: str, password_hashed: str) -> bool:
    return ph.verify(password_plain, password_hashed)


def update_user(user_id: int, user: UserUpdate, session: Session) -> User:
    db_user = session.get(User, user_id)
    if db_user:
        user_data: dict = user.model_dump(exclude_unset=True)
        plaintext_password: str | None = user_data.pop("password", None)
        if plaintext_password:
            hashed_password = hash_password(user.password)
            user_data["hashed_password"] = hashed_password
        db_user.sqlmodel_update(user_data)
        try:
            session.add(db_user)
            session.commit()
        except IntegrityError:
            raise UserUpdateError
    session.refresh(db_user)
    return db_user


def signup_user(user: UserSignup, session: Session) -> User:
    db_user = create_user(user, session)
    return db_user


def send_access_request(
    form_data: RequestAccessData, background_tasks: BackgroundTasks
):
    message = EmailMessage()
    message["To"] = settings.REQUEST_ACCESS_TO
    message["From"] = settings.REQUEST_ACCESS_FROM
    message["Subject"] = f"Request for access by {form_data.full_name}"
    message.set_content(
        f"E-Mail: {form_data.email}\nType of organization / institution: {form_data.organization}\nPurpose of access: {form_data.purpose}"
    )
    background_tasks.add_task(email_service.send, [message])
    return {"message": "Request for access sent"}
