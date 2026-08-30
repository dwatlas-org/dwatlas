import { useEffect, useState } from "react";

import type { ChartsData } from "../data/loader";

import { loadChartsData } from "../data/loader";

import { LeafletDrilldownMap } from "./LeafletDrilldownMap";

export function LeafletSandbox() {
  const [data, setData] = useState<ChartsData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const result = await loadChartsData();

        setData(result);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error ? err.message : "Erro ao carregar os dados.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-bold">Leaflet</h2>

        <p className="mt-2 text-sm text-neutral-500">Carregando dados...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h2 className="text-2xl font-bold">Leaflet</h2>

        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Erro ao carregar os dados</strong>

          <p className="mt-1">{error}</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Leaflet</h2>

        <p className="mt-1 text-sm text-neutral-500">
          Teste de mapa interativo com mudança automática entre estados e
          municípios.
        </p>
      </div>

      <LeafletDrilldownMap data={data} />
    </section>
  );
}
