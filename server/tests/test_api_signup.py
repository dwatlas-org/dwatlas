from typing import Any

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from api.user.models import User


@pytest.mark.parametrize(
    "json, status_code, keys",
    (
        (
            {"email": "test@example.com", "password": "supersecurepassword"},
            status.HTTP_201_CREATED,
            [
                "username",
                "email",
                "full_name",
                "disabled",
                "id",
                "created",
                "updated",
                "last_login",
            ],
        ),
        (
            {"password": "supersecurepassword"},
            status.HTTP_422_UNPROCESSABLE_CONTENT,
            [],
        ),
        ({"email": "test@example.com"}, status.HTTP_422_UNPROCESSABLE_CONTENT, []),
    ),
)
def test_api_signup(
    json: dict[str, Any], status_code: int, keys: list[str], client: TestClient
):
    response = client.post(
        "/user/signup",
        json=json,
    )
    assert response.status_code == status_code
    data = response.json()
    for key in keys:
        assert key in data


def test_api_signup_duplicate_email(user: User, client: TestClient):
    response = client.post(
        "/user/signup",
        json={"email": user.email, "password": "somepassword"},
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
