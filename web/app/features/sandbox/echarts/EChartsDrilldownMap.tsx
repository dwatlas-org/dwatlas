import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import type { EChartsType } from "echarts";

import type { ChartsData, GeoJsonFeatureCollection } from "../data/loader";

type EChartsDrilldownMapProps = {
  data: ChartsData;
};

type MapLevel = "country" | "state";

type MapClickParams = {
  name?: string;
  value?: number;

  data?: {
    name?: string;
    value?: number;
    code?: string;
  };
};

type GeoJsonGeometry = {
  type?: string;
  coordinates?: unknown;
};

type GeoJsonFeature = {
  properties: Record<string, unknown>;
  geometry: GeoJsonGeometry;
};

const CORES = {
  amarelo: "#FDB917",
  amareloClaro: "#FFE8A3",
  marrom: "#441B00",
  marromMedio: "#8C4A00",
  cinza: "#666666",
  cinzaClaro: "#D9D9D9",
  fundoMapa: "#EFEFEF",
};

const COUNTRY_MAP_NAME = "BrasilEstados";

/*
 * Quando o zoom do mapa nacional chegar a este valor,
 * tentamos identificar qual estado está no centro.
 */
const COUNTRY_DRILLDOWN_ZOOM = 2.25;

/*
 * No mapa municipal permitimos reduzir o zoom abaixo
 * de 1. Quando chegar a este valor, voltamos ao Brasil.
 */
const STATE_RETURN_ZOOM = 0.78;

/*
 * ------------------------------------------------------
 * CARREGAMENTO DE GEOJSON
 * ------------------------------------------------------
 */

async function loadGeoJson(path: string): Promise<GeoJsonFeatureCollection> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(
      `Erro ao carregar ${path}: ${response.status} ${response.statusText}`,
    );
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error(`O arquivo ${path} não retornou JSON.`);
  }

  return response.json() as Promise<GeoJsonFeatureCollection>;
}

/*
 * ------------------------------------------------------
 * NOME DAS FEIÇÕES
 * ------------------------------------------------------
 */

function getFeatureName(properties: Record<string, unknown>): string | null {
  const possibleKeys = [
    "name",
    "NM_UF",
    "NM_MUN",
    "NM_MUNICIP",
    "NM_MUNICIPIO",
    "municipio",
    "Município",
    "NAME",
  ];

  for (const key of possibleKeys) {
    const value = properties[key];

    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }
  }

  return null;
}

/*
 * ------------------------------------------------------
 * NORMALIZAÇÃO
 *
 * O ECharts usa properties.name por padrão.
 * Mantemos todas as propriedades originais e
 * acrescentamos "name".
 * ------------------------------------------------------
 */

function normalizeGeoJson(
  geoJson: GeoJsonFeatureCollection,
): GeoJsonFeatureCollection {
  return {
    ...geoJson,

    features: geoJson.features.map((feature) => {
      const properties = {
        ...feature.properties,
      };

      const featureName = getFeatureName(properties);

      if (featureName) {
        properties.name = featureName;
      }

      return {
        ...feature,
        properties,
      };
    }),
  };
}

/*
 * ------------------------------------------------------
 * POINT IN POLYGON
 *
 * Precisamos descobrir em qual estado está o ponto
 * central do mapa.
 *
 * O algoritmo abaixo testa se uma coordenada
 * longitude/latitude está dentro de um polígono.
 * ------------------------------------------------------
 */

function pointInRing(point: [number, number], ring: number[][]): boolean {
  const [x, y] = point;

  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i]?.[0];
    const yi = ring[i]?.[1];

    const xj = ring[j]?.[0];
    const yj = ring[j]?.[1];

    if (
      xi === undefined ||
      yi === undefined ||
      xj === undefined ||
      yj === undefined
    ) {
      continue;
    }

    const intersects =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function pointInPolygon(
  point: [number, number],
  polygon: number[][][],
): boolean {
  const outerRing = polygon[0];

  if (!outerRing) {
    return false;
  }

  /*
   * Primeiro precisa estar dentro do
   * anel externo.
   */
  if (!pointInRing(point, outerRing)) {
    return false;
  }

  /*
   * Se estiver dentro de um "buraco"
   * do polígono, consideramos fora.
   */
  for (let i = 1; i < polygon.length; i++) {
    const hole = polygon[i];

    if (hole && pointInRing(point, hole)) {
      return false;
    }
  }

  return true;
}

