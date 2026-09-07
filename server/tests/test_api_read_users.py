from fastapi.testclient import TestClient


def test_api_read_users(client: TestClient, user, second_user, third_user):
    # Create 3 users
    response = client.get(
        "/user/all/",
    )
    data = response.json()

    assert response.status_code == 200
    assert len(data) == 3
    assert user.username == data[0]["username"]
    assert second_user.username == data[1]["username"]
    assert third_user.username == data[2]["username"]
