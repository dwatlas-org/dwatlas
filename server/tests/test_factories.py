import pytest
from sqlmodel import Session

from api.user.models import User


def test_user_factory(session: Session, user):
    assert user
    assert user.username
    assert user.hashed_password.startswith("$argon2id")
    assert user.email
    assert user.full_name
    assert not user.disabled
    assert user.created
    assert user.updated
    assert user.last_login is None

    user_db = session.get(User, 1)
    assert user_db
    assert user_db.username == user.username
    assert user_db.hashed_password == user.hashed_password
    assert user_db.email == user.email
    assert user_db.disabled == user.disabled
    assert user_db.created == user.created
    assert user_db.updated == user.updated
    assert user_db.last_login == user.last_login


@pytest.mark.parametrize("user__username", ["Dandara"])
@pytest.mark.parametrize("user__email", ["dandara@dwatlas.org"])
@pytest.mark.parametrize("user__disabled", [True])
def test_user_factory_parametrized(user: User):
    assert user.username == "Dandara"
    assert user.email == "dandara@dwatlas.org"
    assert user.disabled is True
