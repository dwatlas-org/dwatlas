import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

const appId = process.env.ALGOLIA_APP_ID;

const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

const indexName = process.env.ALGOLIA_INDEX_NAME;

if (!appId) {
  throw new Error("ALGOLIA_APP_ID não definido.");
}

if (!searchApiKey) {
  throw new Error("ALGOLIA_SEARCH_API_KEY não definido.");
}

if (!indexName) {
  throw new Error("ALGOLIA_INDEX_NAME não definido.");
}

const host = `https://${appId}-1.algolianet.com`;

const headers = {
  "Content-Type": "application/json",

  "X-Algolia-Application-Id": appId,

  "X-Algolia-API-Key": searchApiKey,
};

async function searchAlgolia(query, options = {}) {
  const response = await fetch(
    `${host}/1/indexes/${encodeURIComponent(indexName)}/query`,
    {
      method: "POST",

      headers,

      body: JSON.stringify({
        query,

        hitsPerPage: 5,

        ...options,
      }),
    },
  );

  const body = await response.json();

  if (!response.ok) {
    console.error(body);

    throw new Error(`Algolia retornou HTTP ${response.status}`);
  }

  return body;
}

const tests = [
  {
    name: "Busca simples",

    query: "ganhos",

    options: {},
  },

  {
    name: "Busca com estado",

    query: "ganhos",

    options: {
      filters: 'state:"São Paulo"',
    },
  },

  {
    name: "Busca com estado e veículo",

    query: "ganhos",

    options: {
      filters: 'state:"São Paulo" AND vehicle:"Motocicleta"',
    },
  },

  {
    name: "Busca com múltiplos filtros",

    query: "ganhos",

    options: {
      filters:
        'state:"São Paulo" AND vehicle:"Motocicleta" AND platform:"iFood" AND year:2026',
    },
  },

  {
    name: "Busca sem acento",

    query: "combustivel",

    options: {},
  },

  {
    name: "Busca com erro ortográfico",

    query: "entregdores bicicleta",

    options: {},
  },

  {
    name: "Busca por sinônimo presente nas tags",

    query: "salário",

    options: {},
  },

  {
    name: "Busca territorial específica",

    query: "tempo parado Recife",

    options: {},
  },
];

for (const test of tests) {
  const result = await searchAlgolia(test.query, test.options);

  console.log("\n========================================");

  console.log(`Teste: ${test.name}`);

  console.log(`Busca: "${test.query}"`);

  if (test.options.filters) {
    console.log("Filtros:", test.options.filters);
  }

  console.log(`Resultados: ${result.nbHits}`);

  console.log("========================================");

  for (const hit of result.hits) {
    console.log(
      [
        `- ${hit.title}`,
        `Seção: ${hit.section}`,
        `Local: ${hit.city} / ${hit.stateCode}`,
        `Veículo: ${hit.vehicle}`,
        `Plataforma: ${hit.platform}`,
        `Ano: ${hit.year}`,
      ].join(" | "),
    );
  }
}
