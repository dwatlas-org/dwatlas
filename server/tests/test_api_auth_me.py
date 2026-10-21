import pytest
from fastapi.testclient import TestClient

from api.user.models import User
from api.user.service import hash_password
from tests.util import unpack_token


@pytest.mark.parametrize("user__hashed_password", [hash_password("supersecure")])
def test_api_auth_me(client: TestClient, user: User, basepath: str):
    # Login
    response = client.post(
        f"{basepath}/auth/token",
        json={
            "email": user.email,
            "password": "supersecure",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("set-cookie").startswith("access_token")
    token = unpack_token(response.headers)
    client.cookies = {"access_token": token}

    # Assert success on access
    response = client.get(
        f"{basepath}/auth/me",
    )

    assert response.status_code == 200


def test_api_auth_me_no_token(client: TestClient, basepath: str):
    # Assert failure on access
    response = client.get(
        f"{basepath}/auth/me",
    )
    assert response.status_code == 401


def test_api_auth_me_invalid_token(client: TestClient, basepath: str):
    # Assert failure on access
    token = "notarealtoken"
    client.cookies = {"access_token": token}
    response = client.get(
        f"{basepath}/auth/me",
    )

    assert response.status_code == 401
