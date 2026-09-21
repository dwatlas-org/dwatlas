from datetime import date
from unittest.mock import AsyncMock, MagicMock

import pytest
from asyncpg import PostgresError
from fastapi import HTTPException
from httpx import ASGITransport, AsyncClient

from api.main import app
from api.panel.repository import (
    PanelRepository,
    build_function_call,
    get_panel_repository,
)
from api.panel.schema import AllowedView, PanelFilter
from api.panel.service import PanelService, get_panel_service


@pytest.fixture
def mock_db():
    return AsyncMock()


@pytest.fixture
def mock_repo():
    repo = MagicMock(spec=PanelRepository)
    repo.fetch_metrics = AsyncMock(
        return_value={
            "total": 200,
            "average": 14.5,
            "median": 16.0,
            "conversion": 0.134,
        }
    )
    repo.fetch_chart = AsyncMock(
        return_value=[
            {"label": date(2024, 6, 1), "value": 32},
            {"label": date(2024, 7, 1), "value": 22},
        ]
    )
    return repo


@pytest.fixture
def mock_service():
    service = MagicMock(spec=PanelService)
    service.get_metrics = AsyncMock(
        return_value={
            "metrics": {
                "total": 200,
                "average": 14.5,
                "median": 16.0,
                "conversion": 0.134,
            }
        }
    )
    service.get_chart = AsyncMock(
        return_value=[
            {"label": "2024-06-01", "value": 32},
            {"label": "2024-07-01", "value": 22},
        ]
    )
    return service


def test_build_function_call_only_provided_filters():
    filters = PanelFilter(start_date="2026-01-01", city="Sao Paulo")

    query, args = build_function_call("temporal_evolution_metrics", filters)

    assert query == (
        "SELECT * FROM temporal_evolution_metrics(start_date => $1, city => $2)"
    )
    assert args == [date(2026, 1, 1), "Sao Paulo"]


def test_build_function_call_without_filters():
    query, args = build_function_call("retention_rate_chart", PanelFilter())

    assert query == "SELECT * FROM retention_rate_chart()"
    assert args == []


@pytest.mark.asyncio
async def test_repository_fetch_metrics(mock_db):
    mock_db.fetchrow.return_value = {
        "total": 200,
        "average": 14.5,
        "median": 16.0,
        "conversion": 0.134,
    }
    repo = get_panel_repository(db=mock_db)

    filters = PanelFilter(state="SP")
    result = await repo.fetch_metrics(AllowedView.temporal_evolution, filters)

    assert result["total"] == 200
    assert (
        mock_db.fetchrow.call_args[0][0]
        == "SELECT * FROM temporal_evolution_metrics(state => $1)"
    )
    assert mock_db.fetchrow.call_args[0][1] == "SP"


@pytest.mark.asyncio
async def test_repository_fetch_chart(mock_db):
    mock_db.fetch.return_value = [
        {"date": date(2024, 6, 1), "users": 32},
        {"date": date(2024, 7, 1), "users": 22},
    ]
    repo = get_panel_repository(db=mock_db)

    result = await repo.fetch_chart(AllowedView.registrations, PanelFilter())

    assert len(result) == 2
    assert mock_db.fetch.call_args[0][0] == "SELECT * FROM registrations_chart()"


@pytest.mark.asyncio
async def test_service_get_metrics(mock_repo):
    service = get_panel_service(repo=mock_repo)

    result = await service.get_metrics(AllowedView.temporal_evolution, PanelFilter())

    assert result.metrics["total"] == 200
    assert result.metrics["average"] == 14.5
    mock_repo.fetch_metrics.assert_called_once_with(
        AllowedView.temporal_evolution, PanelFilter()
    )


@pytest.mark.asyncio
async def test_service_handles_repository_errors(mock_repo):
    mock_repo.fetch_metrics.side_effect = PostgresError("Database connection lost")
    service = get_panel_service(repo=mock_repo)

    with pytest.raises(HTTPException) as exc:
        await service.get_metrics(AllowedView.temporal_evolution, PanelFilter())

    assert exc.value.status_code == 500


@pytest.mark.asyncio
async def test_service_get_chart(mock_repo):
    service = get_panel_service(repo=mock_repo)

    result = await service.get_chart(AllowedView.temporal_evolution, PanelFilter())

    assert result[0].label == date(2024, 6, 1)
    assert result[0].value == 32
    mock_repo.fetch_chart.assert_called_once_with(
        AllowedView.temporal_evolution, PanelFilter()
    )


@pytest.mark.asyncio
async def test_read_metrics_route(mock_service):
    app.dependency_overrides[get_panel_service] = lambda: mock_service

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post(
            "/panels/temporal_evolution/metrics",
            json={"state": "SP", "start_date": "2026-01-01"},
        )

    assert response.status_code == 200
    data = response.json()
    assert data["metrics"]["total"] == 200
    assert data["metrics"]["conversion"] == 0.134
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_read_charts_route(mock_service):
    app.dependency_overrides[get_panel_service] = lambda: mock_service

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post(
            "/panels/temporal_evolution/charts",
            json={"start_date": "2024-06-01"},
        )

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0] == {"label": "2024-06-01", "value": 32}
    app.dependency_overrides.clear()
