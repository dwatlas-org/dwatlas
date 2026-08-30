import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { GeoJSON, MapContainer, useMap, useMapEvents } from "react-leaflet";

import L from "leaflet";

import type { Feature, GeoJsonObject, Geometry } from "geojson";

import "leaflet/dist/leaflet.css";

import type { ChartsData, GeoJsonFeatureCollection } from "../data/loader";

type LeafletDrilldownMapProps = {
  data: ChartsData;
};

type MapLevel = "country" | "state";

type NormalizedFeature = Feature<Geometry, Record<string, unknown>>;

const CORES = {
  amarelo: "#FDB917",
  amareloClaro: "#FFE8A3",
  marrom: "#441B00",
  marromMedio: "#8C4A00",
  cinza: "#666666",
  cinzaClaro: "#D9D9D9",
  fundoMapa: "#EFEFEF",
};

/*
 * O mapa do Brasil normalmente ficará
 * aproximadamente entre zoom 3 e 4.
 *
 * Ao chegar a 6, mudamos para municípios.
 */
const COUNTRY_DRILLDOWN_ZOOM = 6;

/*
 * Quando estivermos no estado e o usuário
 * afastar até este nível, voltamos ao Brasil.
 */
const STATE_RETURN_ZOOM = 4.5;

/*
 * ------------------------------------------------------
 * CARREGAMENTO
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
 * NOMES DOS POLÍGONOS
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

function normalizeGeoJson(
  geoJson: GeoJsonFeatureCollection,
): GeoJsonFeatureCollection {
  return {
    ...geoJson,

    features: geoJson.features.map((feature) => {
      const properties = {
        ...feature.properties,
      };

      const name = getFeatureName(properties);

      if (name) {
        properties.name = name;
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
 * Usamos o centro real do Leaflet para descobrir
 * em qual estado o usuário está navegando.
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

  if (!pointInRing(point, outerRing)) {
    return false;
  }

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
  feature: NormalizedFeature,
): boolean {
  const geometry = feature.geometry;

  if (geometry.type === "Polygon") {
    return pointInPolygon(point, geometry.coordinates as number[][][]);
  }

  if (geometry.type === "MultiPolygon") {
    return (geometry.coordinates as number[][][][]).some((polygon) =>
      pointInPolygon(point, polygon),
    );
  }

  return false;
}

/*
 * ------------------------------------------------------
 * ESCALA DE COR
 *
 * Mesma identidade visual usada no ECharts.
 * ------------------------------------------------------
 */

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");

  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) => Math.round(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

function interpolateColor(
  colorA: string,
  colorB: string,
  ratio: number,
): string {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);

  return rgbToHex(
    a.r + (b.r - a.r) * ratio,
    a.g + (b.g - a.g) * ratio,
    a.b + (b.b - a.b) * ratio,
  );
}

function getColor(value: number | undefined, max: number): string {
  if (value === undefined || value <= 0) {
    return CORES.fundoMapa;
  }

  const ratio = Math.min(value / max, 1);

  const stops = [
    CORES.fundoMapa,
    CORES.amareloClaro,
    CORES.amarelo,
    CORES.marromMedio,
  ];

  const scaled = ratio * (stops.length - 1);

  const lowerIndex = Math.floor(scaled);

  const upperIndex = Math.min(lowerIndex + 1, stops.length - 1);

  const localRatio = scaled - lowerIndex;

  return interpolateColor(stops[lowerIndex], stops[upperIndex], localRatio);
}

/*
 * ------------------------------------------------------
 * CONTROLADOR DO MAPA
 *
 * Esta parte usa diretamente a API do Leaflet.
 * ------------------------------------------------------
 */

type MapControllerProps = {
  geoJson: GeoJsonFeatureCollection;

  mapLevel: MapLevel;

  countryGeoJson: GeoJsonFeatureCollection | null;

  availableStates: Set<string>;

  transitionLockRef: React.MutableRefObject<boolean>;

  onOpenState: (stateCode: string) => void;

  onReturnToCountry: () => void;
};

