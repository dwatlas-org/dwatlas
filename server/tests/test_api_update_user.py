from fastapi.testclient import TestClient


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

    # Update User
    new_username = "Aurora"
    response = client.post("/user/update/1", json={"username": new_username})
    assert response.status_code == 200
    data = response.json()
    assert data["id"]
    assert data["username"] == new_username
    assert data["email"] == email
    assert data["full_name"] == full_name

    # Check user
    response = client.get("/user/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"]
    assert data["username"] == new_username
    assert data["email"] == email
    assert data["full_name"] == full_name
