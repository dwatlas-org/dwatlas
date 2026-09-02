from fastapi import APIRouter, Depends

from api.panel.schema import (
    AllowedView,
    ChartFilter,
    ChartResponse,
    GeoJsonFeatureCollection,
    MetricsResponse,
    PanelFilter,
)
from api.panel.service import PanelService, get_panel_service

router = APIRouter(prefix="/panels", tags=["panels"])


@router.get("/{view_name}/metrics", response_model=MetricsResponse)
async def read_metrics(
    view_name: AllowedView,
    filters: PanelFilter = Depends(),
    service: PanelService = Depends(get_panel_service),
) -> dict:
    return await service.get_metrics(view_name, filters)


@router.get("/{view_name}/charts", response_model=ChartResponse)
async def read_chart_data(
    view_name: AllowedView,
    filters: ChartFilter = Depends(),
    service: PanelService = Depends(get_panel_service),
) -> dict:
    return await service.get_chart_data(view_name, filters)


@router.get("/{view_name}/choropleth", response_model=GeoJsonFeatureCollection)
async def read_choropleth_data(
    view_name: AllowedView,
    filters: ChartFilter = Depends(),
    service: PanelService = Depends(get_panel_service),
) -> dict:
    return await service.get_choropleth_data(view_name, filters)
