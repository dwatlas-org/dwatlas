import { useEffect, useMemo, useState } from "react";

import { Meilisearch } from "meilisearch";

type SearchHit = {
  id: number;
  title: string;
  description: string;
  section: string;
  state: string;
  stateCode: string;
  city: string;
  vehicle: string;
  platform: string;
  year: number;
  tags: string[];
};

const client = new Meilisearch({
  host: "http://localhost:7700",
});

const index = client.index("atlas-search-test");

export function MeilisearchSearch() {
  const [query, setQuery] = useState("");

  const [state, setState] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [platform, setPlatform] = useState("");
  const [year, setYear] = useState("");

  const [results, setResults] = useState<SearchHit[]>([]);

  const [totalResults, setTotalResults] = useState(0);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
   * ------------------------------------------------------
   * FILTROS
   * ------------------------------------------------------
   */

  const filters = useMemo(() => {
    const values: string[] = [];

    if (state) {
      values.push(`state = "${state}"`);
    }

    if (vehicle) {
      values.push(`vehicle = "${vehicle}"`);
    }

    if (platform) {
      values.push(`platform = "${platform}"`);
    }

    if (year) {
      values.push(`year = ${year}`);
    }

    return values;
  }, [state, vehicle, platform, year]);

  /*
   * ------------------------------------------------------
   * BUSCA
   * ------------------------------------------------------
   */

  useEffect(() => {
    /*
     * Pequeno debounce para evitar uma requisição
     * a cada tecla imediatamente.
     */
    const timer = window.setTimeout(() => {
      async function search() {
        try {
          setLoading(true);
          setError(null);

          const response = await index.search<SearchHit>(query, {
            limit: 20,

            filter: filters.length > 0 ? filters : undefined,
          });

          setResults(response.hits);

          setTotalResults(response.estimatedTotalHits ?? response.hits.length);
        } catch (err) {
          console.error(err);

          setError(
            err instanceof Error
              ? err.message
              : "Erro desconhecido ao realizar a busca.",
          );
        } finally {
          setLoading(false);
        }
      }

      void search();
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query, filters]);

  /*
   * ------------------------------------------------------
   * LIMPAR
   * ------------------------------------------------------
   */

  function clearSearch() {
    setQuery("");
    setState("");
    setVehicle("");
    setPlatform("");
    setYear("");
  }

  /*
   * ------------------------------------------------------
   * RENDER
   * ------------------------------------------------------
   */

  return (
    <section className="space-y-6 rounded-lg border p-5">
      <div>
        <h3 className="text-xl font-bold">Meilisearch</h3>

        <p className="mt-1 text-sm text-neutral-600">
          Busca textual e filtros usando o índice fictício do Delivery Worker
          Atlas.
        </p>
      </div>

      {/* CAMPO DE BUSCA */}

      <div>
        <label
          htmlFor="meilisearch-query"
          className="mb-2 block text-sm font-medium"
        >
          Buscar
        </label>

        <input
          id="meilisearch-query"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ex.: ganhos por hora, combustível, tempo parado..."
          className="w-full rounded-md border px-4 py-3 text-base outline-none focus:ring-2"
        />
      </div>

      {/* FILTROS */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* ESTADO */}

        <div>
          <label
            htmlFor="meili-state"
            className="mb-1 block text-sm font-medium"
          >
            Estado
          </label>

          <select
            id="meili-state"
            value={state}
            onChange={(event) => setState(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">Todos</option>

            <option value="São Paulo">São Paulo</option>

            <option value="Rio de Janeiro">Rio de Janeiro</option>

            <option value="Minas Gerais">Minas Gerais</option>

            <option value="Pernambuco">Pernambuco</option>

            <option value="Rio Grande do Sul">Rio Grande do Sul</option>

            <option value="Paraná">Paraná</option>

            <option value="Bahia">Bahia</option>

            <option value="Ceará">Ceará</option>

            <option value="Goiás">Goiás</option>

            <option value="Distrito Federal">Distrito Federal</option>
          </select>
        </div>

        {/* VEÍCULO */}

        <div>
          <label
            htmlFor="meili-vehicle"
            className="mb-1 block text-sm font-medium"
          >
            Veículo
          </label>

          <select
            id="meili-vehicle"
            value={vehicle}
            onChange={(event) => setVehicle(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">Todos</option>

            <option value="Motocicleta">Motocicleta</option>

            <option value="Bicicleta">Bicicleta</option>

            <option value="Carro">Carro</option>
          </select>
        </div>

        {/* PLATAFORMA */}

        <div>
          <label
            htmlFor="meili-platform"
            className="mb-1 block text-sm font-medium"
          >
            Plataforma
          </label>

          <select
            id="meili-platform"
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">Todas</option>

            <option value="iFood">iFood</option>

            <option value="Rappi">Rappi</option>

            <option value="99">99</option>

            <option value="Uber">Uber</option>

            <option value="Empresa particular">Empresa particular</option>
          </select>
        </div>

        {/* ANO */}

        <div>
          <label
            htmlFor="meili-year"
            className="mb-1 block text-sm font-medium"
          >
            Ano
          </label>

          <select
            id="meili-year"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">Todos</option>

            <option value="2024">2024</option>

            <option value="2025">2025</option>

            <option value="2026">2026</option>
          </select>
        </div>
      </div>

      {/* CONTROLES */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-600">
          {loading
            ? "Buscando..."
            : `${totalResults.toLocaleString("pt-BR")} resultados encontrados`}
        </p>

        <button
          type="button"
          onClick={clearSearch}
          className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
        >
          Limpar busca e filtros
        </button>
      </div>

      {/* ERRO */}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Erro na busca</strong>

          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* RESULTADOS */}

      {!error && (
        <div className="space-y-3">
          {results.map((result) => (
            <article key={result.id} className="rounded-md border p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold">{result.title}</h4>

                  <p className="mt-1 text-xs font-medium text-neutral-500">
                    {result.section}
                  </p>
                </div>

                <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                  {result.year}
                </span>
              </div>

              <p className="mt-3 text-sm text-neutral-700">
                {result.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-600">
                <span className="rounded bg-neutral-100 px-2 py-1">
                  {result.state}
                </span>

                <span className="rounded bg-neutral-100 px-2 py-1">
                  {result.city}
                </span>

                <span className="rounded bg-neutral-100 px-2 py-1">
                  {result.vehicle}
                </span>

                <span className="rounded bg-neutral-100 px-2 py-1">
                  {result.platform}
                </span>
              </div>
            </article>
          ))}

          {!loading && results.length === 0 && (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-neutral-500">
              Nenhum resultado encontrado para essa combinação.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
