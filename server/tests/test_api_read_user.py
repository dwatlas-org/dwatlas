from fastapi import status
from fastapi.testclient import TestClient

from api.user.models import User


def test_api_read_user_unauthenticated(client: TestClient, user: User, basepath: str):
    # Read user
    response = client.get(f"{basepath}/user/1")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_api_read_user_nosuperuser(
    client: TestClient, user: User, basepath: str, valid_token: str
):
    # Read user
    client.cookies = {"access_token": valid_token}
    response = client.get(f"{basepath}/user/1")
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_api_read_user(
    client: TestClient, user: User, basepath: str, valid_token_superuser: str
):
    # Read user
    client.cookies = {"access_token": valid_token_superuser}
    response = client.get(f"{basepath}/user/1")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()

    assert data["id"]
    assert data["username"] == user.username
    assert data["email"] == user.email
    assert data["full_name"] == user.full_name
    assert "password" not in data
    assert "hashed_password" not in data


def test_api_read_user_notfound(
    client: TestClient, basepath: str, valid_token_superuser: str
):
    client.cookies = {"access_token": valid_token_superuser}
    response = client.get(f"{basepath}/user/999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
