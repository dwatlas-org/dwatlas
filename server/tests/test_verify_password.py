from api.user.service import hash_password, verify_password


def test_verify_password():
    password = "supersecure"

    hashed_password = hash_password(password)
    assert verify_password(password, hashed_password)
