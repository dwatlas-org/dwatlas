import fs from "node:fs/promises";

import { Meilisearch } from "meilisearch";

const client = new Meilisearch({
  host: "http://localhost:7700",
});

const file = await fs.readFile(
  "./public/sandbox-data/search/search-data.json",
  "utf8",
);

const data = JSON.parse(file);

const index = client.index("atlas-search-test");

console.log(`Preparando índice com ${data.records.length} documentos...`);

// --------------------------------------------------
// 1. Define quais campos serão utilizados na busca
// --------------------------------------------------

console.log("Configurando campos pesquisáveis...");

const searchableTask = await index.updateSearchableAttributes([
  "title",
  "tags",
  "description",
  "section",
  "city",
  "state",
  "platform",
  "vehicle",
]);

await client.tasks.waitForTask(searchableTask.taskUid);

console.log("Campos pesquisáveis configurados.");

// --------------------------------------------------
// 2. Define quais campos poderão ser utilizados
//    como filtros
// --------------------------------------------------

console.log("Configurando filtros...");

const filterableTask = await index.updateFilterableAttributes([
  "section",
  "state",
  "stateCode",
  "city",
  "vehicle",
  "platform",
  "year",
]);

await client.tasks.waitForTask(filterableTask.taskUid);

console.log("Filtros configurados.");

// --------------------------------------------------
// 3. Adiciona os documentos ao índice
// --------------------------------------------------

console.log(`Indexando ${data.records.length} documentos...`);

const documentsTask = await index.addDocuments(data.records, {
  primaryKey: "id",
});

console.log("Tarefa de indexação criada:", documentsTask.taskUid);

const completedTask = await client.tasks.waitForTask(documentsTask.taskUid);

console.log("Status:", completedTask.status);

console.log("Indexação concluída.");
