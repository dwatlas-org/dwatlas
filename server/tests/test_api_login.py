import jwt
import pytest
from fastapi.testclient import TestClient

from api.config import settings
from api.user.models import User
from api.user.service import hash_password
from tests.util import unpack_token


@pytest.mark.parametrize("user__hashed_password", [hash_password("supersecure123!")])
def test_api_login(client: TestClient, user: User, basepath: str):
    # Login
    response = client.post(
        f"{basepath}/auth/token",
        json={
            "email": user.email,
            "password": "supersecure123!",
        },
    )
    assert response.status_code == 200

    token = unpack_token(response.headers)

    payload = jwt.decode(
        token, settings.AUTH_SECRET_KEY, algorithms=[settings.AUTH_ALGORITHM]
    )
    assert payload.get("sub") == user.email


@pytest.mark.parametrize("user__hashed_password", [hash_password("supersecure123!")])
def test_api_login_wrong_email(client: TestClient, user: User, basepath: str):
    # Login
    response = client.post(
        f"{basepath}/auth/token",
        json={
            "email": "test@example.com",
            "password": "supersecure123!",
        },
    )
    assert response.status_code == 401


def test_api_login_wrong_password(client: TestClient, user: User, basepath: str):
    # Login
    response = client.post(
        f"{basepath}/auth/token",
        json={
            "email": user.email,
            "password": "thisisnotthepassword!",
        },
    )
    assert response.status_code == 401
