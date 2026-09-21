from datetime import date
from enum import Enum
from typing import Any

from pydantic import BaseModel


class AllowedView(str, Enum):
    temporal_evolution = "temporal_evolution"
    retention_rate = "retention_rate"
    registrations = "registrations"


class PanelFilter(BaseModel):
    start_date: date | None = None
    end_date: date | None = None
    city: str | None = None
    state: str | None = None


class MetricsResponse(BaseModel):
    metrics: dict[str, Any]


class TemporalEvolutionChartData(BaseModel):
    label: Any
    value: Any


class RetentionRateChartData(BaseModel):
    label: Any
    average_days: Any


class RegistrationsChartData(BaseModel):
    label: Any
    expenses: Any
    earnings: Any


ChartData = TemporalEvolutionChartData | RetentionRateChartData | RegistrationsChartData
