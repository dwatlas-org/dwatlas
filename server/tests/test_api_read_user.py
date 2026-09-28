from fastapi.testclient import TestClient

from api.user.models import User


def test_api_read_user(client: TestClient, user: User, basepath: str):
    # Read user
    response = client.get(f"{basepath}/user/1")
    assert response.status_code == 200
    data = response.json()

    assert data["id"]
    assert data["username"] == user.username
    assert data["email"] == user.email
    assert data["full_name"] == user.full_name
    assert "password" not in data
    assert "hashed_password" not in data


def test_api_read_user_notfound(client: TestClient, basepath: str):
    response = client.get(f"{basepath}/user/999")
    assert response.status_code == 404
