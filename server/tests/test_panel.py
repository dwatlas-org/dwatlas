from unittest.mock import AsyncMock, MagicMock

import pytest
from asyncpg import PostgresError
from fastapi import HTTPException
from httpx import ASGITransport, AsyncClient

from api.main import app
from api.panel.repository import PanelRepository, get_panel_repository
from api.panel.schema import AllowedView, PanelFilter
from api.panel.service import PanelService, get_panel_service


@pytest.fixture
def mock_db():
    return AsyncMock()


@pytest.fixture
def mock_repo():
    repo = MagicMock(spec=PanelRepository)
    repo.fetch_metrics = AsyncMock(
        return_value={"total_users": 100, "total_cities": 5, "female_workers": 40}
    )
    repo.fetch_chart = AsyncMock(
        return_value=[{"label": "2026-09-01", "value": 15, "series": None}]
    )
    repo.fetch_choropleth = AsyncMock(
        return_value={"type": "FeatureCollection", "features": []}
    )
    return repo


@pytest.fixture
def mock_service():
    service = MagicMock(spec=PanelService)
    service.get_metrics = AsyncMock(
        return_value={"total_users": 100, "total_cities": 5, "female_workers": 40}
    )
    service.get_chart_data = AsyncMock(
        return_value={
            "chart_type": "line",
            "data": [{"label": "2026-09-01", "value": 15, "series": None}],
        }
    )
    service.get_choropleth_data = AsyncMock(
        return_value={"type": "FeatureCollection", "features": []}
    )
    return service


@pytest.mark.asyncio
async def test_repository_fetch_metrics(mock_db):
    mock_db.fetchrow.return_value = {
        "total_users": 100,
        "total_cities": 5,
        "female_workers": 40,
    }
    repo = get_panel_repository(db=mock_db)

    filters = PanelFilter(status="active")
    result = await repo.fetch_metrics(AllowedView.users, filters)

    assert result["total_users"] == 100
    mock_db.fetchrow.assert_called_once()
    call_args = mock_db.fetchrow.call_args[0]
    assert "active" in call_args


@pytest.mark.asyncio
async def test_service_get_metrics(mock_repo):
    service = get_panel_service(repo=mock_repo)
    filters = PanelFilter()

    result = await service.get_metrics(AllowedView.users, filters)

    assert result["total_cities"] == 5
    mock_repo.fetch_metrics.assert_called_once_with(AllowedView.users, filters)


@pytest.mark.asyncio
async def test_service_handles_repository_errors(mock_repo):
    mock_repo.fetch_metrics.side_effect = PostgresError("Database connection lost")
    service = get_panel_service(repo=mock_repo)

    with pytest.raises(HTTPException) as exc:
        await service.get_metrics(AllowedView.users, PanelFilter())

    assert exc.value.status_code == 500


@pytest.mark.asyncio
async def test_read_metrics_route(mock_service):
    app.dependency_overrides[get_panel_service] = lambda: mock_service

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get(
            "/panels/users/metrics", params={"status": "active"}
        )

    assert response.status_code == 200
    data = response.json()
    assert data["total_users"] == 100
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_read_charts_route(mock_service):
    app.dependency_overrides[get_panel_service] = lambda: mock_service

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get(
            "/panels/users/charts", params={"group_by": "city", "chart_type": "line"}
        )

    assert response.status_code == 200
    data = response.json()
    assert data["chart_type"] == "line"
    assert len(data["data"]) == 1
    app.dependency_overrides.clear()
