from fastapi.testclient import TestClient


def test_api_delete_user(client: TestClient):
    # Create user
    response = client.post(
        "/user/",
        json={
            "username": "Yolanda",
            "email": "yolanda@example.com",
            "full_name": "Yolanda Thaire",
            "password": "supersecret",
        },
    )
    assert response.status_code == 200

    # Make sure there's a user
    response = client.get("/user/all/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1

    # Delete user
    response = client.delete("/user/1")
    assert response.status_code == 200
    data = response.json()
    assert data == {"ok": True}

    # Make sure there's no user
    response = client.get("/user/all/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 0
