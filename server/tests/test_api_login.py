import jwt
import pytest
from fastapi.testclient import TestClient

from api.config import settings
from api.user.models import User
from api.user.service import hash_password


@pytest.mark.parametrize("user__hashed_password", [hash_password("supersecure123!")])
def test_api_login(client: TestClient, user: User):
    # Login
    response = client.post(
        "/auth/token",
        data={
            "username": user.username,
            "password": "supersecure123!",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    data = response.json()
    token = data["access_token"]
    assert data["token_type"] == "bearer"

    payload = jwt.decode(
        token, settings.AUTH_SECRET_KEY, algorithms=[settings.AUTH_ALGORITHM]
    )
    assert payload.get("sub") == user.username


@pytest.mark.parametrize("user__hashed_password", [hash_password("supersecure123!")])
def test_api_login_wrong_username(client: TestClient, user: User):
    # Login
    response = client.post(
        "/auth/token",
        data={
            "username": "Other username",
            "password": "supersecure123!",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 401


def test_api_login_wrong_password(client: TestClient, user: User):
    # Login
    response = client.post(
        "/auth/token",
        data={
            "username": user.username,
            "password": "thisisnotthepassword!",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 401
