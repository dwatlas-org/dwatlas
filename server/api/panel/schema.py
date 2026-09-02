from datetime import date
from enum import Enum

from pydantic import BaseModel, Field


class AllowedView(str, Enum):
    users = "users"
    earnings = "earnings"
    expenses = "expenses"


class ChartType(str, Enum):
    line = "line"
    bar = "bar"
    area = "area"
    pie = "pie"
    choropleth = "choropleth"


class PanelFilter(BaseModel):
    start_date: date | None = None
    end_date: date | None = None
    status: str | None = None


class ChartFilter(PanelFilter):
    group_by: str = Field(default="created_at", description="Primary dimension")
    secondary_group_by: str | None = Field(
        default=None, description="Dimension for multi-series charts"
    )
    chart_type: ChartType = ChartType.line


class MetricsResponse(BaseModel):
    total_users: int
    total_cities: int
    female_workers: int


class ChartDataPoint(BaseModel):
    label: str
    value: int | float
    series: str | None = None


class ChartResponse(BaseModel):
    chart_type: ChartType
    data: list[ChartDataPoint]


class GeoJsonProperties(BaseModel):
    label: str
    value: int | float


class GeoJsonFeature(BaseModel):
    type: str = "Feature"
    geometry: dict | None = None
    properties: GeoJsonProperties


class GeoJsonFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: list[GeoJsonFeature]
