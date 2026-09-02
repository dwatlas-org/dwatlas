import logging
from collections.abc import Awaitable, Callable
from dataclasses import dataclass

from asyncpg import PostgresError
from fastapi import Depends, HTTPException

from api.panel.repository import PanelRepository, get_panel_repository
from api.panel.schema import AllowedView, ChartFilter, PanelFilter

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class PanelService:
    get_metrics: Callable[[AllowedView, PanelFilter], Awaitable[dict]]
    get_chart_data: Callable[[AllowedView, ChartFilter], Awaitable[dict]]
    get_choropleth_data: Callable[[AllowedView, ChartFilter], Awaitable[dict]]


def get_panel_service(
    repo: PanelRepository = Depends(get_panel_repository),
) -> PanelService:

    async def get_metrics(view: AllowedView, filters: PanelFilter) -> dict:
        try:
            return await repo.fetch_metrics(view, filters)
        except PostgresError as err:
            logger.error(
                "Error fetching metrics for view %s, details %s", view.value, str(err)
            )
            raise HTTPException(status_code=500, detail="Internal server error")

    async def get_chart_data(view: AllowedView, filters: ChartFilter) -> dict:
        try:
            raw_data = await repo.fetch_chart(view, filters)
            return {"chart_type": filters.chart_type, "data": raw_data}
        except PostgresError as err:
            logger.error(
                "Error fetching chart data for view %s, details %s",
                view.value,
                str(err),
            )
            raise HTTPException(status_code=500, detail="Internal server error")

    async def get_choropleth_data(view: AllowedView, filters: ChartFilter) -> dict:
        try:
            return await repo.fetch_choropleth(view, filters)
        except PostgresError as err:
            logger.error(
                "Error fetching choropleth data for view %s, details %s",
                view.value,
                str(err),
            )
            raise HTTPException(status_code=500, detail="Internal server error")

    return PanelService(get_metrics, get_chart_data, get_choropleth_data)