function MapController({
  geoJson,
  mapLevel,
  countryGeoJson,
  availableStates,
  transitionLockRef,
  onOpenState,
  onReturnToCountry,
}: MapControllerProps) {
  const map = useMap();

  /*
   * Sempre que trocamos de GeoJSON,
   * enquadramos automaticamente a geometria.
   */
  useEffect(() => {
    const layer = L.geoJSON(geoJson as GeoJsonObject);

    const bounds = layer.getBounds();

    if (!bounds.isValid()) {
      return;
    }

    transitionLockRef.current = true;

    map.fitBounds(bounds, {
      padding: [25, 25],
      animate: false,
    });

    window.setTimeout(() => {
      transitionLockRef.current = false;
    }, 350);
  }, [geoJson, map, transitionLockRef]);

  /*
   * Descobre qual estado contém
   * o centro atual do mapa.
   */
  const findStateAtCenter = useCallback(() => {
    if (!countryGeoJson) {
      return null;
    }

    const center = map.getCenter();

    const point: [number, number] = [center.lng, center.lat];

    for (const rawFeature of countryGeoJson.features) {
      const feature = rawFeature as unknown as NormalizedFeature;

      if (!pointInFeature(point, feature)) {
        continue;
      }

      const stateCode = feature.properties["SIGLA_UF"];

      if (typeof stateCode === "string") {
        return stateCode;
      }
    }

    return null;
  }, [countryGeoJson, map]);

  const evaluateScale = useCallback(() => {
    if (transitionLockRef.current) {
      return;
    }

    const zoom = map.getZoom();

    /*
     * BRASIL → MUNICÍPIOS
     */
    if (mapLevel === "country" && zoom >= COUNTRY_DRILLDOWN_ZOOM) {
      const stateCode = findStateAtCenter();

      if (!stateCode || !availableStates.has(stateCode)) {
        return;
      }

      onOpenState(stateCode);

      return;
    }

    /*
     * MUNICÍPIOS → BRASIL
     */
    if (mapLevel === "state" && zoom <= STATE_RETURN_ZOOM) {
      onReturnToCountry();
    }
  }, [
    availableStates,
    findStateAtCenter,
    map,
    mapLevel,
    onOpenState,
    onReturnToCountry,
    transitionLockRef,
  ]);

  /*
   * Leaflet possui eventos próprios para
   * término do zoom e do movimento.
   */
  useMapEvents({
    zoomend: evaluateScale,
    moveend: evaluateScale,
  });

  return null;
}

/*
 * ------------------------------------------------------
 * COMPONENTE PRINCIPAL
 * ------------------------------------------------------
 */

