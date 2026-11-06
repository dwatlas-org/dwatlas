from fastapi.testclient import TestClient

from api.user.models import User


def test_api_reset_password(client: TestClient, user: User, basepath: str):
    response = client.post(
        f"{basepath}/user/reset_password",
        json={
            "email": user.email,
        },
    )
    assert response.status_code == 200
