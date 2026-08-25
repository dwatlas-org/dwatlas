from fastapi.testclient import TestClient


def test_api_read_users(client: TestClient):
    # Create 3 users
    for i in range(3):
        response = client.post(
            "/user/",
            json={
                "username": f"randomuser{i}",
                "password": "supersecure",
            },
        )
        assert response.status_code == 200

    response = client.get(
        "/user/all/",
    )
    data = response.json()

    assert response.status_code == 200
    assert len(data) == 3
