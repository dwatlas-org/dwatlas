from collections.abc import AsyncGenerator

import asyncpg
from fastapi import Request


async def get_pg_session(request: Request) -> AsyncGenerator[asyncpg.Connection, None]:
    async with (
        request.app.state.pg_pool.acquire() as connection,
        connection.transaction(),
    ):
        yield connection
