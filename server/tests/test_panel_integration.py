import asyncpg
import pytest
from httpx import ASGITransport, AsyncClient

from api.config import settings
from api.main import app, lifespan


@pytest.fixture
async def app_setup():
    async with lifespan(app):
        yield app


@pytest.fixture
async def client(app_setup):
    transport = ASGITransport(app=app_setup)
    async with AsyncClient(transport=transport, base_url=settings.BASE_URL) as ac:
        yield ac


@pytest.fixture
async def pg_session(app_setup):
    async with (
        app_setup.state.pg_pool.acquire() as connection,
        connection.transaction(),
    ):
        yield connection


async def test_raw_query(pg_session: asyncpg.Connection):
    row = await pg_session.fetchval("SELECT 1")

    assert row == 1
