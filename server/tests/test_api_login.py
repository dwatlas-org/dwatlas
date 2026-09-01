import jwt
from fastapi.testclient import TestClient

from api.config import settings


def test_api_login(client: TestClient):
    # Create a user
    username = "Yolanda"
    email = "yolanda@example.com"
    password = "supersecret"
    full_name = "Yolanda Thaire"

    response = client.post(
        "/user/",
        json={
            "username": username,
            "email": email,
            "full_name": full_name,
            "password": password,
        },
    )

    assert response.status_code == 200

    # Login
    response = client.post(
        "/auth/token",
        data={
            "username": username,
            "password": password,
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
    assert payload.get("sub") == username


def test_api_login_wrong_username(client: TestClient):
    # Create a user
    username = "Yolanda"
    email = "yolanda@example.com"
    password = "supersecret"
    full_name = "Yolanda Thaire"

    response = client.post(
        "/user/",
        json={
            "username": username,
            "email": email,
            "full_name": full_name,
            "password": password,
        },
    )

    assert response.status_code == 200

    # Login
    response = client.post(
        "/auth/token",
        data={
            "username": "Other username",
            "password": password,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 401


def test_api_login_wrong_password(client: TestClient):
    # Create a user
    username = "Yolanda"
    email = "yolanda@example.com"
    password = "supersecret"
    full_name = "Yolanda Thaire"

    response = client.post(
        "/user/",
        json={
            "username": username,
            "email": email,
            "full_name": full_name,
            "password": password,
        },
    )

    assert response.status_code == 200

    # Login
    response = client.post(
        "/auth/token",
        data={
            "username": username,
            "password": "thisisnotthepassword!",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 401
