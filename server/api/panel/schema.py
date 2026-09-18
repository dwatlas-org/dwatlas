from datetime import date
from enum import Enum

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
    total: int
    average: float
    median: float
    conversion: float


class TemporalEvolutionChartData(BaseModel):
    date: date
    users: int


class RetentionRateChartData(BaseModel):
    date: date
    rate: float


class RegistrationsChartData(BaseModel):
    date: date
    registrations: int


ChartData = TemporalEvolutionChartData | RetentionRateChartData | RegistrationsChartData
