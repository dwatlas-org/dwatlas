type ChartDataPoint = {
  vehicle: string;
  mean: number;
  median: number;
};

type AnalysisChart = {
  title: string;
  subtitle: string;
  series: string[];
  data: ChartDataPoint[];
  source: string;
};

type AnalysisBarChartProps = {
  chart: AnalysisChart;
};

export function AnalysisBarChart({ chart }: AnalysisBarChartProps) {
  const maxValue = Math.max(
    ...chart.data.flatMap((item) => [item.mean, item.median]),
  );
  const chartMax = Math.ceil(maxValue / 10) * 10;

  return (
    <div className="rounded-lg border border-blue-100 bg-sky-50/30 p-5 md:p-6">
      <h3 className="font-serif text-xl font-bold text-[#102a8f]">
        {chart.title}
      </h3>
      <p className="mt-1 text-sm text-[#526bb1]">{chart.subtitle}</p>

      <div className="mt-4 flex gap-5 text-xs font-semibold text-[#102a8f]">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-[#0b3d91]" />
          {chart.series[0]}
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-[#8fc1ff]" />
          {chart.series[1]}
        </div>
      </div>

      <div className="mt-6 grid min-h-64 grid-cols-3 items-end gap-6 border-b border-blue-100 px-4 pb-0">
        {chart.data.map((item) => (
          <div key={item.vehicle} className="flex h-full flex-col justify-end">
            <div className="flex flex-1 items-end justify-center gap-3">
              <Bar value={item.mean} max={chartMax} tone="dark" />
              <Bar value={item.median} max={chartMax} tone="light" />
            </div>

            <div className="mt-3 pb-2 text-center text-xs font-medium text-[#102a8f]">
              {item.vehicle}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-[#526bb1]">Source: {chart.source}</p>
    </div>
  );
}

function Bar({
  value,
  max,
  tone,
}: {
  value: number;
  max: number;
  tone: "dark" | "light";
}) {
  const height = Math.max((value / max) * 100, 4);

  return (
    <div
      className="relative flex h-full w-20 items-end justify-center"
      title={value.toLocaleString("pt-BR")}
    >
      <span
        className="absolute text-sm font-bold text-[#102a8f]"
        style={{ bottom: `calc(${height}% + 0.35rem)` }}
      >
        {value.toLocaleString("pt-BR")}
      </span>
      <div
        className={
          tone === "dark"
            ? "w-full rounded-t-sm bg-[#0b3d91]"
            : "w-full rounded-t-sm bg-[#8fc1ff]"
        }
        style={{ height: `${height}%` }}
      />
    </div>
  );
}
