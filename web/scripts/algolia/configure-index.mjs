import dotenv from "dotenv";
import { algoliasearch } from "algoliasearch";

dotenv.config({ path: ".env.local" });

const appId = process.env.ALGOLIA_APP_ID;
const writeApiKey =
  process.env.ALGOLIA_WRITE_API_KEY ?? process.env.ALGOLIA_ADMIN_API_KEY;
const indexName = process.env.ALGOLIA_INDEX_NAME ?? "dwatlas_content_en";

if (!appId) {
  throw new Error("ALGOLIA_APP_ID is not defined in .env.local.");
}

if (!writeApiKey) {
  throw new Error(
    "ALGOLIA_WRITE_API_KEY (or ALGOLIA_ADMIN_API_KEY) is not defined in .env.local.",
  );
}

const client = algoliasearch(appId, writeApiKey);

const indexSettings = {
  searchableAttributes: ["title", "keywords", "section", "description"],

  attributesForFaceting: ["filterOnly(type)", "filterOnly(section)"],

  attributesToRetrieve: [
    "objectID",
    "id",
    "type",
    "section",
    "title",
    "description",
    "url",
    "keywords",
  ],

  attributesToHighlight: ["title", "description"],

  attributesToSnippet: ["description:22"],

  typoTolerance: true,

  ignorePlurals: true,

  removeStopWords: ["en"],

  hitsPerPage: 6,
};

console.log(`Configuring Algolia index: ${indexName}`);

try {
  const response = await client.setSettings({
    indexName,
    indexSettings,
  });

  console.log("Index settings sent successfully.");

  if (response?.taskID !== undefined) {
    console.log(`Task ID: ${response.taskID}`);
  }

  console.log("");
  console.log("Configured searchable attributes:");
  indexSettings.searchableAttributes.forEach((attribute, index) => {
    console.log(`${index + 1}. ${attribute}`);
  });

  console.log("");
  console.log("Configured filterable attributes:");
  console.log("- type");
  console.log("- section");
} catch (error) {
  console.error("Failed to configure the Algolia index.");
  console.error(error);
  process.exitCode = 1;
}
