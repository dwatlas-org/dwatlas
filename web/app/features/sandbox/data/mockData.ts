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
};

export async function loadChartsData(): Promise<ChartsData> {
  const response = await fetch("/sandbox-data/charts-data.json");

  if (!response.ok) {
    throw new Error(
      `Erro ao carregar charts-data.json: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<ChartsData>;
}
