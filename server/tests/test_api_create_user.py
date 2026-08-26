from api.main import app
from fastapi.testclient import TestClient


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
    data = response.json()

    assert response.status_code == 200
    assert data["username"] == "Yolanda"
    assert data["email"] == "yolanda@example.com"
    assert data["full_name"] == "Yolanda Thaire"
