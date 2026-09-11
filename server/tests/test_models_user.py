from pytest import raises
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session

from api.user.models import User
from api.user.service import hash_password


def test_models_user_unique_username(session: Session, user_data: dict[str, str]):
    """Note: username is not unique."""
    username: str = user_data["username"]
    email: str = user_data["email"]
    full_name: str = user_data["full_name"]
    hashed_password: str = hash_password(user_data["password"])

    user_1 = User(
        username=username,
        email=email,
        full_name=full_name,
        hashed_password=hashed_password,
    )
    user_2 = User(
        username=username,
        email="another@mail.com",
        full_name=full_name,
        hashed_password=hashed_password,
    )
    session.add(user_1)
    session.add(user_2)
    session.commit()


def test_models_user_unique_email(session: Session, user_data: dict[str, str]):
    username: str = user_data["username"]
    email: str = user_data["email"]
    full_name: str = user_data["full_name"]
    hashed_password: str = hash_password(user_data["password"])

    user_1 = User(
        username=username,
        email=email,
        full_name=full_name,
        hashed_password=hashed_password,
    )
    user_2 = User(
        username=username,
        email=email,
        full_name=full_name,
        hashed_password=hashed_password,
    )
    session.add(user_1)
    session.add(user_2)
    with raises(IntegrityError):
        session.commit()

    session.rollback()
    user_2.email = "therealkali@example.com"
    session.add(user_1)
    session.add(user_2)
    session.commit()
