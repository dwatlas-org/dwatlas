import os
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

POSTGRES_URL = os.getenv(
    "POSTGRES_URL",
    "postgresql+asyncpg://readonly_user:password@server/meucorre"
)

postgres_engine = create_async_engine(
    POSTGRES_URL,
    echo=False,
    pool_size=20,
    max_overflow=20,
)

PostgresSessionLocal = async_sessionmaker(
    bind=postgres_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def postgres_session() -> AsyncGenerator[AsyncSession, None]:
    async with PostgresSessionLocal() as session:
        yield session
