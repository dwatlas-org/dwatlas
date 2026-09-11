from api.user.service import hash_password, verify_password


def test_verify_password(password: str):
    hashed_password = hash_password(password)
    assert verify_password(password, hashed_password)


def test_verify_password_false(password: str):
    hashed_password = hash_password(password)
    different_password = "notsecureatall"

    assert not verify_password(different_password, hashed_password)
