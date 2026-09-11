import datetime

from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session

from api.user.models import User
from api.user.service import verify_password


def test_api_update_user(client: TestClient, user: User, username: str):
    datetime_format = "%Y-%m-%dT%H:%M:%S.%f"
    updated_old = user.updated.replace(tzinfo=datetime.UTC)

    # Update User
    new_username = username
    response = client.post("/user/update/1", json={"username": new_username})
    assert response.status_code == 200
    data = response.json()
    assert data["id"]
    assert data["username"] == new_username
    assert data["email"] == user.email
    assert data["full_name"] == user.full_name
    assert (
        datetime.datetime.strptime(data["updated"], datetime_format).replace(
            tzinfo=datetime.UTC
        )
        > updated_old
    )

    # Check user
    response = client.get("/user/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"]
    assert data["username"] == new_username
    assert data["email"] == user.email
    assert data["full_name"] == user.full_name
    assert (
        datetime.datetime.strptime(data["updated"], datetime_format).replace(
            tzinfo=datetime.UTC
        )
        > updated_old
    )


def test_api_update_user_password_hash(
    client: TestClient, session: Session, user: User, password: str
):
    # Update User
    new_password = password
    response = client.post("/user/update/1", json={"password": new_password})
    assert response.status_code == 200

    user = session.get(User, 1)
    assert verify_password(new_password, user.hashed_password)


def test_api_update_user_duplicate_email(
    client: TestClient, user: User, second_user: User
):
    response = client.post("/user/update/1", json={"email": second_user.email})
    assert response.status_code == status.HTTP_400_BAD_REQUEST
