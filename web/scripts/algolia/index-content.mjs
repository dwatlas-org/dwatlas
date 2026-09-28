import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));

const contentPath = path.resolve(
  scriptDirectory,
  "../../app/features/search/data/en/search-content.json",
);

console.log(`Reading search content from: ${contentPath}`);

const fileContents = await fs.readFile(contentPath, "utf8");
const sourceRecords = JSON.parse(fileContents);

if (!Array.isArray(sourceRecords)) {
  throw new Error("search-content.json must contain a JSON array.");
}

const requiredFields = ["id", "type", "section", "title", "description", "url"];

for (const [index, record] of sourceRecords.entries()) {
  for (const field of requiredFields) {
    if (
      record[field] === undefined ||
      record[field] === null ||
      record[field] === ""
    ) {
      throw new Error(
        `Record ${index + 1} is missing required field "${field}".`,
      );
    }
  }
}

const duplicateIds = sourceRecords
  .map((record) => record.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index);

if (duplicateIds.length > 0) {
  throw new Error(
    `Duplicate record IDs found: ${[...new Set(duplicateIds)].join(", ")}`,
  );
}

const records = sourceRecords.map((record) => ({
  ...record,
  objectID: record.id,
}));

console.log(`Preparing ${records.length} records for ${indexName}...`);

const client = algoliasearch(appId, writeApiKey);

try {
  const response = await client.saveObjects({
    indexName,
    objects: records,
  });

  console.log(`${records.length} records sent successfully.`);

  if (response?.taskID !== undefined) {
    console.log(`Task ID: ${response.taskID}`);
  }

  if (Array.isArray(response?.taskIDs)) {
    console.log(`Task IDs: ${response.taskIDs.join(", ")}`);
  }

  console.log("");
  console.log("Sample records:");

  records.slice(0, 5).forEach((record) => {
    console.log(`- ${record.title} | ${record.section} | ${record.url}`);
  });
} catch (error) {
  console.error("Failed to index content in Algolia.");
  console.error(error);
  process.exitCode = 1;
}
