import pytest
from fastapi.testclient import TestClient

from api.user.models import User
from api.user.service import hash_password


@pytest.mark.parametrize("user__hashed_password", [hash_password("supersecure")])
def test_api_auth_me(client: TestClient, user: User):
    # Login
    response = client.post(
        "/auth/token",
        json={
            "email": user.email,
            "password": "supersecure",
        },
    )
    assert response.status_code == 200
    data = response.json()
    token = data["access_token"]

    # Assert success on access
    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200


def test_api_auth_me_no_token(client: TestClient):
    # Assert failure on access
    response = client.get(
        "/auth/me",
    )
    assert response.status_code == 401


def test_api_auth_me_invalid_token(client: TestClient):
    # Assert failure on access
    token = "notarealtoken"
    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 401
