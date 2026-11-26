import datetime

from fastapi import status
from fastapi.testclient import TestClient

from api.main import app
from api.user.models import User


def test_api_create_user_unauthenticated(
    client: TestClient, user_data: dict[str, str], basepath: str
):
    response = client.post(
        f"{basepath}/user/",
        json=user_data,
    )
    app.dependency_overrides.clear()

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_api_create_user_nosuperuser(
    client: TestClient, user_data: dict[str, str], basepath: str, valid_token: str
):
    client.cookies = {"access_token": valid_token}
    response = client.post(
        f"{basepath}/user/",
        json=user_data,
    )
    app.dependency_overrides.clear()

    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_api_create_user(
    client: TestClient,
    user_data: dict[str, str],
    basepath: str,
    valid_token_superuser: str,
):
    pre = datetime.datetime.now(datetime.UTC)
    client.cookies = {"access_token": valid_token_superuser}
    response = client.post(
        f"{basepath}/user/",
        json=user_data,
    )
    app.dependency_overrides.clear()
    data = response.json()
    post = datetime.datetime.now(datetime.UTC)

    assert response.status_code == status.HTTP_201_CREATED
    assert data["username"] == user_data["username"]
    assert data["email"] == user_data["email"]
    assert data["full_name"] == user_data["full_name"]
    datetime_format = "%Y-%m-%dT%H:%M:%S.%f"
    created = datetime.datetime.strptime(data["created"], datetime_format).replace(
        tzinfo=datetime.UTC
    )
    assert pre < created < post


def test_api_create_user_duplicate_email(
    user: User,
    password: str,
    client: TestClient,
    basepath: str,
    valid_token_superuser: str,
):
    client.cookies = {"access_token": valid_token_superuser}
    response = client.post(
        f"{basepath}/user/",
        json={"email": user.email, "password": password},
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
