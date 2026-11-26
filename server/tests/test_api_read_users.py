from fastapi import status
from fastapi.testclient import TestClient


def test_api_read_users_unauthenticated(
    client: TestClient, user, second_user, third_user, basepath: str
):
    response = client.get(
        f"{basepath}/user/all/",
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_api_read_users_nosuperuser(
    client: TestClient, user, second_user, third_user, basepath: str, valid_token: str
):
    client.cookies = {"access_token": valid_token}
    response = client.get(
        f"{basepath}/user/all/",
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_api_read_users_superuser(
    client: TestClient,
    user,
    second_user,
    third_user,
    basepath: str,
    valid_token_superuser: str,
):
    client.cookies = {"access_token": valid_token_superuser}
    response = client.get(
        f"{basepath}/user/all/",
    )
    data = response.json()

    assert response.status_code == 200
    assert len(data) == 4  # don't forget the superuser
    assert user.username == data[0]["username"]
    assert second_user.username == data[1]["username"]
    assert third_user.username == data[2]["username"]
