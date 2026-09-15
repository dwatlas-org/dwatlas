from api.user.service import hash_password


def test_hash_password(user_data: dict[str, str]):
    password = user_data["password"]
    assert hash_password(password)
