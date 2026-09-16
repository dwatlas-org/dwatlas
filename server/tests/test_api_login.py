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
        json={
            "email": user.email,
            "password": "supersecure123!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    token = data["access_token"]
    assert data["token_type"] == "bearer"

    payload = jwt.decode(
        token, settings.AUTH_SECRET_KEY, algorithms=[settings.AUTH_ALGORITHM]
    )
    assert payload.get("sub") == user.email


@pytest.mark.parametrize("user__hashed_password", [hash_password("supersecure123!")])
def test_api_login_wrong_email(client: TestClient, user: User):
    # Login
    response = client.post(
        "/auth/token",
        json={
            "email": "test@example.com",
            "password": "supersecure123!",
        },
    )
    assert response.status_code == 401


def test_api_login_wrong_password(client: TestClient, user: User):
    # Login
    response = client.post(
        "/auth/token",
        json={
            "email": user.email,
            "password": "thisisnotthepassword!",
        },
    )
    assert response.status_code == 401
