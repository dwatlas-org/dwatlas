import datetime

from fastapi import status
from fastapi.testclient import TestClient

from api.main import app
from api.user.models import User


def test_api_create_user(client: TestClient, user_data: dict[str, str]):
    pre = datetime.datetime.now(datetime.UTC)
    response = client.post(
        "/user/",
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


def test_api_create_user_duplicate_email(user: User, client: TestClient):
    response = client.post(
        "/user/",
        json={"email": user.email, "password": "somepassword"},
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
