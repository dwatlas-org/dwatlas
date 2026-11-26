import pytest

from api.user.models import Role, User


@pytest.mark.parametrize("role__name", ["superuser"])
def test_models_role(role: Role):
    assert role.name == "superuser"


def test_factory_superuser(superuser: User):
    assert superuser.roles
    assert superuser.roles[0].name == "superuser"
    assert "superuser" in [role.name for role in superuser.roles]
