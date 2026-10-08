"use client";

import {
  MessageSquare,
  Download,
  Share2,
  LineChart as LineChartIcon,
  BarChart3,
  Map,
  Bookmark,
  ChevronDown,
  Play,
  Quote,
  MessageCircle,
  Maximize,
  Info,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import { type DateRange } from "react-day-picker";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { PanelChart } from "@/components/panel-chart";
import { RangeDatePicker } from "@/components/range-date-picker";
import { useChart, useMetrics } from "@/hooks/use-panel-data";
import { cn } from "@/lib/utils";
import {
  type PanelChartPoint,
  type PanelFilters,
  type PanelMetrics,
  type PanelView,
} from "@/lib/api";
import {
  defaultPanelSlug,
  getPanelBySlug,
  type BarSeries,
  type ChartType,
} from "@/lib/panels";

import {
  useRouteError,
  isRouteErrorResponse,
  Navigate,
  useParams,
} from "react-router";

const DEFAULT_FILTERS: PanelFilters = {};

const CHART_LABELS: Record<
  ChartType,
  { label: string; icon: typeof LineChartIcon }
> = {
  line: { label: "Lines", icon: LineChartIcon },
  bar: { label: "Bars", icon: BarChart3 },
  area: { label: "Area", icon: LineChartIcon },
  map: { label: "Map", icon: Map },
};

export function Panel() {
  const { slug } = useParams();
  const panel = getPanelBySlug(slug);

  if (!panel?.view) {
    return <Navigate to={`/panels/${defaultPanelSlug}`} replace />;
  }

  return (
    <PanelContent
      view={panel.view}
      title={panel.title}
      description={panel.description}
      chartType={panel.chartType ?? "line"}
      metricLabel={panel.metricLabel ?? panel.title}
      chartTitle={panel.chartTitle}
      dataKey={panel.dataKey}
      xKey={panel.xKey}
      tooltipLabelKey={panel.tooltipLabelKey}
      barSeries={panel.barSeries}
    />
  );
}

function PanelContent({
  view,
  title,
  description,
  chartType,
  metricLabel,
  chartTitle,
  dataKey,
  xKey,
  tooltipLabelKey,
  barSeries,
}: {
  view: PanelView;
  title: string;
  description: string;
  chartType: ChartType;
  metricLabel: string;
  chartTitle?: string;
  dataKey?: string;
  xKey?: string;
  tooltipLabelKey?: string;
  barSeries?: BarSeries[];
}) {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [filters, setFilters] = useState<PanelFilters>(DEFAULT_FILTERS);

  const handleRangeChange = useCallback((next?: DateRange) => {
    setRange(next);
    if (next?.from && next.to) {
      setFilters({
        start_date: format(next.from, "yyyy-MM-dd"),
        end_date: format(next.to, "yyyy-MM-dd"),
      });
    } else if (!next) {
      setFilters(DEFAULT_FILTERS);
    }
  }, []);

  const metrics = useMetrics(view, filters);
  const chart = useChart(view, filters);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <Head title={title} description={description} />
        <Metrics metrics={metrics.data} isLoading={metrics.isLoading} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Chart
              kind={chartType}
              metricLabel={metricLabel}
              chartTitle={chartTitle}
              dataKey={dataKey}
              xKey={xKey}
              tooltipLabelKey={tooltipLabelKey}
              barSeries={barSeries}
              data={chart.data ?? []}
              isLoading={chart.isLoading}
              error={chart.error}
            />
            <Notes />
          </div>
          <div className="lg:col-span-1">
            <Filters range={range} onRangeChange={handleRangeChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Head({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:ring-offset-2">
          <MessageSquare className="h-4 w-4" />
          Discussion
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1e293b] text-[11px] font-bold text-white">
            3
          </span>
        </button>
        <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:ring-offset-2">
          <Download className="h-4 w-4" />
          Download
        </button>
        <button className="inline-flex items-center gap-2 rounded-md bg-[#1e293b] px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:ring-offset-2">
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
    </div>
  );
}

const METRIC_COLORS = [
  "text-slate-900",
  "text-fuchsia-600",
  "text-blue-500",
  "text-orange-500",
  "text-emerald-600",
];

function formatMetricValue(
  label: string,
  value: number | null | undefined,
): string {
  if (value === null || value === undefined) return "0";
  const isRate =
    label.toLowerCase().includes("rate") ||
    label.toLowerCase().includes("percentage") ||
    label.includes("%");
  const formatted =
    typeof value === "number" ? value.toLocaleString() : String(value);
  return isRate ? `${formatted}%` : formatted;
}

export function Metrics({
  metrics = null,
  isLoading = false,
}: {
  metrics?: PanelMetrics | null;
  isLoading?: boolean;
}) {
  const items = metrics?.metrics ?? [];

  if (items.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="relative">
      {isLoading && items.length > 0 && (
        <div
          aria-busy="true"
          className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-[1px] transition-all"
        >
          <div className="flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 shadow-sm border border-slate-200">
            <Spinner size="default" className="text-slate-700" />
            <span className="text-xs font-medium text-slate-600">
              Updating metrics…
            </span>
          </div>
        </div>
      )}
      <div
        aria-busy={isLoading}
        className="flex flex-col divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white shadow-sm transition-opacity sm:flex-row sm:divide-y-0 sm:divide-x"
      >
        {isLoading && items.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-1 flex-col items-center justify-center p-6 text-center gap-2"
              >
                <Spinner size="lg" className="text-slate-400" />
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Loading…
                </span>
              </div>
            ))
          : items.map((item, index) => {
              const colorClass = METRIC_COLORS[index % METRIC_COLORS.length];
              return (
                <div
                  key={item.label || index}
                  className="flex flex-1 flex-col items-center justify-center p-6 text-center"
                >
                  <div className={cn("text-4xl font-extrabold", colorClass)}>
                    {formatMetricValue(item.label, item.value)}
                  </div>
                  <div className="mt-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    {item.label}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export function Chart({
  kind = "line",
  metricLabel = "Value",
  chartTitle,
  dataKey,
  xKey,
  tooltipLabelKey,
  barSeries,
  data = [],
  isLoading = false,
  error = null,
}: {
  kind?: ChartType;
  metricLabel?: string;
  chartTitle?: string;
  dataKey?: string;
  xKey?: string;
  tooltipLabelKey?: string;
  barSeries?: BarSeries[];
  data?: PanelChartPoint[];
  isLoading?: boolean;
  error?: string | null;
}) {
  const chartLabel = CHART_LABELS[kind];
  const ChartKindIcon = chartLabel.icon;

  return (
    <Card aria-busy={isLoading} className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-900">
            {chartTitle ?? `Evolution of ${metricLabel.toLowerCase()}`}
          </CardTitle>
          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Spinner size="sm" className="text-slate-500" />
              <span>Loading</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        <div className="mb-6 flex items-center justify-between">
          <button className="inline-flex items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-900">
            <ChartKindIcon className="h-4 w-4" />
            {chartLabel.label}
          </button>
          <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Bookmark className="h-4 w-4" />
            Save
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        <PanelChart
          kind={kind}
          data={data}
          metricLabel={metricLabel}
          dataKey={dataKey}
          xKey={xKey}
          tooltipLabelKey={tooltipLabelKey}
          barSeries={barSeries}
          isLoading={isLoading}
          error={error}
        />

        {/* Timeline Slider Mock */}
        <div className="mt-8 flex items-center gap-4 text-sm text-slate-600 font-medium">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
            <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
          </button>
          <span>2023</span>
          <div className="relative flex-1 h-1.5 rounded-full bg-slate-200">
            <div className="absolute bottom-0 left-[20%] right-[5%] top-0 rounded-full bg-[#1e293b]"></div>
            <div className="absolute left-[20%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#1e293b] shadow-sm"></div>
            <div className="absolute right-[5%] top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full border-4 border-white bg-[#1e293b] shadow-sm"></div>
          </div>
          <span>Jun 2026</span>
        </div>

        {/* Bottom Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Quote className="h-4 w-4" /> Cite
          </button>
          <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4" /> Download
          </button>
          <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <MessageCircle className="h-4 w-4" /> Send Feedback
          </button>
          <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Maximize className="h-4 w-4" /> Full Screen
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export function Filters({
  range,
  onRangeChange,
}: {
  range?: DateRange;
  onRangeChange: (next?: DateRange) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between pb-2">
        <span className="text-base font-bold text-slate-900">Filters</span>
        <button
          onClick={() => onRangeChange(undefined)}
          className="text-sm font-medium text-slate-500 hover:text-slate-900 hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Period
        </label>
        <RangeDatePicker value={range} onChange={onRangeChange} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Location
        </span>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-700">State</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900">
              <option>All</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-700">City</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900">
              <option>All</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Age
        </span>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-700 w-6">
              From
            </label>
            <input
              type="text"
              placeholder="Ex: 18"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-700 w-6">To</label>
            <div className="flex w-full gap-2">
              <input
                type="text"
                placeholder="Ex: 60"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
              <button className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
                OK
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-900">
            All
          </button>
          <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            14 to 17
          </button>
          <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            18 to 24
          </button>
          <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            25 to 39
          </button>
          <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            40 to 59
          </button>
          <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            60 or more
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Company Type
          </span>
          <Info className="h-3.5 w-3.5 text-slate-400" />
        </div>
        <div className="flex flex-col gap-2">
          <button className="w-full rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-900">
            All
          </button>
          <button className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Platform Based
          </button>
          <button className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Non-Platform Based
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Vehicle
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-900">
            All
          </button>
          <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Motorcycles
          </button>
          <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Bicycles
          </button>
          <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cars
          </button>
        </div>
      </div>
    </div>
  );
}

export function Notes() {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-slate-900">
          Explanatory Note
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4 text-sm text-slate-700">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"></span>
            <p>
              Average work time grew{" "}
              <strong>34% between Apr 2024 and Jun 2025</strong> (6.2h &rarr;
              8.3h/day), reflecting higher demand and extended shifts during
              peak periods.
            </p>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"></span>
            <p>
              <strong>November and December</strong> concentrate the peak
              journey &ndash; averaging 9.1h/day &ndash; coinciding with
              holidays and higher order volumes.
            </p>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"></span>
            <p>
              Traveled distance grew <strong>62% over the period</strong>,
              moving from 52 km/day in Apr 2024 to 84 km/day in Jun 2025,
              reflecting coverage expansion.
            </p>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"></span>
            <p>
              Motorcycle couriers travel <strong>2.3x more km/day</strong> than
              cyclists, but the ride difference per day is only 28% &ndash;
              indicating longer distance per ride.
            </p>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"></span>
            <p>
              In <strong>Jan 2025</strong> there was a drop across all metrics
              (-11% vs Dec 2024), coinciding with lower operational volume early
              in the year.
            </p>
          </li>
        </ul>
        <div className="mt-6 flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <FileText className="h-4 w-4" />
            View Methodology
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="text-red-600">
        <h3 className="font-bold">Error {error.status}</h3>
        <p>{error.statusText || error.data}</p>
      </div>
    );
  }

  return (
    <div className="text-red-600">
      <h3 className="font-bold">Unexpected Error</h3>
      <p>
        {error instanceof Error ? error.message : "An unknown error occurred"}
      </p>
    </div>
  );
}

export default Panel;
