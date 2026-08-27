import pytest
from api.main import app
from api.postgres import async_session_factory, get_db_session
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


@pytest.fixture
async def db_session():
    async with async_session_factory() as session:
        yield session


@pytest.fixture
async def client(db_session: AsyncSession):
    app.dependency_overrides[get_db_session] = lambda: db_session
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://localhost:8000") as ac:
        yield ac
    app.dependency_overrides.clear()


async def test_select(db_session: AsyncSession):
    result = await db_session.execute(text("SELECT 1"))
    row = result.scalar()

    assert row == 1


async def test_get_panels(client: AsyncClient, db_session: AsyncSession):
    result = await db_session.execute(text("SELECT id FROM expenses LIMIT 10"))
    expected_rows = result.fetchall()

    response = await client.get("/api/panels")

    assert response.status_code == 200
    assert len(response.json()) == len(expected_rows)
