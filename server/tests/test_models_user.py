from pytest import raises
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session

from api.user.models import User


def test_models_user_unique_username(session: Session):
    """Note: username is not unique."""
    username: str = "kali"
    email: str = "kali.wilkinson@mail.com"
    full_name: str = "Kali Wilkinson"
    hashed_password: str = "veryhashed"

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


def test_models_user_unique_email(session: Session):
    username: str = "kali"
    email: str = "kali.wilkinson@mail.com"
    full_name: str = "Kali Wilkinson"
    hashed_password: str = "veryhashed"

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
