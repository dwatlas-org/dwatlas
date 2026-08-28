import datetime

from fastapi.testclient import TestClient
from sqlmodel import Session

from api.user.models import User
from api.user.service import verify_password


def test_api_update_user(client: TestClient):
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
    data = response.json()
    assert data["id"]
    assert data["username"] == username
    assert data["email"] == email
    assert data["full_name"] == full_name
    datetime_format = "%Y-%m-%dT%H:%M:%S.%f"
    updated_old = datetime.datetime.strptime(data["updated"], datetime_format).replace(
        tzinfo=datetime.UTC
    )

    # Update User
    new_username = "Aurora"
    response = client.post("/user/update/1", json={"username": new_username})
    assert response.status_code == 200
    data = response.json()
    assert data["id"]
    assert data["username"] == new_username
    assert data["email"] == email
    assert data["full_name"] == full_name
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
    assert data["email"] == email
    assert data["full_name"] == full_name
    assert (
        datetime.datetime.strptime(data["updated"], datetime_format).replace(
            tzinfo=datetime.UTC
        )
        > updated_old
    )


def test_api_update_user_password_hash(client: TestClient, session: Session):
    not_a_hash = "notahash"
    user = User(username="malka", hashed_password=not_a_hash)
    session.add(user)
    session.commit()

    user = session.get(User, 1)
    assert user.hashed_password == not_a_hash

    # Update User
    new_password = "supersecure123!"
    response = client.post("/user/update/1", json={"password": new_password})
    assert response.status_code == 200

    user = session.get(User, 1)
    assert user.hashed_password != not_a_hash
    assert verify_password(new_password, user.hashed_password)
