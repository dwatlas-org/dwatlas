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
import { Spinner } from "@/components/ui/spinner";
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
  if (typeof value === "number") return String(value);
  const text = String(value);
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) {
    return text;
  }
  return date
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toLowerCase();
}

function makeTooltipLabelFormatter(
  tooltipLabelKey?: string,
): (value: ReactNode, payload?: readonly unknown[]) => ReactNode {
  if (!tooltipLabelKey) {
    return formatAxisLabel;
  }

  return (value, payload) => {
    const [item] = payload ?? [];
    const row =
      item && typeof item === "object" && "payload" in item
        ? (item as { payload: unknown }).payload
        : undefined;
    const raw =
      row && typeof row === "object" && tooltipLabelKey in row
        ? (row as Record<string, unknown>)[tooltipLabelKey]
        : undefined;
    return raw != null ? String(raw) : formatAxisLabel(value);
  };
}

function coerceNumber(raw: string | number): string | number {
  if (typeof raw === "number") return raw;
  if (raw.trim() === "") return raw;
  const value = Number(raw);
  return Number.isNaN(value) ? raw : value;
}

export function PanelChart({
  kind,
  data,
  metricLabel,
  dataKey,
  xKey = "label",
  tooltipLabelKey,
  barSeries,
  isLoading = false,
  error = null,
}: {
  kind: ChartType;
  data: PanelChartPoint[];
  metricLabel: string;
  dataKey?: string;
  xKey?: string;
  tooltipLabelKey?: string;
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
          [valueKey]: {
            label: metricLabel,
            color: CHART_COLORS[kind],
          },
        }
  ) satisfies ChartConfig;

  const seriesKeys =
    barSeries && barSeries.length > 0
      ? barSeries.map((series) => series.dataKey)
      : [valueKey];

  const tooltipLabelFormatter = makeTooltipLabelFormatter(tooltipLabelKey);

  const chartData = data.map((point) => {
    const next: Record<string, string | number> = { ...point };
    for (const key of seriesKeys) {
      const raw = next[key];
      if (raw !== undefined) {
        next[key] = typeof raw === "number" ? raw : Number(raw);
      }
    }
    if (xKey in next && next[xKey] !== undefined) {
      next[xKey] = coerceNumber(next[xKey]);
    }
    return next;
  });

  if (kind === "map") {
    return (
      <div className="flex aspect-auto h-[300px] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 text-sm text-slate-500">
        {isLoading ? (
          <>
            <Spinner size="lg" className="text-slate-600" />
            <span className="text-xs text-slate-400">Loading map data…</span>
          </>
        ) : (
          "Map chart not yet implemented"
        )}
      </div>
    );
  }

  if (isLoading && data.length === 0) {
    return (
      <div className="flex aspect-auto h-[300px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 text-slate-500">
        <Spinner size="xl" className="text-slate-600" />
        <span className="text-xs font-medium text-slate-400">
          Loading chart data…
        </span>
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
      dataKey={xKey}
      tickLine={false}
      axisLine={false}
      tickMargin={12}
      minTickGap={20}
      tick={{ fill: "#94a3b8", fontSize: 11 }}
      tickFormatter={formatAxisLabel}
    />
  );

  return (
    <div className="relative">
      {isLoading && (
        <div
          aria-busy="true"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-lg bg-white/70 backdrop-blur-[1px] transition-all"
        >
          <Spinner size="xl" className="text-slate-700" />
          <span className="text-xs font-medium text-slate-500">
            Updating chart…
          </span>
        </div>
      )}
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
                  nameKey={valueKey}
                  labelFormatter={tooltipLabelFormatter}
                />
              }
            />
            <Line
              dataKey={valueKey}
              type="linear"
              stroke={`var(--color-${valueKey})`}
              strokeWidth={2}
              dot={{ fill: `var(--color-${valueKey})`, strokeWidth: 0, r: 4 }}
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
                    barSeries && barSeries.length > 0 ? undefined : valueKey
                  }
                  labelFormatter={tooltipLabelFormatter}
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
                fill={`var(--color-${valueKey})`}
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
                  stopColor={`var(--color-${valueKey})`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${valueKey})`}
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
                  labelFormatter={tooltipLabelFormatter}
                />
              }
            />
            <Area
              dataKey={valueKey}
              type="natural"
              fill="url(#fillValue)"
              stroke={`var(--color-${valueKey})`}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        )}
      </ChartContainer>
      {error ? (
        <p className="mt-4 text-center text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
