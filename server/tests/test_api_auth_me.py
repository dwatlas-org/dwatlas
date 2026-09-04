from fastapi.testclient import TestClient
from sqlmodel import Session

from api.user.models import User
from api.user.service import hash_password


def test_api_auth_me(client: TestClient, session: Session):
    # Create user
    username = "Banana"
    password = "supersecurepassword123123!"
    user = User(username=username, hashed_password=hash_password(password))
    session.add(user)
    session.commit()
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
