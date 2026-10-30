import pytest
from fastapi.testclient import TestClient

from api.user.models import User
from api.user.service import hash_password


@pytest.mark.parametrize("user__hashed_password", [hash_password("supersecure123!")])
def test_api_logout(client: TestClient, user: User, basepath: str):
    # Login
    client.post(
        f"{basepath}/auth/token",
        json={
            "email": user.email,
            "password": "supersecure123!",
        },
    )

    # assert cookie is present
    assert client.cookies.get("access_token")

    # Logout
    client.get(f"{basepath}/auth/logout")

    # assert cookie is not present
    assert not client.cookies.get("access_token")
