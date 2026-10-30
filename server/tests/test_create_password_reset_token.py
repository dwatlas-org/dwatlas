import datetime

import jwt
import pytest

from api.config import settings
from api.user.models import User
from api.user.service import create_password_reset_token


@pytest.mark.freeze_time("2026-10-29 14:30:00")
def test_create_password_reset_token(user: User):
    expiry_minutes = 15
    now = datetime.datetime.now(datetime.UTC)
    token = create_password_reset_token(
        user.email, user.hashed_password, expiry_minutes
    )
    payload = jwt.decode(token, user.hashed_password, settings.AUTH_ALGORITHM)
    assert payload.get("sub") == user.email
    assert datetime.datetime.fromtimestamp(
        payload.get("exp"), datetime.UTC
    ) == now + datetime.timedelta(minutes=15)