export function LeafletDrilldownMap({ data }: LeafletDrilldownMapProps) {
  const transitionLockRef = useRef(false);

  const [countryGeoJson, setCountryGeoJson] =
    useState<GeoJsonFeatureCollection | null>(null);

  const [activeGeoJson, setActiveGeoJson] =
    useState<GeoJsonFeatureCollection | null>(null);

  const [mapLevel, setMapLevel] = useState<MapLevel>("country");

  const [selectedStateCode, setSelectedStateCode] = useState<string | null>(
    null,
  );

  const [selectedStateName, setSelectedStateName] = useState<string | null>(
    null,
  );

  const [loadingMap, setLoadingMap] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /*
   * Cache dos mapas municipais.
   */
  const stateMapCacheRef = useRef<Record<string, GeoJsonFeatureCollection>>({});

  /*
   * --------------------------------------------------
   * CARREGAMENTO INICIAL DO BRASIL
   * --------------------------------------------------
   */

  useEffect(() => {
    async function loadCountry() {
      try {
        setLoadingMap(true);

        setError(null);

        const result = await loadGeoJson(data.mapDrilldown.countryMap);

        const normalized = normalizeGeoJson(result);

        setCountryGeoJson(normalized);

        setActiveGeoJson(normalized);
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

    void loadCountry();
  }, [data.mapDrilldown.countryMap]);

  /*
   * --------------------------------------------------
   * ESTADOS DISPONÍVEIS
   * --------------------------------------------------
   */

  const availableStates = useMemo(
    () => new Set(Object.keys(data.mapDrilldown.states)),
    [data.mapDrilldown.states],
  );

  /*
   * --------------------------------------------------
   * ABRIR ESTADO
   * --------------------------------------------------
   */

  const openState = useCallback(
    async (stateCode: string) => {
      const config = data.mapDrilldown.states[stateCode];

      if (!config || transitionLockRef.current) {
        return;
      }

      transitionLockRef.current = true;

      try {
        setLoadingMap(true);
        setError(null);

        let geoJson = stateMapCacheRef.current[stateCode];

        if (!geoJson) {
          const loaded = await loadGeoJson(config.municipalityMap);

          geoJson = normalizeGeoJson(loaded);

          stateMapCacheRef.current[stateCode] = geoJson;
        }

        setSelectedStateCode(stateCode);

        setSelectedStateName(config.name);

        setMapLevel("state");

        setActiveGeoJson(geoJson);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error ? err.message : `Erro ao carregar ${stateCode}.`,
        );

        transitionLockRef.current = false;
      } finally {
        setLoadingMap(false);
      }
    },
    [data.mapDrilldown.states],
  );

  /*
   * --------------------------------------------------
   * VOLTAR
   * --------------------------------------------------
   */

  const returnToCountry = useCallback(() => {
    if (!countryGeoJson) {
      return;
    }

    transitionLockRef.current = true;

    setMapLevel("country");

    setSelectedStateCode(null);

    setSelectedStateName(null);

    setActiveGeoJson(countryGeoJson);
  }, [countryGeoJson]);

  /*
   * --------------------------------------------------
   * VALORES DO MAPA
   * --------------------------------------------------
   */

  const valuesByName = useMemo(() => {
    const values = new Map<string, number>();

    if (mapLevel === "country") {
      for (const state of data.states) {
        values.set(state.state, state.users);
      }

      return values;
    }

    if (!selectedStateCode) {
      return values;
    }

    const cities = data.citiesByState[selectedStateCode] ?? [];

    for (const city of cities) {
      if (city.city === "Outros municípios") {
        continue;
      }

      values.set(city.city, city.users);
    }

    return values;
  }, [data.citiesByState, data.states, mapLevel, selectedStateCode]);

  const maximumValue = useMemo(() => {
    const values = [...valuesByName.values()];

    return Math.max(...values, 1);
  }, [valuesByName]);

  /*
   * --------------------------------------------------
   * ESTILO DAS ÁREAS
   * --------------------------------------------------
   */

  const styleFeature = useCallback(
    (feature: Feature | undefined) => {
      if (!feature) {
        return {};
      }

      const properties = feature.properties as Record<string, unknown>;

      const name = getFeatureName(properties);

      const value = name ? valuesByName.get(name) : undefined;

      return {
        fillColor: getColor(value, maximumValue),

        fillOpacity: 0.88,

        color: "#FFFFFF",

        weight: mapLevel === "country" ? 1.2 : 0.8,
      };
    },
    [mapLevel, maximumValue, valuesByName],
  );

  /*
   * --------------------------------------------------
   * INTERAÇÃO DAS FEIÇÕES
   * --------------------------------------------------
   */

  const onEachFeature = useCallback(
    (feature: Feature, layer: L.Layer) => {
      const properties = feature.properties as Record<string, unknown>;

      const name = getFeatureName(properties);

      if (!name) {
        return;
      }

      const value = valuesByName.get(name);

      const tooltip =
        value === undefined
          ? `<strong>${name}</strong><br />Sem dados`
          : `<strong>${name}</strong><br />${value.toLocaleString(
              "pt-BR",
            )} usuários`;

      layer.bindTooltip(tooltip, {
        sticky: true,
      });

      /*
       * Clique continua disponível como
       * alternativa ao zoom.
       */
      if (mapLevel === "country") {
        layer.on("click", () => {
          const stateCode = properties["SIGLA_UF"];

          if (typeof stateCode !== "string") {
            return;
          }

          if (!availableStates.has(stateCode)) {
            return;
          }

          void openState(stateCode);
        });
      }

      /*
       * Hover.
       */
      layer.on({
        mouseover: (event) => {
          const target = event.target as L.Path;

          target.setStyle({
            weight: 2,
            color: CORES.marrom,
          });

          target.bringToFront();
        },

        mouseout: (event) => {
          const target = event.target as L.Path;

          target.setStyle(styleFeature(feature));
        },
      });
    },
    [availableStates, mapLevel, openState, styleFeature, valuesByName],
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
            Distribuição geográfica dos usuários — Leaflet
          </h3>

          <p className="mt-1 max-w-2xl text-sm text-neutral-500">
            {mapLevel === "country"
              ? "Aproxime o mapa sobre São Paulo, Rio de Janeiro ou Minas Gerais. Ao atingir o nível de zoom, o mapa muda para os municípios."
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

      <div className="mb-3 flex items-center gap-2 text-sm">
        <span
          className={
            mapLevel === "country" ? "font-semibold" : "text-neutral-500"
          }
        >
          Brasil
        </span>

        {mapLevel === "state" && selectedStateName && (
          <>
            <span className="text-neutral-400">/</span>

            <span className="font-semibold">{selectedStateName}</span>
          </>
        )}
      </div>

      <div className="mb-3 rounded-md bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
        {mapLevel === "country"
          ? `Drill-down automático a partir do zoom ${COUNTRY_DRILLDOWN_ZOOM}.`
          : `Reduza o zoom até aproximadamente ${STATE_RETURN_ZOOM} para retornar ao Brasil.`}
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="relative h-[560px] overflow-hidden rounded-md">
        {activeGeoJson && (
          <MapContainer
            center={[-14.5, -52]}
            zoom={4}
            minZoom={3}
            maxZoom={12}
            zoomSnap={0.25}
            zoomDelta={0.5}
            scrollWheelZoom
            style={{
              width: "100%",
              height: "100%",
              background: "#FFFFFF",
            }}
          >
            <MapController
              geoJson={activeGeoJson}
              mapLevel={mapLevel}
              countryGeoJson={countryGeoJson}
              availableStates={availableStates}
              transitionLockRef={transitionLockRef}
              onOpenState={(code) => {
                void openState(code);
              }}
              onReturnToCountry={returnToCountry}
            />

            <GeoJSON
              key={`${mapLevel}-${selectedStateCode ?? "BR"}`}
              data={activeGeoJson as GeoJsonObject}
              style={styleFeature}
              onEachFeature={onEachFeature}
            />
          </MapContainer>
        )}

        {loadingMap && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/70">
            <div className="rounded-md border bg-white px-4 py-3 text-sm shadow-sm">
              Carregando mapa...
            </div>
          </div>
        )}
      </div>

      {mapLevel === "country" && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-neutral-500">
            Drill-down disponível:
          </p>

          <div className="flex flex-wrap gap-2">
            {data.states
              .filter((state) => availableStates.has(state.code))
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
    </div>
  );
}
