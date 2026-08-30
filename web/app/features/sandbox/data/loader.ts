/*
 * ------------------------------------------------------
 * TIPOS DA BASE FICTÍCIA
 * ------------------------------------------------------
 */

export type SummaryData = {
  totalUsers: number;
  totalEarnings: number;
  totalExpenses: number;
  averageAge: number;
};

export type UsersOverTimeData = {
  period: string;
  users: number;
};

export type GenderData = {
  gender: string;
  users: number;
};

export type AgeGroupData = {
  ageGroup: string;
  users: number;
};

export type StateData = {
  state: string;
  code: string;
  users: number;
};

export type MonthlyValueData = {
  period: string;
  value: number;
};

export type ExpenseCategoryData = {
  category: string;
  value: number;
};

export type CompanyData = {
  company: string;
  users: number;
  percentage: number;
};

export type VehicleData = {
  vehicle: string;
  users: number;
  percentage: number;
};

export type CompanyTreemapData = {
  company: string;
  users: number;
  logo: string;
};

/*
 * ------------------------------------------------------
 * ESTRUTURA COMPLETA DO JSON FICTÍCIO
 * ------------------------------------------------------
 */

export type ChartsData = {
  summary: SummaryData;

  usersOverTime: UsersOverTimeData[];

  gender: GenderData[];

  ageGroups: AgeGroupData[];

  states: StateData[];

  earningsOverTime: MonthlyValueData[];

  expensesOverTime: MonthlyValueData[];

  expenseCategories: ExpenseCategoryData[];

  companies: CompanyData[];

  vehicles: VehicleData[];

  companyTreemap: CompanyTreemapData[];
};

/*
 * ------------------------------------------------------
 * TIPOS DO GEOJSON
 * ------------------------------------------------------
 */

export type GeoJsonFeatureCollection = {
  type: "FeatureCollection";

  features: Array<{
    type: "Feature";

    properties: {
      CD_UF: string;
      NM_UF: string;
      SIGLA_UF: string;
      CD_REGIAO: string;
      NM_REGIAO: string;
      SIGLA_RG: string;
      AREA_KM2: number;

      [key: string]: unknown;
    };

    geometry: unknown;
  }>;
};

/*
 * ------------------------------------------------------
 * FUNÇÃO GENÉRICA PARA CARREGAR JSON
 * ------------------------------------------------------
 */

async function loadJson<T>(path: string): Promise<T> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(
      `Erro ao carregar ${path}: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

/*
 * ------------------------------------------------------
 * BASE FICTÍCIA DOS GRÁFICOS
 * ------------------------------------------------------
 */

export function loadChartsData(): Promise<ChartsData> {
  return loadJson<ChartsData>("/sandbox-data/charts-data.json");
}

/*
 * ------------------------------------------------------
 * GEOJSON DO MAPA DO BRASIL
 * ------------------------------------------------------
 */

export function loadBrazilStatesMap(): Promise<GeoJsonFeatureCollection> {
  return loadJson<GeoJsonFeatureCollection>("/sandbox-data/BR_UF_2025.json");
}
