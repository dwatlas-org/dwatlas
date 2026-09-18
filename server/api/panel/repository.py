from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from typing import Any

from fastapi import Depends

from api.core.postgres import get_pg_session
from api.panel.schema import AllowedView, PanelFilter


def build_function_call(function: str, filters: PanelFilter) -> tuple[str, list[Any]]:
    provided = list(filters.model_dump(exclude_none=True).items())

    if not provided:
        return f"SELECT * FROM {function}()", []

    spec = ", ".join(f"{name} => ${i}" for i, (name, _) in enumerate(provided, start=1))
    args = [value for _, value in provided]

    return f"SELECT * FROM {function}({spec})", args


@dataclass(frozen=True)
class PanelRepository:
    fetch_metrics: Callable[[AllowedView, PanelFilter], Awaitable[dict]]
    fetch_chart: Callable[[AllowedView, PanelFilter], Awaitable[list[dict]]]


def get_panel_repository(db: Any = Depends(get_pg_session)) -> PanelRepository:

    async def fetch_metrics(view: AllowedView, filters: PanelFilter) -> dict:
        query, args = build_function_call(f"{view.value}_metrics", filters)
        row = await db.fetchrow(query, *args)
        return dict(row) if row else {}

    async def fetch_chart(view: AllowedView, filters: PanelFilter) -> list[dict]:
        query, args = build_function_call(f"{view.value}_chart", filters)
        rows = await db.fetch(query, *args)
        return [dict(row) for row in rows]

    return PanelRepository(fetch_metrics, fetch_chart)