function pointInFeature(
  point: [number, number],
  feature: GeoJsonFeature,
): boolean {
  const { type, coordinates } = feature.geometry;

  if (type === "Polygon" && Array.isArray(coordinates)) {
    return pointInPolygon(point, coordinates as number[][][]);
  }

  if (type === "MultiPolygon" && Array.isArray(coordinates)) {
    const multiPolygon = coordinates as number[][][][];

    return multiPolygon.some((polygon) => pointInPolygon(point, polygon));
  }

  return false;
}

/*
 * ------------------------------------------------------
 * COMPONENTE
 * ------------------------------------------------------
 */

export function EChartsDrilldownMap({ data }: EChartsDrilldownMapProps) {
  const chartRef = useRef<EChartsType | null>(null);

  /*
   * Guardamos o GeoJSON nacional porque ele será
   * usado para descobrir qual estado contém o
   * ponto central da tela.
   */
  const countryGeoJsonRef = useRef<GeoJsonFeatureCollection | null>(null);

  /*
   * Evita vários drill-downs simultâneos enquanto
   * o usuário continua movimentando a roda do mouse.
   */
  const transitionLockRef = useRef(false);

  /*
   * Cache simples dos mapas municipais já registrados.
   */
  const registeredStateMapsRef = useRef<Set<string>>(new Set());

  const [mapLevel, setMapLevel] = useState<MapLevel>("country");

  const [selectedStateCode, setSelectedStateCode] = useState<string | null>(
    null,
  );

  const [selectedStateName, setSelectedStateName] = useState<string | null>(
    null,
  );

  const [activeMapName, setActiveMapName] = useState(COUNTRY_MAP_NAME);

  const [countryMapReady, setCountryMapReady] = useState(false);

  const [loadingMap, setLoadingMap] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /*
   * --------------------------------------------------
   * CARREGAMENTO DO BRASIL
   * --------------------------------------------------
   */

  useEffect(() => {
    async function registerCountryMap() {
      try {
        setLoadingMap(true);
        setError(null);

        const geoJson = await loadGeoJson(data.mapDrilldown.countryMap);

        const normalized = normalizeGeoJson(geoJson);

        countryGeoJsonRef.current = normalized;

        echarts.registerMap(COUNTRY_MAP_NAME, normalized as never);

        setCountryMapReady(true);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar o mapa do Brasil.",
        );
      } finally {
        setLoadingMap(false);
      }
    }

    void registerCountryMap();
  }, [data.mapDrilldown.countryMap]);

  /*
   * --------------------------------------------------
   * MUNICÍPIOS ATUAIS
   * --------------------------------------------------
   */

  const currentCities = useMemo(() => {
    if (!selectedStateCode) {
      return [];
    }

    return data.citiesByState[selectedStateCode] ?? [];
  }, [data.citiesByState, selectedStateCode]);

  /*
   * --------------------------------------------------
   * ESCALA DE CORES
   * --------------------------------------------------
   */

  const maximumValue = useMemo(() => {
    if (mapLevel === "country") {
      return Math.max(...data.states.map((state) => state.users), 1);
    }

    const mappedCities = currentCities.filter(
      (city) => city.city !== "Outros municípios",
    );

    return Math.max(...mappedCities.map((city) => city.users), 1);
  }, [currentCities, data.states, mapLevel]);

  /*
   * --------------------------------------------------
   * VOLTAR AO BRASIL
   * --------------------------------------------------
   */

  const returnToCountry = useCallback(() => {
    transitionLockRef.current = true;

    setMapLevel("country");

    setSelectedStateCode(null);
    setSelectedStateName(null);

    setActiveMapName(COUNTRY_MAP_NAME);

    setError(null);

    /*
     * Pequeno intervalo para impedir que o
     * georoam anterior faça outro drill-down
     * imediatamente.
     */
    window.setTimeout(() => {
      transitionLockRef.current = false;
    }, 300);
  }, []);

  /*
   * --------------------------------------------------
   * ABRIR ESTADO
   * --------------------------------------------------
   */

  const openState = useCallback(
    async (stateCode: string) => {
      const stateConfig = data.mapDrilldown.states[stateCode];

      if (!stateConfig || transitionLockRef.current) {
        return;
      }

      transitionLockRef.current = true;

      try {
        setLoadingMap(true);
        setError(null);

        const mapName = `Municipios-${stateCode}`;

        /*
         * Se já carregamos esse estado antes,
         * não precisamos fazer outro fetch.
         */
        if (!registeredStateMapsRef.current.has(stateCode)) {
          const geoJson = await loadGeoJson(stateConfig.municipalityMap);

          const normalized = normalizeGeoJson(geoJson);

          echarts.registerMap(mapName, normalized as never);

          registeredStateMapsRef.current.add(stateCode);
        }

        setSelectedStateCode(stateCode);

        setSelectedStateName(stateConfig.name);

        setActiveMapName(mapName);

        setMapLevel("state");
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : `Erro ao carregar municípios de ${stateCode}.`,
        );
      } finally {
        setLoadingMap(false);

        window.setTimeout(() => {
          transitionLockRef.current = false;
        }, 300);
      }
    },
    [data.mapDrilldown.states],
  );

  /*
   * --------------------------------------------------
   * DESCOBRIR ESTADO NO CENTRO DO MAPA
   * --------------------------------------------------
   */

  const findStateAtMapCenter = useCallback((): string | null => {
    const chart = chartRef.current;

    const geoJson = countryGeoJsonRef.current;

    if (!chart || !geoJson) {
      return null;
    }

    const width = chart.getWidth();

    const height = chart.getHeight();

    /*
     * Centro visual do componente.
     */
    const centerPixel: [number, number] = [width / 2, height / 2];

    /*
     * Converte pixel do canvas para
     * longitude/latitude do mapa.
     */
    const coordinate = chart.convertFromPixel(
      {
        seriesIndex: 0,
      },
      centerPixel,
    );

    if (!Array.isArray(coordinate) || coordinate.length < 2) {
      return null;
    }

    const longitude = Number(coordinate[0]);

    const latitude = Number(coordinate[1]);

    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
      return null;
    }

    const point: [number, number] = [longitude, latitude];

    for (const rawFeature of geoJson.features) {
      const feature = rawFeature as unknown as GeoJsonFeature;

      if (!pointInFeature(point, feature)) {
        continue;
      }

      const stateCode = feature.properties["SIGLA_UF"];

      if (typeof stateCode === "string") {
        return stateCode;
      }
    }

    return null;
  }, []);

  /*
   * --------------------------------------------------
   * ZOOM ATUAL DO ECHARTS
   * --------------------------------------------------
   */

  const getCurrentZoom = useCallback(() => {
    const chart = chartRef.current;

    if (!chart) {
      return 1;
    }

    const option = chart.getOption() as {
      series?: Array<{
        zoom?: number;
      }>;
    };

    const zoom = option.series?.[0]?.zoom;

    return typeof zoom === "number" ? zoom : 1;
  }, []);

  /*
   * --------------------------------------------------
   * ZOOM / PAN
   * --------------------------------------------------
   */

  const handleGeoRoam = useCallback(() => {
    if (transitionLockRef.current) {
      return;
    }

    const zoom = getCurrentZoom();

    /*
     * ------------------------------------------
     * NÍVEL BRASIL
     *
     * Se o zoom ultrapassou o limiar,
     * descobrimos qual estado está no centro.
     * ------------------------------------------
     */

    if (mapLevel === "country" && zoom >= COUNTRY_DRILLDOWN_ZOOM) {
      const stateCode = findStateAtMapCenter();

      if (!stateCode) {
        return;
      }

      /*
       * Só abrimos estados que possuem
       * GeoJSON municipal configurado.
       *
       * Atualmente:
       * SP, RJ e MG.
       */
      if (!data.mapDrilldown.states[stateCode]) {
        return;
      }

      void openState(stateCode);

      return;
    }

    /*
     * ------------------------------------------
     * NÍVEL MUNICIPAL
     *
     * Quando o usuário reduz suficientemente
     * o zoom, retornamos ao Brasil.
     * ------------------------------------------
     */

    if (mapLevel === "state" && zoom <= STATE_RETURN_ZOOM) {
      returnToCountry();
    }
  }, [
    data.mapDrilldown.states,
    findStateAtMapCenter,
    getCurrentZoom,
    mapLevel,
    openState,
    returnToCountry,
  ]);

  /*
   * --------------------------------------------------
   * CLIQUE
   *
   * Mantemos o comportamento anterior como uma
   * segunda forma de entrar no estado.
   * --------------------------------------------------
   */

  const handleMapClick = useCallback(
    (params: MapClickParams) => {
      if (mapLevel !== "country") {
        return;
      }

      const stateCode = params.data?.code;

      if (!stateCode) {
        return;
      }

      void openState(stateCode);
    },
    [mapLevel, openState],
  );

  /*
   * --------------------------------------------------
   * OPÇÃO DO MAPA
   * --------------------------------------------------
   */

  const mapOption = useMemo(() => {
    const mapData =
      mapLevel === "country"
        ? data.states.map((state) => ({
            name: state.state,
            value: state.users,
            code: state.code,
          }))
        : currentCities
            .filter((city) => city.city !== "Outros municípios")
            .map((city) => ({
              name: city.city,
              value: city.users,
            }));

    return {
      animationDuration: 450,

      tooltip: {
        trigger: "item",

        formatter: (params: MapClickParams) => {
          const name = params.name ?? "Área";

          const value = params.value;

          if (
            value === undefined ||
            value === null ||
            Number.isNaN(Number(value))
          ) {
            return `
                                <strong>${name}</strong>
                                <br />
                                Sem dados
                            `;
          }

          return `
                            <strong>${name}</strong>
                            <br />
                            ${Number(value).toLocaleString("pt-BR")} usuários
                        `;
        },
      },

      visualMap: {
        min: 0,
        max: maximumValue,

        left: 20,
        bottom: 20,

        orient: "vertical",

        calculable: false,

        text: ["Mais usuários", "Menos usuários"],

        textStyle: {
          color: CORES.cinza,
          fontSize: 11,
        },

        inRange: {
          color: [
            CORES.fundoMapa,
            CORES.amareloClaro,
            CORES.amarelo,
            CORES.marromMedio,
          ],
        },
      },

      series: [
        {
          name: "Usuários",

          type: "map",

          map: activeMapName,

          /*
           * Muito importante:
           * o novo mapa sempre começa
           * em zoom 1.
           */
          zoom: 1,

          roam: true,

          scaleLimit:
            mapLevel === "country"
              ? {
                  min: 1,
                  max: 8,
                }
              : {
                  /*
                   * Permitimos diminuir
                   * abaixo de 1 para que
                   * o zoom-out possa voltar
                   * ao Brasil.
                   */
                  min: 0.65,
                  max: 12,
                },

          data: mapData,

          itemStyle: {
            areaColor: CORES.fundoMapa,

            borderColor: "#FFFFFF",

            borderWidth: mapLevel === "country" ? 1.2 : 0.8,
          },

          emphasis: {
            itemStyle: {
              areaColor: CORES.amarelo,
            },

            label: {
              show: true,

              color: CORES.marrom,

              fontWeight: 700,
            },
          },

          select: {
            disabled: true,
          },

          label: {
            show: mapLevel === "country",

            color: CORES.marrom,

            fontSize: 9,

            formatter: (params: { name?: string }) => params.name ?? "",
          },
        },
      ],
    };
  }, [activeMapName, currentCities, data.states, mapLevel, maximumValue]);

  /*
   * --------------------------------------------------
   * ESTADOS DISPONÍVEIS
   * --------------------------------------------------
   */

  const drilldownStateCodes = useMemo(
    () => new Set(Object.keys(data.mapDrilldown.states)),
    [data.mapDrilldown.states],
  );

  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3
            className="text-lg font-bold"
            style={{
              color: CORES.marrom,
            }}
          >
            Distribuição geográfica dos usuários
          </h3>

          <p className="mt-1 max-w-2xl text-sm text-neutral-500">
            {mapLevel === "country"
              ? "Aproxime o mapa e posicione SP, RJ ou MG no centro. Ao atingir o nível de zoom, o mapa muda automaticamente para os municípios."
              : `Visualizando os municípios de ${selectedStateName}. Afaste o mapa para retornar ao Brasil.`}
          </p>
        </div>

        {mapLevel === "state" && (
          <button
            type="button"
            onClick={returnToCountry}
            className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-neutral-50"
          >
            ← Voltar ao Brasil
          </button>
        )}
      </div>

      {/* BREADCRUMB */}

      <div className="mb-4 flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={returnToCountry}
          disabled={mapLevel === "country"}
          className={
            mapLevel === "country"
              ? "font-semibold text-neutral-900"
              : "text-neutral-500 underline"
          }
        >
          Brasil
        </button>

        {mapLevel === "state" && selectedStateName && (
          <>
            <span className="text-neutral-400">/</span>

            <span className="font-semibold">{selectedStateName}</span>
          </>
        )}
      </div>

      {/* INSTRUÇÃO DE ZOOM */}

      <div className="mb-3 rounded-md bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
        {mapLevel === "country"
          ? `Zoom para municípios a partir de ${COUNTRY_DRILLDOWN_ZOOM}×. O estado precisa estar no centro do mapa.`
          : `Reduza o zoom para aproximadamente ${STATE_RETURN_ZOOM}× para retornar ao Brasil.`}
      </div>

      {/* ERRO */}

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* MAPA */}

      <div className="relative h-[560px] w-full">
        {countryMapReady && (
          <ReactECharts
            /*
             * A key força uma nova instância
             * visual quando trocamos de mapa.
             * Isso evita herdar o zoom do
             * nível anterior.
             */
            key={activeMapName}
            option={mapOption}
            style={{
              height: "100%",
              width: "100%",
            }}
            notMerge
            lazyUpdate
            onChartReady={(chart) => {
              chartRef.current = chart;
            }}
            onEvents={{
              click: handleMapClick,

              /*
               * Disparado quando o usuário
               * faz zoom ou pan no mapa.
               */
              georoam: handleGeoRoam,
            }}
          />
        )}

        {loadingMap && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <div className="rounded-md border bg-white px-4 py-3 text-sm shadow-sm">
              Carregando mapa...
            </div>
          </div>
        )}
      </div>

      {/* ATALHOS */}

      {mapLevel === "country" && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-neutral-500">
            Drill-down disponível:
          </p>

          <div className="flex flex-wrap gap-2">
            {data.states
              .filter((state) => drilldownStateCodes.has(state.code))
              .map((state) => (
                <button
                  key={state.code}
                  type="button"
                  onClick={() => void openState(state.code)}
                  className="rounded-full border px-3 py-1 text-xs hover:bg-neutral-50"
                >
                  {state.state}
                </button>
              ))}
          </div>
        </div>
      )}

      {mapLevel === "state" && selectedStateCode && (
        <p className="mt-4 text-xs text-neutral-500">
          Municípios sem registros permanecem sem valor associado. “Outros
          municípios” participa do total estadual, mas não corresponde a um
          polígono específico.
        </p>
      )}
    </div>
  );
}
