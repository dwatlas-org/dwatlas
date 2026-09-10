from typing import Any

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from api.user.models import User

# TODO make session fixture autouse?


@pytest.mark.parametrize(
    "json, status_code,",
    (
        (
            {"email": "test@example.com", "password": "supersecurepassword"},
            status.HTTP_200_OK,
        ),
        ({"password": "supersecurepassword"}, status.HTTP_422_UNPROCESSABLE_CONTENT),
        ({"email": "test@example.com"}, status.HTTP_422_UNPROCESSABLE_CONTENT),
    ),
)
def test_api_signup(json: dict[str, Any], status_code: int, client: TestClient):
    response = client.post(
        "/user/signup",
        json=json,
    )
    assert response.status_code == status_code


def test_api_signup_duplicate_email(user: User, client: TestClient):
    response = client.post(
        "/user/signup",
        json={"email": user.email, "password": "somepassword"},
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
