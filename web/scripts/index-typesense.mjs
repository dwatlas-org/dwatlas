import fs from "node:fs/promises";

import Typesense from "typesense";

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

const file = await fs.readFile(
  "./public/sandbox-data/search/search-data.json",
  "utf8",
);

const data = JSON.parse(file);

const collectionName = "atlas-search-test";

/*
 * Converte o id numérico do JSON para string,
 * porque "id" é um campo especial no Typesense.
 */
const documents = data.records.map((record) => ({
  ...record,
  id: String(record.id),
}));

const schema = {
  name: collectionName,

  fields: [
    {
      name: "title",
      type: "string",
    },
    {
      name: "description",
      type: "string",
    },
    {
      name: "section",
      type: "string",
      facet: true,
    },
    {
      name: "state",
      type: "string",
      facet: true,
    },
    {
      name: "stateCode",
      type: "string",
      facet: true,
    },
    {
      name: "city",
      type: "string",
      facet: true,
    },
    {
      name: "vehicle",
      type: "string",
      facet: true,
    },
    {
      name: "platform",
      type: "string",
      facet: true,
    },
    {
      name: "year",
      type: "int32",
      facet: true,
    },
    {
      name: "tags",
      type: "string[]",
    },
  ],
};

console.log(`Preparando collection com ${documents.length} documentos...`);

/*
 * ------------------------------------------------------
 * REMOVE A COLLECTION ANTIGA
 * ------------------------------------------------------
 */

try {
  await client.collections(collectionName).delete();

  console.log("Collection anterior removida.");
} catch {
  console.log("Nenhuma collection anterior encontrada.");
}

/*
 * ------------------------------------------------------
 * CRIA A COLLECTION
 * ------------------------------------------------------
 */

await client.collections().create(schema);

console.log("Collection criada.");

/*
 * ------------------------------------------------------
 * IMPORTA OS DOCUMENTOS
 * ------------------------------------------------------
 */

console.log(`Indexando ${documents.length} documentos...`);

const result = await client
  .collections(collectionName)
  .documents()
  .import(documents, {
    action: "upsert",
  });

const failed = result.filter((item) => !item.success);

if (failed.length > 0) {
  console.error(`${failed.length} documentos falharam.`);

  console.error(failed.slice(0, 5));

  process.exit(1);
}

console.log(`${result.length} documentos indexados com sucesso.`);
