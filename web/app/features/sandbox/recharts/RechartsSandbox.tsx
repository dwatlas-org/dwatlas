import { useEffect, useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Treemap,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { loadChartsData, type ChartsData } from "../data/loader";

const CORES = {
  amarelo: "#FDB917",
  amareloClaro: "#FFE8A3",
  marrom: "#441B00",
  marromMedio: "#8C4A00",
  cinza: "#666666",
  cinzaClaro: "#D9D9D9",
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatCurrencyShort(value: number) {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1).replace(".", ",")} mi`;
  }

  if (value >= 1000) {
    return `R$ ${Math.round(value / 1000).toLocaleString("pt-BR")} mil`;
  }

  return formatCurrency(value);
}

function ChartTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="mb-6 text-lg font-bold"
      style={{
        color: CORES.marrom,
      }}
    >
      {children}
    </h3>
  );
}

type TreemapContentProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  value?: number;

  logo?: string;

  payload?: {
    company?: string;
    users?: number;
    logo?: string;
  };
};

function CompanyTreemapContent(props: TreemapContentProps) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    name,
    value,
    logo,
    payload,
  } = props;

  const companyLogo = logo ?? payload?.logo;

  const companyName = name ?? payload?.company ?? "";

  const companyUsers = value ?? payload?.users ?? 0;

  /*
   * Blocos muito pequenos não têm
   * espaço para mostrar tudo.
   */
  const showLogo = width > 70 && height > 65;

  const showText = width > 90 && height > 85;

  const logoWidth = Math.min(width * 0.45, 90);

  const logoHeight = Math.min(height * 0.3, 50);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#FFFFFF"
        stroke="#E6E6E6"
        strokeWidth={2}
      />

      {showLogo && companyLogo && (
        <image
          href={companyLogo}
          x={x + width / 2 - logoWidth / 2}
          y={y + height / 2 - logoHeight}
          width={logoWidth}
          height={logoHeight}
          preserveAspectRatio="xMidYMid meet"
        />
      )}

      {showText && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 + 18}
            textAnchor="middle"
            fill="#441B00"
            fontSize={13}
            fontWeight={700}
          >
            {companyName}
          </text>

          <text
            x={x + width / 2}
            y={y + height / 2 + 38}
            textAnchor="middle"
            fill="#666666"
            fontSize={11}
          >
            {`${companyUsers.toLocaleString("pt-BR")} usuários`}
          </text>
        </>
      )}
    </g>
  );
}

export function RechartsSandbox() {
  const [data, setData] = useState<ChartsData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const chartsData = await loadChartsData();

        setData(chartsData);

        setError(null);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Erro desconhecido ao carregar os dados.",
        );
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, []);

  if (loading) {
    return <p>Carregando dados fictícios...</p>;
  }

  if (error) {
    return (
      <div className="rounded-md border p-4">
        <p className="font-semibold">Erro ao carregar os dados</p>

        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return <p>Nenhum dado disponível.</p>;
  }

  const topExpenseCategories = data.expenseCategories.slice(0, 5);

  return (
    <section className="space-y-8">
      {/* CABEÇALHO */}

      <div>
        <h2 className="text-2xl font-bold">Recharts</h2>

        <p className="text-sm text-neutral-600">
          Teste com a mesma base fictícia utilizada no Apache ECharts.
        </p>
      </div>

      {/* BIG NUMBERS */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-neutral-500">Usuários</p>

          <strong className="text-2xl">
            {data.summary.totalUsers.toLocaleString("pt-BR")}
          </strong>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-neutral-500">Ganhos</p>

          <strong className="text-2xl">
            {data.summary.totalEarnings.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              maximumFractionDigits: 0,
            })}
          </strong>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-neutral-500">Gastos</p>

          <strong className="text-2xl">
            {data.summary.totalExpenses.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              maximumFractionDigits: 0,
            })}
          </strong>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-neutral-500">Idade média</p>

          <strong className="text-2xl">
            {data.summary.averageAge.toLocaleString("pt-BR")}
          </strong>
        </div>
      </div>

      {/* USUÁRIOS AO LONGO DO TEMPO */}

      <div className="rounded-lg border p-4">
        <ChartTitle>Novos usuários ao longo do tempo</ChartTitle>

        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.usersOverTime}
              margin={{
                top: 30,
                right: 30,
                left: 10,
                bottom: 45,
              }}
            >
              <XAxis
                dataKey="period"
                tick={{
                  fill: CORES.cinza,
                  fontSize: 11,
                }}
                angle={-45}
                textAnchor="end"
                height={65}
                tickLine={false}
                axisLine={{
                  stroke: CORES.cinzaClaro,
                }}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: CORES.cinza,
                  fontSize: 11,
                }}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="users"
                name="Novos usuários"
                stroke={CORES.cinza}
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: CORES.cinza,
                  stroke: CORES.cinza,
                }}
                activeDot={{
                  r: 6,
                }}
              >
                <LabelList
                  dataKey="users"
                  position="top"
                  fill={CORES.marrom}
                  fontSize={12}
                  dy={-8}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    color: "#000000",
                  }}
                  labelStyle={{
                    color: "#000000",
                  }}
                  itemStyle={{
                    color: "#000000",
                  }}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GÊNERO + IDADE */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* GÊNERO */}

        <div className="rounded-lg border p-4">
          <ChartTitle>Usuários por gênero</ChartTitle>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.gender}
                margin={{
                  top: 30,
                  right: 20,
                  left: 0,
                  bottom: 15,
                }}
              >
                <XAxis
                  dataKey="gender"
                  tick={{
                    fill: CORES.cinza,
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={{
                    stroke: CORES.cinzaClaro,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: CORES.cinza,
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="users"
                  name="Usuários"
                  fill={CORES.amarelo}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={70}
                >
                  <LabelList
                    dataKey="users"
                    position="top"
                    fill={CORES.marrom}
                    fontWeight={700}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* IDADE */}

        <div className="rounded-lg border p-4">
          <ChartTitle>Distribuição por faixa etária</ChartTitle>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.ageGroups}
                margin={{
                  top: 30,
                  right: 20,
                  left: 0,
                  bottom: 35,
                }}
              >
                <XAxis
                  dataKey="ageGroup"
                  tick={{
                    fill: CORES.cinza,
                    fontSize: 11,
                  }}
                  angle={-30}
                  textAnchor="end"
                  height={55}
                  tickLine={false}
                  axisLine={{
                    stroke: CORES.cinzaClaro,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: CORES.cinza,
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="users"
                  name="Usuários"
                  fill={CORES.amarelo}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                >
                  <LabelList
                    dataKey="users"
                    position="top"
                    fill={CORES.marrom}
                    fontWeight={700}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* GANHOS */}

      <div className="rounded-lg border p-4">
        <ChartTitle>Ganhos ao longo do tempo</ChartTitle>

        <div className="h-[390px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.earningsOverTime}
              margin={{
                top: 35,
                right: 40,
                left: 25,
                bottom: 45,
              }}
            >
              <XAxis
                dataKey="period"
                angle={-45}
                textAnchor="end"
                height={65}
                tick={{
                  fill: CORES.cinza,
                  fontSize: 11,
                }}
                tickLine={false}
                axisLine={{
                  stroke: CORES.cinzaClaro,
                }}
              />

              <YAxis
                tickFormatter={formatCurrencyShort}
                tick={{
                  fill: CORES.cinza,
                  fontSize: 11,
                }}
                tickLine={false}
                axisLine={false}
                width={90}
              />

              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), "Ganhos"]}
              />

              <Line
                type="monotone"
                dataKey="value"
                name="Ganhos"
                stroke={CORES.amarelo}
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: CORES.amarelo,
                  stroke: CORES.amarelo,
                }}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(value) => formatCurrency(Number(value))}
                  fill={CORES.marrom}
                  fontSize={10}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GASTOS */}

      <div className="rounded-lg border p-4">
        <ChartTitle>Gastos ao longo do tempo</ChartTitle>

        <div className="h-[390px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.expensesOverTime}
              margin={{
                top: 35,
                right: 40,
                left: 25,
                bottom: 45,
              }}
            >
              <XAxis
                dataKey="period"
                angle={-45}
                textAnchor="end"
                height={65}
                tick={{
                  fill: CORES.cinza,
                  fontSize: 11,
                }}
                tickLine={false}
                axisLine={{
                  stroke: CORES.cinzaClaro,
                }}
              />

              <YAxis
                tickFormatter={formatCurrencyShort}
                tick={{
                  fill: CORES.cinza,
                  fontSize: 11,
                }}
                tickLine={false}
                axisLine={false}
                width={90}
              />

              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), "Gastos"]}
              />

              <Line
                type="monotone"
                dataKey="value"
                name="Gastos"
                stroke={CORES.marromMedio}
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: CORES.marromMedio,
                  stroke: CORES.marromMedio,
                }}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(value) =>
                    `R$ ${Math.round(Number(value) / 1000)}k`
                  }
                  fill={CORES.marrom}
                  fontSize={10}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP 5 CATEGORIAS */}

      <div className="rounded-lg border p-4">
        <ChartTitle>Top 5 categorias de gastos</ChartTitle>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topExpenseCategories}
              layout="vertical"
              margin={{
                top: 10,
                right: 120,
                left: 20,
                bottom: 10,
              }}
            >
              <XAxis
                type="number"
                tickFormatter={formatCurrencyShort}
                tick={{
                  fill: CORES.cinza,
                  fontSize: 11,
                }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                type="category"
                dataKey="category"
                width={145}
                tick={{
                  fill: CORES.cinza,
                  fontSize: 12,
                }}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), "Gastos"]}
              />

              <Bar
                dataKey="value"
                name="Gastos"
                fill={CORES.amarelo}
                radius={[0, 4, 4, 0]}
                maxBarSize={38}
              >
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(value) =>
                    `R$ ${Math.round(Number(value) / 1000)}k`
                  }
                  fill={CORES.marrom}
                  fontWeight={700}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <ChartTitle>Usuários por empresa de aplicativo</ChartTitle>

        <div className="h-[480px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={data.companyTreemap}
              dataKey="users"
              nameKey="company"
              stroke="#E6E6E6"
              fill="#FFFFFF"
              content={<CompanyTreemapContent />}
            >
              <Tooltip
                formatter={(value) => [
                  `${Number(value).toLocaleString("pt-BR")} usuários`,
                  "Usuários",
                ]}
              />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
