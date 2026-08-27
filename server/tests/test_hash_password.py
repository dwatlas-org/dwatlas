from api.user.service import hash_password


def test_hash_password():
    password = "supersecure"
    assert hash_password(password)
