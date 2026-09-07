from fastapi import status
from fastapi.testclient import TestClient

from api.user.models import User


def test_api_delete_user(client: TestClient, user: User):
    # Make sure there's a user
    response = client.get("/user/all/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 1

    # Delete user
    response = client.delete("/user/1")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data == {"ok": True}

    # Make sure there's no user
    response = client.get("/user/all/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 0


def test_api_delete_user_notfound(client: TestClient):
    response = client.delete("/user/999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
