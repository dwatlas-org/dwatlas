import { AlgoliaSearch } from "./algolia/AlgoliaSearch";
import { MeilisearchSearch } from "./meilisearch/MeilisearchSearch";
import { TypesenseSearch } from "./typesense/TypesenseSearch";

export function SearchSandbox() {
  return (
    <section className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold">Search engine tests</h2>

        <p className="mt-1 text-sm text-neutral-600">
          Comparison of search engines using the same fictitious Delivery Worker
          Atlas dataset.
        </p>
      </div>

      <MeilisearchSearch />

      <hr className="my-10" />

      <TypesenseSearch />

      <hr className="my-10" />

      <AlgoliaSearch />
    </section>
  );
}
