from api.auth.service import get_current_active_user, is_superuser
from api.main import app
from api.user.models import User


async def test_is_superuser(superuser: User):
    app.dependency_overrides[get_current_active_user] = lambda: superuser
    assert await is_superuser()
