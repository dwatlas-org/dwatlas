from pathlib import Path
from typing import Any

from asyncpg import Connection

_cache: dict[str, str] = {}


def preload(directory: Path | str) -> None:
    target_dir = Path(directory)
    for sql_file in target_dir.rglob("*.sql"):
        _cache[sql_file.stem] = sql_file.read_text(encoding="utf-8")


def get_query(name: str) -> str:
    query = _cache.get(name)
    if not query:
        raise ValueError(f"Missing query file for {name}.sql")
    return query


async def fetch_all(conn: Connection, name: str, *args: Any) -> list[dict[str, Any]]:
    query = get_query(name)
    rows = await conn.fetch(query, *args)
    return [dict(row) for row in rows]


async def fetch_one(conn: Connection, name: str, *args: Any) -> dict[str, Any] | None:
    query = get_query(name)
    row = await conn.fetchrow(query, *args)
    return dict(row) if row else None
