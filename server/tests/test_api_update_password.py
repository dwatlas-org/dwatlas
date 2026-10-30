import pytest
from fastapi.testclient import TestClient

from api.user.models import User
from api.user.service import create_password_reset_token, hash_password


def test_api_update_password(client: TestClient, user: User, basepath: str):
    new_password = "supersecure123!"
    expire_minutes = 15
    token = create_password_reset_token(
        user.email, user.hashed_password, expire_minutes
    )
    response = client.put(
        f"{basepath}/user/password",
        json={
            "email": user.email,
            "token": token,
            "password": new_password,
        },
    )
    assert response.status_code == 200

    response = client.post(
        f"{basepath}/auth/token",
        json={
            "email": user.email,
            "password": new_password,
            "remember": False,
        },
    )

    assert response.status_code == 200


def test_api_update_password_invalid_user(
    client: TestClient, user: User, basepath: str
):
    email = "doesnot@xi.st"
    password = "supersecure123"
    expire_minutes = 15
    token = create_password_reset_token(email, hash_password(password), expire_minutes)
    response = client.put(
        f"{basepath}/user/password",
        json={
            "email": email,
            "token": token,
            "password": password,
        },
    )
    assert response.status_code == 400


@pytest.mark.parametrize("user__hashed_password", [hash_password("p4ssw0rd")])
def test_api_update_password_invalid_token(
    client: TestClient, user: User, basepath: str
):
    other_password = "notsecure"
    new_password = "supersecure123"
    expire_minutes = 15
    token = create_password_reset_token(
        user.email, hash_password(other_password), expire_minutes
    )
    response = client.put(
        f"{basepath}/user/password",
        json={
            "email": user.email,
            "token": token,
            "password": new_password,
        },
    )
    assert response.status_code == 400

    response = client.post(
        f"{basepath}/auth/token",
        json={
            "email": user.email,
            "password": new_password,
            "remember": False,
        },
    )

    assert response.status_code == 401  # password wasn't changed

    response = client.post(
        f"{basepath}/auth/token",
        json={
            "email": user.email,
            "password": "p4ssw0rd",
            "remember": False,
        },
    )

    assert response.status_code == 200  # previous password is still accepted
