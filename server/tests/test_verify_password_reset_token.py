import pytest

from api.user.models import User
from api.user.service import create_password_reset_token, verify_password_reset_token


def test_verify_password_reset_token(user: User):
    token = create_password_reset_token(user.email, user.hashed_password, 15)
    assert verify_password_reset_token(user, token)


@pytest.mark.freeze_time("2026-10-29 14:30:00")
def test_verify_password_reset_token_expired(user: User, freezer):
    token = create_password_reset_token(user.email, user.hashed_password, 15)
    assert verify_password_reset_token(user, token)
    freezer.move_to("2026-10-29 14:45:01")
    assert not verify_password_reset_token(user, token)


def test_verify_password_reset_token_invalid_token(user: User):
    token = "notavalidtoken"
    assert not verify_password_reset_token(user, token)
