import { useEffect, useMemo, useState } from "react";

import Typesense from "typesense";

type SearchHit = {
  id: string;
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

const client = new Typesense.Client({
  nodes: [
    {
      host: "localhost",
      port: 8108,
      protocol: "http",
    },
  ],
  apiKey: "atlas-test-key",
  connectionTimeoutSeconds: 2,
});

const collection = client.collections("atlas-search-test");

export function TypesenseSearch() {
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

  const filterBy = useMemo(() => {
    const filters: string[] = [];

    if (state) {
      filters.push(`state:="${state}"`);
    }

    if (vehicle) {
      filters.push(`vehicle:="${vehicle}"`);
    }

    if (platform) {
      filters.push(`platform:="${platform}"`);
    }

    if (year) {
      filters.push(`year:=${year}`);
    }

    return filters.join(" && ");
  }, [state, vehicle, platform, year]);

  /*
   * ------------------------------------------------------
   * BUSCA
   * ------------------------------------------------------
   */

  useEffect(() => {
    /*
     * Debounce para evitar uma consulta
     * imediatamente a cada tecla.
     */
    const timer = window.setTimeout(() => {
      async function search() {
        try {
          setLoading(true);
          setError(null);

          /*
           * Typesense exige uma consulta.
           *
           * "*" significa retornar todos
           * os documentos quando o campo
           * de busca estiver vazio.
           */
          const searchQuery = query.trim() || "*";

          const response = await collection.documents().search({
            q: searchQuery,

            /*
             * Mesma lógica utilizada
             * no nosso benchmark.
             *
             * A ordem e os pesos
             * priorizam título e tags.
             */
            query_by:
              "title,tags,description,section,city,state,platform,vehicle",

            query_by_weights: "8,6,4,3,3,2,2,2",

            per_page: 20,

            page: 1,

            typo_tokens_threshold: 1,

            filter_by: filterBy || undefined,
          });

          const hits = response.hits ?? [];

          const documents = hits.map((hit) => hit.document as SearchHit);

          setResults(documents);

          setTotalResults(response.found ?? 0);
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
  }, [query, filterBy]);

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
        <h3 className="text-xl font-bold">Typesense</h3>

        <p className="mt-1 text-sm text-neutral-600">
          Busca textual e filtros usando o mesmo conjunto fictício do Delivery
          Worker Atlas.
        </p>
      </div>

      {/* CAMPO DE BUSCA */}

      <div>
        <label
          htmlFor="typesense-query"
          className="mb-2 block text-sm font-medium"
        >
          Buscar
        </label>

        <input
          id="typesense-query"
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
            htmlFor="typesense-state"
            className="mb-1 block text-sm font-medium"
          >
            Estado
          </label>

          <select
            id="typesense-state"
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
            htmlFor="typesense-vehicle"
            className="mb-1 block text-sm font-medium"
          >
            Veículo
          </label>

          <select
            id="typesense-vehicle"
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
            htmlFor="typesense-platform"
            className="mb-1 block text-sm font-medium"
          >
            Plataforma
          </label>

          <select
            id="typesense-platform"
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
            htmlFor="typesense-year"
            className="mb-1 block text-sm font-medium"
          >
            Ano
          </label>

          <select
            id="typesense-year"
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
