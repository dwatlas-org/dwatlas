"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { PanelChartPoint } from "@/lib/api";
import type { BarSeries, ChartType } from "@/lib/panels";

const CHART_COLORS: Record<ChartType, string> = {
  line: "#1e293b",
  bar: "#00132d",
  area: "#cc120c",
  map: "#1e293b",
};

function formatAxisLabel(value: ReactNode): string {
  if (value == null) return "";
  const text = String(value);
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) {
    return text;
  }
  return date
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toLowerCase();
}

export function PanelChart({
  kind,
  data,
  metricLabel,
  dataKey,
  barSeries,
  isLoading = false,
  error = null,
}: {
  kind: ChartType;
  data: PanelChartPoint[];
  metricLabel: string;
  dataKey?: string;
  barSeries?: BarSeries[];
  isLoading?: boolean;
  error?: string | null;
}) {
  const valueKey = dataKey ?? "value";
  const chartConfig = (
    barSeries && barSeries.length > 0
      ? Object.fromEntries(
          barSeries.map((series) => [
            series.dataKey,
            { label: series.label, color: series.color },
          ]),
        )
      : {
          value: {
            label: metricLabel,
            color: CHART_COLORS[kind],
          },
        }
  ) satisfies ChartConfig;

  const seriesKeys =
    barSeries && barSeries.length > 0
      ? barSeries.map((series) => series.dataKey)
      : [valueKey];

  const chartData = data.map((point) => {
    const next: Record<string, string | number> = { ...point };
    for (const key of seriesKeys) {
      const raw = next[key];
      next[key] = typeof raw === "number" ? raw : Number(raw);
    }
    return next;
  });

  if (kind === "map") {
    return (
      <div className="flex aspect-auto h-[300px] w-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 text-sm text-slate-400">
        {isLoading ? "Loading…" : "Map chart not yet implemented"}
      </div>
    );
  }

  if (!isLoading && data.length === 0) {
    return error ? (
      <p className="mt-4 text-center text-sm text-red-600">{error}</p>
    ) : (
      <p className="mt-4 text-center text-sm text-slate-400">
        No data available for the selected filters.
      </p>
    );
  }

  const yAxis = (
    <YAxis
      tickLine={false}
      axisLine={false}
      tickMargin={12}
      tick={{ fill: "#94a3b8", fontSize: 11 }}
      label={{
        value: metricLabel,
        angle: -90,
        position: "insideLeft",
        style: { fill: "#64748b", fontSize: 12 },
      }}
    />
  );
  const xAxis = (
    <XAxis
      dataKey="label"
      tickLine={false}
      axisLine={false}
      tickMargin={12}
      minTickGap={20}
      tick={{ fill: "#94a3b8", fontSize: 11 }}
      tickFormatter={formatAxisLabel}
    />
  );

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[300px] w-full"
      >
        {kind === "line" && (
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -20, right: 12, top: 12, bottom: 12 }}
          >
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            {yAxis}
            {xAxis}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px] bg-white text-slate-900 shadow-md border-slate-200"
                  nameKey="value"
                  labelFormatter={formatAxisLabel}
                />
              }
            />
            <Line
              dataKey={valueKey}
              type="linear"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={{ fill: "var(--color-value)", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}

        {kind === "bar" && (
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -20, right: 12, top: 12, bottom: 12 }}
          >
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            {yAxis}
            {xAxis}
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[150px] bg-white text-slate-900 shadow-md border-slate-200"
                  nameKey={
                    barSeries && barSeries.length > 0 ? undefined : "value"
                  }
                  labelFormatter={formatAxisLabel}
                />
              }
            />
            {barSeries && barSeries.length > 0 ? (
              <>
                {barSeries.map((series) => (
                  <Bar
                    key={series.dataKey}
                    dataKey={series.dataKey}
                    fill={`var(--color-${series.dataKey})`}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
                <ChartLegend content={<ChartLegendContent />} />
              </>
            ) : (
              <Bar
                dataKey={valueKey}
                fill="var(--color-value)"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        )}

        {kind === "area" && (
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -20, right: 12, top: 12, bottom: 12 }}
          >
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            {yAxis}
            {xAxis}
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[150px] bg-white text-slate-900 shadow-md border-slate-200"
                  indicator="dot"
                  labelFormatter={formatAxisLabel}
                />
              }
            />
            <Area
              dataKey={valueKey}
              type="natural"
              fill="url(#fillValue)"
              stroke="var(--color-value)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        )}
      </ChartContainer>
      {error ? (
        <p className="mt-4 text-center text-sm text-red-600">{error}</p>
      ) : null}
    </>
  );
}
