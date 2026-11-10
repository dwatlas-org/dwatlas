"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RotateCcw } from "lucide-react";

import brazilStatesGeoJson from "@/assets/brazil-states.json";
import { Spinner } from "@/components/ui/spinner";
import type { PanelChartPoint } from "@/lib/api";

type StateHoverInfo = {
  uf: string;
  name: string;
  userCount: number | null;
  label: string;
};

const LEGEND_ITEMS = [
  { label: "10 – 1.000", color: "#fbd590" },
  { label: "1.001 – 5.000", color: "#f8aa77" },
  { label: "5.001 – 10.000", color: "#ee7f7b" },
  { label: "10.001 – 20.000", color: "#d96c87" },
  { label: "20.001 – 50.000", color: "#c85d9b" },
  { label: "50.001 – 100.000", color: "#9f59a1" },
  { label: "100.001+", color: "#784d91" },
  { label: "< 5 (insufficient)", color: "#d1d5db" },
];

const BRAZIL_BOUNDS: L.LatLngBoundsExpression = [
  [-34.0, -74.0],
  [5.5, -34.5],
];

export function BrazilChoroplethMap({
  data = [],
  isLoading = false,
  error = null,
}: {
  data?: PanelChartPoint[];
  isLoading?: boolean;
  error?: string | null;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);

  const [hoveredState, setHoveredState] = useState<StateHoverInfo | null>(null);

  // Map of UF -> data row
  const dataByUf = useMemo(() => {
    const map = new Map<
      string,
      {
        bin_index: number;
        uf: string;
        state_name: string;
        user_count: number | null;
        label: string;
        color: string;
      }
    >();

    for (const item of data) {
      const uf = String(item.uf ?? "").toUpperCase();
      if (uf) {
        map.set(uf, {
          bin_index: Number(item.bin_index ?? 0),
          uf,
          state_name: String(item.state_name ?? uf),
          user_count: item.user_count != null ? Number(item.user_count) : null,
          label: String(item.label ?? "insufficient data"),
          color: String(item.color ?? "#d1d5db"),
        });
      }
    }
    return map;
  }, [data]);

  // Keep a ref to dataByUf for event handlers
  const dataByUfRef = useRef(dataByUf);
  dataByUfRef.current = dataByUf;

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: true,
      dragging: true,
      minZoom: 3.5,
      maxZoom: 7,
      maxBounds: [
        [-38.0, -80.0],
        [10.0, -30.0],
      ],
      maxBoundsViscosity: 0.7,
    });

    // Add zoom controls to the bottom right (matching reference design)
    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(map);

    map.fitBounds(BRAZIL_BOUNDS, { padding: [10, 10] });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update GeoJSON layer when dataByUf changes or map is initialized
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (geojsonLayerRef.current) {
      map.removeLayer(geojsonLayerRef.current);
      geojsonLayerRef.current = null;
    }

    const geojsonLayer = L.geoJSON(
      brazilStatesGeoJson as unknown as GeoJSON.GeoJsonObject,
      {
        style: (feature) => {
          const sigla = String(feature?.properties?.sigla ?? "").toUpperCase();
          const info = dataByUfRef.current.get(sigla);
          const color = info?.color ?? "#d1d5db";

          return {
            fillColor: color,
            weight: 1.5,
            opacity: 1,
            color: "#ffffff",
            fillOpacity: 1,
          };
        },
        onEachFeature: (feature, layer) => {
          const sigla = String(feature?.properties?.sigla ?? "").toUpperCase();
          const fallbackName = String(feature?.properties?.name ?? sigla);

          layer.on({
            mouseover: (e: L.LeafletMouseEvent) => {
              const info = dataByUfRef.current.get(sigla);
              setHoveredState({
                uf: sigla,
                name: info?.state_name ?? fallbackName,
                userCount: info?.user_count ?? null,
                label: info?.label ?? "insufficient data",
              });

              const target = e.target as L.Path;
              target.setStyle({
                weight: 2.5,
                color: "#1e293b",
              });

              if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                target.bringToFront();
              }
            },
            mouseout: (e: L.LeafletMouseEvent) => {
              setHoveredState(null);
              geojsonLayer.resetStyle(e.target);
            },
            click: (e: L.LeafletMouseEvent) => {
              const target = e.target as L.Path;
              if (
                "getBounds" in target &&
                typeof target.getBounds === "function"
              ) {
                map.fitBounds(target.getBounds(), {
                  padding: [40, 40],
                  maxZoom: 6,
                });
              }
            },
          });
        },
      },
    );

    geojsonLayer.addTo(map);
    geojsonLayerRef.current = geojsonLayer;
  }, [dataByUf]);

  const handleResetZoom = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(BRAZIL_BOUNDS, { padding: [10, 10] });
    }
  };

  return (
    <div className="relative w-full rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Top Bar / Hover Info */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3">
        <div className="flex items-center gap-2">
          {hoveredState ? (
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-slate-900">
                {hoveredState.name} ({hoveredState.uf})
              </span>
              <span className="text-xs font-semibold text-indigo-700">
                {hoveredState.userCount != null
                  ? `${hoveredState.userCount.toLocaleString("en-US")} regular users`
                  : "Insufficient data (< 5)"}
              </span>
              <span className="text-xs text-slate-400">
                • Range:{" "}
                {hoveredState.label === "insufficient data"
                  ? "insufficient data"
                  : hoveredState.label}
              </span>
            </div>
          ) : (
            <span className="text-xs font-medium text-slate-500">
              Hover over a state to view details
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleResetZoom}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs"
          title="Reset view"
        >
          <RotateCcw className="h-3 w-3 text-slate-500" />
          Reset
        </button>
      </div>

      {/* Map Canvas and Legend */}
      <div className="relative h-[560px] w-full bg-white">
        <div ref={mapContainerRef} className="h-full w-full bg-white z-0" />

        {/* Legend Overlay (Top Right, matching reference visual) */}
        <div className="pointer-events-auto absolute right-4 top-4 z-1000 max-w-[220px] rounded-lg border border-slate-200/90 bg-white/95 p-3.5 shadow-md backdrop-blur-xs">
          <h4 className="text-xs font-bold leading-tight text-slate-900 mb-2.5">
            Regular user intervals
          </h4>
          <div className="flex flex-col gap-1.5">
            {LEGEND_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <span
                  className="h-3.5 w-5 shrink-0 rounded-xs border border-black/10 shadow-2xs"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-medium text-slate-700">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-1001 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
            <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <Spinner size="default" className="text-slate-700" />
              <span className="text-xs font-medium text-slate-600">
                Loading map…
              </span>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-x-4 top-4 z-1001 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
