from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from typing import Any

from fastapi import Depends

from api.core.postgres import get_pg_session
from api.panel.schema import AllowedView, ChartFilter, PanelFilter


@dataclass(frozen=True)
class PanelRepository:
    fetch_metrics: Callable[[AllowedView, PanelFilter], Awaitable[dict]]
    fetch_chart: Callable[[AllowedView, ChartFilter], Awaitable[list[dict]]]
    fetch_choropleth: Callable[[AllowedView, ChartFilter], Awaitable[dict]]


def get_panel_repository(db: Any = Depends(get_pg_session)) -> PanelRepository:

    def build_conditions(filters: PanelFilter) -> tuple[str, list[Any]]:
        conditions = []
        args = []

        if filters.start_date:
            args.append(filters.start_date)
            conditions.append(f"created_at >= ${len(args)}")

        if filters.end_date:
            args.append(filters.end_date)
            conditions.append(f"created_at <= ${len(args)}")

        if filters.status:
            args.append(filters.status)
            conditions.append(f"status = ${len(args)}")

        where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""
        return where_clause, args

    async def fetch_metrics(view: AllowedView, filters: PanelFilter) -> dict:
        where_clause, args = build_conditions(filters)

        query = f"""
            SELECT
                COUNT(*) as total_users,
                COUNT(DISTINCT city) as total_cities,
                SUM(CASE WHEN gender = 'female' THEN 1 ELSE 0 END) as female_workers
            FROM {view.value}
            {where_clause}
        """
        row = await db.fetchrow(query, *args)
        return (
            dict(row)
            if row
            else {"total_users": 0, "total_cities": 0, "female_workers": 0}
        )

    async def fetch_chart(view: AllowedView, filters: ChartFilter) -> list[dict]:
        allowed_dimensions = {"created_at", "city", "status", "department", "gender"}
        dim_1 = (
            filters.group_by if filters.group_by in allowed_dimensions else "created_at"
        )
        dim_2 = (
            filters.secondary_group_by
            if filters.secondary_group_by in allowed_dimensions
            else None
        )

        where_clause, args = build_conditions(filters)

        if dim_2:
            query = f"""
                SELECT
                    {dim_1}::text as label,
                    {dim_2}::text as series,
                    COUNT(*) as value
                FROM {view.value}
                {where_clause}
                GROUP BY {dim_1}, {dim_2}
                ORDER BY label ASC, series ASC
            """
        else:
            query = f"""
                SELECT
                    {dim_1}::text as label,
                    NULL as series,
                    COUNT(*) as value
                FROM {view.value}
                {where_clause}
                GROUP BY {dim_1}
                ORDER BY label ASC
            """

        rows = await db.fetch(query, *args)
        return [dict(row) for row in rows]

    async def fetch_choropleth(view: AllowedView, filters: ChartFilter) -> dict:
        where_clause, args = build_conditions(filters)
        region_col = (
            filters.group_by
            if filters.group_by in {"region_code", "state", "county"}
            else "region_code"
        )

        query = f"""
            SELECT json_build_object(
                'type', 'FeatureCollection',
                'features', coalesce(json_agg(
                    json_build_object(
                        'type', 'Feature',
                        'geometry', ST_AsGeoJSON(geom)::json,
                        'properties', json_build_object(
                            'label', region_code,
                            'value', val_count
                        )
                    )
                ), '[]'::json)
            ) as fc
            FROM (
                SELECT {region_col} as region_code, geom, count(*) as val_count
                FROM {view.value}
                {where_clause}
                GROUP BY {region_col}, geom
            ) sub
        """

        row = await db.fetchrow(query, *args)
        return (
            dict(row["fc"])
            if row and row["fc"]
            else {"type": "FeatureCollection", "features": []}
        )

    return PanelRepository(fetch_metrics, fetch_chart, fetch_choropleth)
