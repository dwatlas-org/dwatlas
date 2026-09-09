import datetime

from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session

from api.main import app
from api.user.models import User


def test_api_create_user(client: TestClient):
    pre = datetime.datetime.now(datetime.UTC)
    response = client.post(
        "/user/",
        json={
            "username": "Yolanda",
            "email": "yolanda@example.com",
            "full_name": "Yolanda Thaire",
            "password": "supersecret",
        },
    )
    app.dependency_overrides.clear()
    data = response.json()
    post = datetime.datetime.now(datetime.UTC)

    assert response.status_code == status.HTTP_200_OK
    assert data["username"] == "Yolanda"
    assert data["email"] == "yolanda@example.com"
    assert data["full_name"] == "Yolanda Thaire"
    datetime_format = "%Y-%m-%dT%H:%M:%S.%f"
    created = datetime.datetime.strptime(data["created"], datetime_format).replace(
        tzinfo=datetime.UTC
    )
    assert pre < created < post


def test_api_create_user_duplicate_email(
    session: Session, user: User, client: TestClient
):
    response = client.post(
        "/user/",
        json={"email": user.email, "password": "somepassword"},
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
