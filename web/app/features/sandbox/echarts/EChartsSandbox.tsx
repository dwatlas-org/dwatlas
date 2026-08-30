import { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { EChartsDrilldownMap } from "./EChartsDrilldownMap";
import * as echarts from "echarts";

import {
  loadBrazilStatesMap,
  loadChartsData,
  type ChartsData,
  type GeoJsonFeatureCollection,
} from "../data/loader";

const CORES = {
  amarelo: "#FDB917",
  amareloClaro: "#FFE8A3",
  marrom: "#441B00",
  marromMedio: "#8C4A00",
  cinza: "#666666",
  cinzaClaro: "#D9D9D9",
  fundoMapa: "#EFEFEF",
};

export function EChartsSandbox() {
  /*
   * ------------------------------------------------------
   * ESTADOS
   * ------------------------------------------------------
   */

  const [data, setData] = useState<ChartsData | null>(null);

  const [brazilMap, setBrazilMap] = useState<GeoJsonFeatureCollection | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /*
   * ------------------------------------------------------
   * CARREGAMENTO
   * ------------------------------------------------------
   */

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [chartsData, mapData] = await Promise.all([
          loadChartsData(),
          loadBrazilStatesMap(),
        ]);

        setData(chartsData);

        setBrazilMap(mapData);

        echarts.registerMap(
          "BrasilEstados",
          mapData as Parameters<typeof echarts.registerMap>[1],
        );

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

  /*
   * ------------------------------------------------------
   * GRÁFICO 1
   * NOVOS USUÁRIOS AO LONGO DO TEMPO
   * ------------------------------------------------------
   */

  const usersOption = useMemo(
    () => ({
      title: {
        text: "Novos usuários ao longo do tempo",
        left: 20,
        top: 10,

        textStyle: {
          color: CORES.marrom,
          fontSize: 18,
          fontWeight: "bold",
        },
      },

      tooltip: {
        trigger: "axis",
      },

      grid: {
        left: 30,
        right: 30,
        top: 75,
        bottom: 70,
        containLabel: true,
      },

      xAxis: {
        type: "category",

        data: data?.usersOverTime.map((item) => item.period) ?? [],

        axisLabel: {
          rotate: 45,
          color: CORES.cinza,
          fontSize: 11,
        },

        axisLine: {
          lineStyle: {
            color: CORES.cinzaClaro,
          },
        },

        axisTick: {
          show: false,
        },
      },

      yAxis: {
        type: "value",

        minInterval: 1,

        axisLabel: {
          color: CORES.cinza,
        },

        axisLine: {
          show: false,
        },

        axisTick: {
          show: false,
        },

        splitLine: {
          show: false,
        },
      },

      series: [
        {
          name: "Novos usuários",

          type: "line",

          data: data?.usersOverTime.map((item) => item.users) ?? [],

          smooth: true,

          symbol: "circle",

          symbolSize: 7,

          lineStyle: {
            color: CORES.cinza,
            width: 3,
          },

          itemStyle: {
            color: CORES.cinza,
          },

          label: {
            show: true,
            position: "top",
            color: CORES.marrom,
            fontSize: 11,
            formatter: "{c}",
          },
        },
      ],
    }),
    [data],
  );

  /*
   * ------------------------------------------------------
   * GRÁFICO 2
   * GÊNERO
   * ------------------------------------------------------
   */

  const genderOption = useMemo(
    () => ({
      title: {
        text: "Usuários por gênero",

        left: 20,
        top: 10,

        textStyle: {
          color: CORES.marrom,
          fontSize: 18,
          fontWeight: "bold",
        },
      },

      tooltip: {
        trigger: "axis",

        axisPointer: {
          type: "shadow",
        },
      },

      grid: {
        left: 30,
        right: 30,
        top: 75,
        bottom: 45,
        containLabel: true,
      },

      xAxis: {
        type: "category",

        data: data?.gender.map((item) => item.gender) ?? [],

        axisLabel: {
          color: CORES.cinza,
          fontSize: 11,
        },

        axisLine: {
          lineStyle: {
            color: CORES.cinzaClaro,
          },
        },

        axisTick: {
          show: false,
        },
      },

      yAxis: {
        type: "value",

        minInterval: 1,

        axisLabel: {
          color: CORES.cinza,
        },

        splitLine: {
          show: false,
        },

        axisLine: {
          show: false,
        },

        axisTick: {
          show: false,
        },
      },

      series: [
        {
          name: "Usuários",

          type: "bar",

          data:
            data?.gender.map((item) => ({
              value: item.users,

              itemStyle: {
                color: CORES.amarelo,

                borderRadius: [4, 4, 0, 0],
              },
            })) ?? [],

          barMaxWidth: 70,

          label: {
            show: true,
            position: "top",
            color: CORES.marrom,
            fontWeight: "bold",
            formatter: "{c}",
          },
        },
      ],
    }),
    [data],
  );

  /*
   * ------------------------------------------------------
   * GRÁFICO 3
   * FAIXA ETÁRIA
   * ------------------------------------------------------
   */

  const ageOption = useMemo(
    () => ({
      title: {
        text: "Distribuição por faixa etária",

        left: 20,
        top: 10,

        textStyle: {
          color: CORES.marrom,
          fontSize: 18,
          fontWeight: "bold",
        },
      },

      tooltip: {
        trigger: "axis",

        axisPointer: {
          type: "shadow",
        },
      },

      grid: {
        left: 30,
        right: 30,
        top: 75,
        bottom: 70,
        containLabel: true,
      },

      xAxis: {
        type: "category",

        data: data?.ageGroups.map((item) => item.ageGroup) ?? [],

        axisLabel: {
          color: CORES.cinza,
          fontSize: 11,
          rotate: 30,
        },

        axisLine: {
          lineStyle: {
            color: CORES.cinzaClaro,
          },
        },

        axisTick: {
          show: false,
        },
      },

      yAxis: {
        type: "value",

        minInterval: 1,

        axisLabel: {
          color: CORES.cinza,
        },

        splitLine: {
          show: false,
        },

        axisLine: {
          show: false,
        },

        axisTick: {
          show: false,
        },
      },

      series: [
        {
          name: "Usuários",

          type: "bar",

          data:
            data?.ageGroups.map((item) => ({
              value: item.users,

              itemStyle: {
                color: CORES.amarelo,

                borderRadius: [4, 4, 0, 0],
              },
            })) ?? [],

          barMaxWidth: 60,

          label: {
            show: true,
            position: "top",
            color: CORES.marrom,
            fontWeight: "bold",
            formatter: "{c}",
          },
        },
      ],
    }),
    [data],
  );

  /*
   * ------------------------------------------------------
   * GRÁFICO 5
   * GANHOS
   * ------------------------------------------------------
   */

  const earningsOption = useMemo(
    () => ({
      title: {
        text: "Ganhos ao longo do tempo",

        left: 20,
        top: 10,

        textStyle: {
          color: CORES.marrom,
          fontSize: 18,
          fontWeight: "bold",
        },
      },

      tooltip: {
        trigger: "axis",

        valueFormatter: (value: number) =>
          value.toLocaleString("pt-BR", {
            style: "currency",

            currency: "BRL",
          }),
      },

      grid: {
        left: 30,
        right: 35,
        top: 75,
        bottom: 70,
        containLabel: true,
      },

      xAxis: {
        type: "category",

        data: data?.earningsOverTime.map((item) => item.period) ?? [],

        axisLabel: {
          rotate: 45,
          color: CORES.cinza,
        },

        axisTick: {
          show: false,
        },

        axisLine: {
          lineStyle: {
            color: CORES.cinzaClaro,
          },
        },
      },

      yAxis: {
        type: "value",

        axisLabel: {
          color: CORES.cinza,

          formatter: (value: number) =>
            `R$ ${Math.round(value / 1000).toLocaleString("pt-BR")} mil`,
        },

        splitLine: {
          show: false,
        },

        axisTick: {
          show: false,
        },

        axisLine: {
          show: false,
        },
      },

      series: [
        {
          name: "Ganhos",

          type: "line",

          smooth: true,

          symbol: "circle",

          symbolSize: 7,

          data: data?.earningsOverTime.map((item) => item.value) ?? [],

          lineStyle: {
            color: CORES.amarelo,
            width: 3,
          },

          itemStyle: {
            color: CORES.amarelo,
          },

          label: {
            show: true,

            position: "top",

            color: CORES.marrom,

            fontSize: 10,

            formatter: (params: { value: number }) =>
              `R$ ${Math.round(params.value / 1000).toLocaleString("pt-BR")}k`,
          },
        },
      ],
    }),
    [data],
  );

  /*
   * ------------------------------------------------------
   * GRÁFICO 6
   * GASTOS
   * ------------------------------------------------------
   */

  const expensesOption = useMemo(
    () => ({
      title: {
        text: "Gastos ao longo do tempo",

        left: 20,
        top: 10,

        textStyle: {
          color: CORES.marrom,
          fontSize: 18,
          fontWeight: "bold",
        },
      },

      tooltip: {
        trigger: "axis",

        valueFormatter: (value: number) =>
          value.toLocaleString("pt-BR", {
            style: "currency",

            currency: "BRL",
          }),
      },

      grid: {
        left: 30,
        right: 35,
        top: 75,
        bottom: 70,
        containLabel: true,
      },

      xAxis: {
        type: "category",

        data: data?.expensesOverTime.map((item) => item.period) ?? [],

        axisLabel: {
          rotate: 45,
          color: CORES.cinza,
        },

        axisTick: {
          show: false,
        },

        axisLine: {
          lineStyle: {
            color: CORES.cinzaClaro,
          },
        },
      },

      yAxis: {
        type: "value",

        axisLabel: {
          color: CORES.cinza,

          formatter: (value: number) =>
            `R$ ${Math.round(value / 1000).toLocaleString("pt-BR")} mil`,
        },

        splitLine: {
          show: false,
        },

        axisTick: {
          show: false,
        },

        axisLine: {
          show: false,
        },
      },

      series: [
        {
          name: "Gastos",

          type: "line",

          smooth: true,

          symbol: "circle",

          symbolSize: 7,

          data: data?.expensesOverTime.map((item) => item.value) ?? [],

          lineStyle: {
            color: CORES.marromMedio,
            width: 3,
          },

          itemStyle: {
            color: CORES.marromMedio,
          },

          label: {
            show: true,

            position: "top",

            color: CORES.marrom,

            fontSize: 10,

            formatter: (params: { value: number }) =>
              `R$ ${Math.round(params.value / 1000).toLocaleString("pt-BR")}k`,
          },
        },
      ],
    }),
    [data],
  );

  /*
   * ------------------------------------------------------
   * GRÁFICO 7
   * CATEGORIAS DE GASTOS
   * ------------------------------------------------------
   */

  const expenseCategoriesOption = useMemo(
    () => ({
      title: {
        text: "Top 5 categorias de gastos",

        left: 20,
        top: 10,

        textStyle: {
          color: CORES.marrom,

          fontSize: 18,

          fontWeight: "bold",
        },
      },

      tooltip: {
        trigger: "axis",

        axisPointer: {
          type: "shadow",
        },

        valueFormatter: (value: number) =>
          value.toLocaleString("pt-BR", {
            style: "currency",

            currency: "BRL",
          }),
      },

      grid: {
        left: 30,
        right: 100,
        top: 75,
        bottom: 35,
        containLabel: true,
      },

      xAxis: {
        type: "value",

        axisLabel: {
          color: CORES.cinza,

          formatter: (value: number) =>
            `R$ ${Math.round(value / 1000).toLocaleString("pt-BR")}k`,
        },

        splitLine: {
          show: false,
        },

        axisLine: {
          show: false,
        },

        axisTick: {
          show: false,
        },
      },

      yAxis: {
        type: "category",

        inverse: true,

        data:
          data?.expenseCategories.slice(0, 5).map((item) => item.category) ??
          [],

        axisLabel: {
          color: CORES.cinza,

          fontSize: 12,
        },

        axisTick: {
          show: false,
        },

        axisLine: {
          show: false,
        },
      },

      series: [
        {
          name: "Gastos",

          type: "bar",

          barMaxWidth: 38,

          data:
            data?.expenseCategories.slice(0, 5).map((item) => item.value) ?? [],

          itemStyle: {
            color: CORES.amarelo,

            borderRadius: [0, 4, 4, 0],
          },

          label: {
            show: true,

            position: "right",

            color: CORES.marrom,

            fontWeight: "bold",

            formatter: (params: { value: number }) =>
              params.value.toLocaleString("pt-BR", {
                style: "currency",

                currency: "BRL",

                maximumFractionDigits: 0,
              }),
          },
        },
      ],
    }),
    [data],
  );

  const companyTreemapOption = useMemo(() => {
    if (!data) {
      return {};
    }

    const logoStyles = Object.fromEntries(
      data.companyTreemap.map((company, index) => [
        `logo${index}`,
        {
          width: 80,
          height: 45,
          backgroundColor: {
            image: company.logo,
          },
        },
      ]),
    );

    return {
      tooltip: {
        formatter: (params: { name: string; value: number }) =>
          `${params.name}<br/>${params.value.toLocaleString("pt-BR")} usuários`,
      },

      series: [
        {
          type: "treemap",

          roam: false,

          nodeClick: false,

          breadcrumb: {
            show: false,
          },

          data: data.companyTreemap.map((company, index) => ({
            name: company.company,
            value: company.users,
            logoIndex: index,

            itemStyle: {
              color: "#FFFFFF",
              borderColor: "#E6E6E6",
              borderWidth: 2,
              gapWidth: 2,
            },
          })),

          label: {
            show: true,

            position: "inside",

            align: "center",

            verticalAlign: "middle",

            formatter: (params: {
              name: string;
              value: number;
              data: {
                logoIndex: number;
              };
            }) => {
              const index = params.data.logoIndex;

              return [
                `{logo${index}|}`,
                `{company|${params.name}}`,
                `{value|${params.value.toLocaleString("pt-BR")} usuários}`,
              ].join("\n");
            },

            rich: {
              ...logoStyles,

              company: {
                fontSize: 13,
                fontWeight: 700,
                color: "#441B00",
                lineHeight: 24,
                align: "center",
              },

              value: {
                fontSize: 12,
                color: "#666666",
                lineHeight: 18,
                align: "center",
              },
            },
          },

          upperLabel: {
            show: false,
          },

          levels: [
            {
              itemStyle: {
                borderColor: "#FFFFFF",
                borderWidth: 0,
                gapWidth: 3,
              },
            },

            {
              itemStyle: {
                borderColor: "#E6E6E6",
                borderWidth: 1,
                gapWidth: 3,
              },
            },
          ],
        },
      ],
    };
  }, [data]);

  /*
   * ------------------------------------------------------
   * RETORNOS CONDICIONAIS
   * ------------------------------------------------------
   */

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

  /*
   * ------------------------------------------------------
   * PÁGINA
   * ------------------------------------------------------
   */

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Apache ECharts</h2>

        <p className="text-sm text-neutral-600">
          Teste com base fictícia compartilhada entre as bibliotecas.
        </p>
      </div>

      {/* INDICADORES */}

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

      {/* USUÁRIOS */}

      <div className="rounded-lg border p-4">
        <ReactECharts
          option={usersOption}
          style={{
            width: "100%",
            height: "440px",
          }}
        />
      </div>

      {/* GÊNERO + IDADE */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-lg border p-4">
          <ReactECharts
            option={genderOption}
            style={{
              width: "100%",
              height: "420px",
            }}
          />
        </div>

        <div className="rounded-lg border p-4">
          <ReactECharts
            option={ageOption}
            style={{
              width: "100%",
              height: "420px",
            }}
          />
        </div>
      </div>

      {/* MAPA */}

      <div className="rounded-lg border p-4">
        <EChartsDrilldownMap data={data} />
      </div>

      {/* GANHOS */}

      <div className="rounded-lg border p-4">
        <ReactECharts
          option={earningsOption}
          style={{
            width: "100%",
            height: "460px",
          }}
        />
      </div>

      {/* GASTOS */}

      <div className="rounded-lg border p-4">
        <ReactECharts
          option={expensesOption}
          style={{
            width: "100%",
            height: "460px",
          }}
        />
      </div>

      {/* CATEGORIAS */}

      <div className="rounded-lg border p-4">
        <ReactECharts
          option={expenseCategoriesOption}
          style={{
            width: "100%",
            height: "430px",
          }}
        />
      </div>

      <div className="rounded-lg border p-4">
        <h3
          className="mb-6 text-lg font-bold"
          style={{
            color: CORES.marrom,
          }}
        >
          Usuários por empresa de aplicativo
        </h3>

        <ReactECharts
          option={companyTreemapOption}
          style={{
            height: "480px",
            width: "100%",
          }}
        />
      </div>
    </section>
  );
}
