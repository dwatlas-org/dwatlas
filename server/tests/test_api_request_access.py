from fastapi import status
from fastapi.testclient import TestClient


def test_api_request_access(client: TestClient, user_data: dict[str, str]) -> None:
    response = client.post(
        "/user/request_access/",
        json={
            "full_name": user_data["full_name"],
            "email": user_data["email"],
            "organization": "Union / Association",
            "purpose": "Organizing with my coworkers.",
        },
    )
    assert response.status_code == status.HTTP_200_OK
