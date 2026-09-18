import logging
from collections.abc import Awaitable, Callable
from dataclasses import dataclass

from asyncpg import PostgresError
from fastapi import Depends, HTTPException
from pydantic import BaseModel

from api.panel.repository import PanelRepository, get_panel_repository
from api.panel.schema import (
    AllowedView,
    ChartData,
    MetricsResponse,
    PanelFilter,
    RegistrationsChartData,
    RetentionRateChartData,
    TemporalEvolutionChartData,
)

CHART_MODELS: dict[AllowedView, type[BaseModel]] = {
    AllowedView.temporal_evolution: TemporalEvolutionChartData,
    AllowedView.retention_rate: RetentionRateChartData,
    AllowedView.registrations: RegistrationsChartData,
}

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class PanelService:
    get_metrics: Callable[[AllowedView, PanelFilter], Awaitable[MetricsResponse]]
    get_chart: Callable[[AllowedView, PanelFilter], Awaitable[list[ChartData]]]


def get_panel_service(
    repo: PanelRepository = Depends(get_panel_repository),
) -> PanelService:

    async def get_metrics(view: AllowedView, filters: PanelFilter) -> MetricsResponse:
        try:
            return MetricsResponse(**await repo.fetch_metrics(view, filters))
        except PostgresError as err:
            logger.error(
                "Error fetching metrics for view %s, details %s", view.value, str(err)
            )
            raise HTTPException(status_code=500, detail="Internal server error")

    async def get_chart(view: AllowedView, filters: PanelFilter) -> list[ChartData]:
        try:
            rows = await repo.fetch_chart(view, filters)
            model = CHART_MODELS[view]
            return [model(**row) for row in rows]
        except PostgresError as err:
            logger.error(
                "Error fetching chart data for view %s, details %s",
                view.value,
                str(err),
            )
            raise HTTPException(status_code=500, detail="Internal server error")

    return PanelService(get_metrics, get_chart)
