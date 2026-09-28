import { liteClient } from "algoliasearch/lite";

const appId = import.meta.env.VITE_ALGOLIA_APP_ID;
const searchApiKey = import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY;

export const searchIndexName =
  import.meta.env.VITE_ALGOLIA_INDEX_NAME ?? "dwatlas_content_en";

if (!appId) {
  throw new Error("VITE_ALGOLIA_APP_ID is not defined in web/.env.local.");
}

if (!searchApiKey) {
  throw new Error(
    "VITE_ALGOLIA_SEARCH_API_KEY is not defined in web/.env.local.",
  );
}

export const searchClient = liteClient(appId, searchApiKey);
