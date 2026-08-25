from fastapi.testclient import TestClient

<<<<<<< HEAD

def test_api_create_user(client: TestClient):
    response = client.post(
        "/user/",
        json={
            "username": "Yolanda",
            "email": "yolanda@example.com",
            "full_name": "Yolanda Thaire",
            "password": "supersecret",
        },
    )
||||||| parent of af4223c (add conftest module for pytest fixtures)
=======
from api.main import app


def test_api_create_user(client: TestClient):
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
>>>>>>> af4223c (add conftest module for pytest fixtures)
    data = response.json()

    assert response.status_code == 200
    assert data["username"] == "Yolanda"
    assert data["email"] == "yolanda@example.com"
    assert data["full_name"] == "Yolanda Thaire"
