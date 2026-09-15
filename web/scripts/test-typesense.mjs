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

const collection = client.collections("atlas-search-test");

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
      filter_by: 'state:="São Paulo"',
    },
  },

  {
    name: "Busca com estado e veículo",
    query: "ganhos",
    options: {
      filter_by: 'state:="São Paulo" && vehicle:="Motocicleta"',
    },
  },

  {
    name: "Busca com múltiplos filtros",
    query: "ganhos",
    options: {
      filter_by:
        'state:="São Paulo" && vehicle:="Motocicleta" && platform:="iFood" && year:=2026',
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
  const result = await collection.documents().search({
    q: test.query,

    /*
     * Ordem dos campos pesquisáveis.
     *
     * title recebe mais peso por aparecer
     * primeiro.
     */
    query_by: "title,tags,description,section,city,state,platform,vehicle",

    query_by_weights: "8,6,4,3,3,2,2,2",

    per_page: 5,

    typo_tokens_threshold: 1,

    ...test.options,
  });

  console.log("\n========================================");

  console.log(`Teste: ${test.name}`);
  console.log(`Busca: "${test.query}"`);

  if (test.options.filter_by) {
    console.log("Filtros:", test.options.filter_by);
  }

  console.log(`Resultados: ${result.found}`);

  console.log("========================================");

  for (const hit of result.hits ?? []) {
    const document = hit.document;

    console.log(
      [
        `- ${document.title}`,
        `Seção: ${document.section}`,
        `Local: ${document.city} / ${document.stateCode}`,
        `Veículo: ${document.vehicle}`,
        `Plataforma: ${document.platform}`,
        `Ano: ${document.year}`,
      ].join(" | "),
    );
  }
}
