from datetime import date
from enum import Enum
from typing import Any

from pydantic import BaseModel


class AllowedView(str, Enum):
    temporal_evolution = "temporal_evolution"
    retention_rate = "retention_rate"
    registrations = "registrations"
    demographics = "demographics"
    gender = "gender"
    age = "age"


class PanelFilter(BaseModel):
    start_date: date | None = None
    end_date: date | None = None
    city: str | None = None
    state: str | None = None
    age_min: int | None = None
    age_max: int | None = None
    vehicle_type: str | None = None
    company_type: str | None = None


class MetricsResponse(BaseModel):
    metrics: list[dict[str, Any]]


class TemporalEvolutionChartData(BaseModel):
    label: Any
    value: Any


class RetentionRateChartData(BaseModel):
    retention_range: str
    lower_limit: int
    upper_limit: int
    user_count: int
    user_percentage: float


class RegistrationsChartData(BaseModel):
    label: Any
    expenses: Any
    earnings: Any


class DemographicsChartData(BaseModel):
    bin_index: int
    uf: str
    state_name: str
    user_count: int | None = None
    label: str
    color: str


class GenderChartData(BaseModel):
    bin_index: int
    label: str
    men: float | None = None
    women: float | None = None
    other: float | None = None
    men_label: str | None = None
    women_label: str | None = None
    other_label: str | None = None


class AgeChartData(BaseModel):
    bin_index: int
    age_min_val: int
    age_max_val: int | None = None
    label: str
    user_count: int


ChartData = (
    TemporalEvolutionChartData
    | RetentionRateChartData
    | RegistrationsChartData
    | DemographicsChartData
    | GenderChartData
    | AgeChartData
)
