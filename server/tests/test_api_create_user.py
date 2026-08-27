import datetime

from fastapi.testclient import TestClient

from api.main import app


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

    assert response.status_code == 200
    assert data["username"] == "Yolanda"
    assert data["email"] == "yolanda@example.com"
    assert data["full_name"] == "Yolanda Thaire"
    datetime_format = "%Y-%m-%dT%H:%M:%S.%f"
    created = datetime.datetime.strptime(data["created"], datetime_format).replace(
        tzinfo=datetime.UTC
    )
    assert pre < created < post
