import pytest
from httpx2 import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from api.config import settings
from api.main import app
from api.postgres import async_session_factory, get_pg_session


@pytest.fixture
async def pg_session():
    async with async_session_factory() as session:
        yield session


@pytest.fixture
async def client():
    async def _override_get_pg_session():
        async with async_session_factory() as session:
            yield session

    app.dependency_overrides[get_pg_session] = _override_get_pg_session
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url=settings.BASE_URL) as ac:
        yield ac

    app.dependency_overrides.clear()


async def test_raw_query(pg_session: AsyncSession):
    result = await pg_session.execute(text("SELECT 1"))
    row = result.scalar()

    assert row == 1


async def test_get_panels(client: AsyncClient, pg_session: AsyncSession):
    result = await client.get("/panels/workers")
    expected_rows = result.json()

    assert result.status_code == 200
    assert len(result.json()) == len(expected_rows)
