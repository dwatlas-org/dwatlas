import { Meilisearch } from "meilisearch";

const client = new Meilisearch({
  host: "http://localhost:7700",
});

const index = client.index("atlas-search-test");

const tests = [
  {
    name: "Busca simples",
    query: "ganhos",
    options: {
      limit: 5,
    },
  },

  {
    name: "Busca com estado",
    query: "ganhos",
    options: {
      filter: 'state = "São Paulo"',
      limit: 5,
    },
  },

  {
    name: "Busca com estado e veículo",
    query: "ganhos",
    options: {
      filter: ['state = "São Paulo"', 'vehicle = "Motocicleta"'],
      limit: 5,
    },
  },

  {
    name: "Busca com múltiplos filtros",
    query: "ganhos",
    options: {
      filter: [
        'state = "São Paulo"',
        'vehicle = "Motocicleta"',
        'platform = "iFood"',
        "year = 2026",
      ],
      limit: 5,
    },
  },

  {
    name: "Busca sem acento",
    query: "combustivel",
    options: {
      limit: 5,
    },
  },

  {
    name: "Busca com erro ortográfico",
    query: "entregdores bicicleta",
    options: {
      limit: 5,
    },
  },

  {
    name: "Busca por sinônimo presente nas tags",
    query: "salário",
    options: {
      limit: 5,
    },
  },

  {
    name: "Busca territorial específica",
    query: "tempo parado Recife",
    options: {
      limit: 5,
    },
  },
];

for (const test of tests) {
  const result = await index.search(test.query, test.options);

  console.log("\n========================================");

  console.log(`Teste: ${test.name}`);
  console.log(`Busca: "${test.query}"`);

  if (test.options.filter) {
    console.log("Filtros:", test.options.filter);
  }

  console.log(`Resultados: ${result.estimatedTotalHits}`);

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
