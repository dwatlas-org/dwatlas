import { useCallback, useEffect, useState } from "react";

import {
  fetchPanelChart,
  fetchPanelMetrics,
  type PanelChartPoint,
  type PanelFilters,
  type PanelMetrics,
  type PanelView,
} from "@/lib/api";

type PanelState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function usePanelFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[],
): PanelState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setIsLoading(true);
    setError(null);

    fetcher(controller.signal)
      .then((result) => {
        if (active) {
          setData(result);
        }
      })
      .catch((err: unknown) => {
        if (active && !isAbortError(err)) {
          setError(
            err instanceof Error ? err.message : "Failed to load panel data",
          );
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const refetch = useCallback(() => setVersion((value) => value + 1), []);

  return { data, isLoading, error, refetch };
}

export function useMetrics(
  view: PanelView,
  filters: PanelFilters,
): PanelState<PanelMetrics> {
  return usePanelFetch(
    (signal) => fetchPanelMetrics(view, filters, signal),
    [view, filters],
  );
}

export function useChart(
  view: PanelView,
  filters: PanelFilters,
): PanelState<PanelChartPoint[]> {
  return usePanelFetch(
    (signal) => fetchPanelChart(view, filters, signal),
    [view, filters],
  );
}
