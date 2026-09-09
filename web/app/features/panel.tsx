"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  MessageSquare,
  Download,
  Share2,
  LineChart as LineChartIcon,
  Bookmark,
  ChevronDown,
  Play,
  Quote,
  MessageCircle,
  Maximize,
  Calendar,
  Info,
  FileText,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "Temporal Evolution Panel";

import {
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from "react-router";

type Panel = {
  id: number;
  topic: string;
  metrics: {
    name: string;
    value: number | string;
  }[];
  graph: {};
};

export async function panelsLoader(): Promise<Panel[]> {
  return [
    {
      id: 1,
      topic: "sociodemographic profile",
      metrics: [
        { name: "total users", value: 200 },
        { name: "males", value: 100 },
        { name: "females", value: 100 },
      ],
      graph: {},
    },
    {
      id: 2,
      topic: "vehicles and platforms",
      metrics: [
        { name: "scooters", value: 300 },
        { name: "bikes", value: 200 },
      ],
      graph: {},
    },
  ];
}

const chartData = [
  { date: "2024-06-01", users: 32 },
  { date: "2024-07-01", users: 22 },
  { date: "2024-08-01", users: 28 },
  { date: "2024-09-01", users: 18 },
  { date: "2024-10-01", users: 17 },
  { date: "2024-11-01", users: 25 },
  { date: "2024-12-01", users: 9 },
  { date: "2025-01-01", users: 15 },
  { date: "2025-02-01", users: 15 },
  { date: "2025-03-01", users: 16 },
  { date: "2025-04-01", users: 8 },
  { date: "2025-05-01", users: 19 },
  { date: "2025-06-01", users: 21 },
  { date: "2025-07-01", users: 43 },
  { date: "2025-08-01", users: 57 },
  { date: "2025-09-01", users: 65 },
  { date: "2025-10-01", users: 53 },
  { date: "2025-11-01", users: 44 },
  { date: "2025-12-01", users: 44 },
  { date: "2026-01-01", users: 55 },
  { date: "2026-02-01", users: 56 },
  { date: "2026-03-01", users: 44 },
  { date: "2026-04-01", users: 51 },
  { date: "2026-05-01", users: 65 },
  { date: "2026-06-01", users: 240 },
];

const chartConfig = {
  users: {
    label: "Regular Users",
    color: "#1e293b", // Slate 900 to match the dark line
  },
} satisfies ChartConfig;

export function Panel() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <Head />
        <Metrics />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Chart />
            <Notes />
          </div>
          <div className="lg:col-span-1">
            <Filters />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Head() {
  return (
    <div className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Temporal Evolution
        </h1>
        <p className="text-sm text-slate-600">
          Variation in the number of regular users of the app over time.
        </p>
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

export function Metrics() {
  return (
    <div className="flex flex-col divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white shadow-sm sm:flex-row sm:divide-y-0 sm:divide-x">
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl font-extrabold text-slate-900">793</div>
        <div className="mt-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          Regular Users
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl font-extrabold text-fuchsia-600">14</div>
        <div className="mt-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          Monthly Average of
          <br />
          Regular Users
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl font-extrabold text-blue-500">16</div>
        <div className="mt-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          Monthly Median of
          <br />
          Regular Users
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl font-extrabold text-orange-500">13.4%</div>
        <div className="mt-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          Conversion Rate to
          <br />
          Regular Users
        </div>
      </div>
    </div>
  );
}

export function Chart() {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-slate-900">
          Evolution by month of regular users
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        <div className="mb-6 flex items-center justify-between">
          <button className="inline-flex items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-900">
            <LineChartIcon className="h-4 w-4" />
            Lines
          </button>
          <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Bookmark className="h-4 w-4" />
            Save
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -20,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              label={{
                value: "Regular Users",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#64748b", fontSize: 12 },
              }}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={20}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date
                  .toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                  .toLowerCase();
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px] bg-white text-slate-900 shadow-md border-slate-200"
                  nameKey="users"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey="users"
              type="linear"
              stroke="var(--color-users)"
              strokeWidth={2}
              dot={{ fill: "var(--color-users)", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>

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

export function Filters() {
  return (
    <div className="flex w-full flex-col gap-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between pb-2">
        <span className="text-base font-bold text-slate-900">Filters</span>
        <button className="text-sm font-medium text-slate-500 hover:text-slate-900 hover:underline">
          Clear
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Period
        </label>
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span>01/05/2024 — 30/06/2026</span>
        </div>
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

export function Main() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8 font-sans">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        <Header />
        <Metrics />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex w-full flex-col gap-6 lg:w-3/4">
            <Chart />
            <Notes />
          </div>
          <div className="w-full shrink-0 lg:w-[320px]">
            <Filters />
          </div>
        </div>
      </div>
    </div>
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
