from typing import Annotated

from fastapi import APIRouter, Depends

from api.auth.service import get_current_active_user
from api.panel.schema import AllowedView, ChartData, MetricsResponse, PanelFilter
from api.panel.service import PanelService, get_panel_service
from api.user.models import User

router = APIRouter(prefix="/api/panels", tags=["panels"])


@router.post("/{view_name}/metrics", response_model=MetricsResponse)
async def read_metrics(
    view_name: AllowedView,
    filters: PanelFilter,
    current_user: Annotated[User, Depends(get_current_active_user)],
    service: PanelService = Depends(get_panel_service),
) -> MetricsResponse:
    return await service.get_metrics(view_name, filters)


@router.post("/{view_name}/charts", response_model=list[ChartData])
async def read_chart_data(
    view_name: AllowedView,
    filters: PanelFilter,
    current_user: Annotated[User, Depends(get_current_active_user)],
    service: PanelService = Depends(get_panel_service),
) -> list[ChartData]:
    return await service.get_chart(view_name, filters)
