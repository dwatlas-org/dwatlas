export type PanelView =
  | "temporal_evolution"
  | "retention_rate"
  | "registrations"
  | "demographics"
  | "gender"
  | "age";

export type PanelFilters = {
  start_date?: string;
  end_date?: string;
  city?: string;
  state?: string;
  age_min?: number;
  age_max?: number;
  vehicle_type?: string;
  company_type?: string;
};

export type PanelMetricItem = {
  label: string;
  value: number;
};

export type PanelMetrics = {
  metrics: PanelMetricItem[];
};

export type DemographicsChartPoint = {
  bin_index: number;
  uf: string;
  state_name: string;
  user_count: number | null;
  label: string;
  color: string;
};

export type GenderChartPoint = {
  bin_index: number;
  label: string;
  men: number | null;
  women: number | null;
  other: number | null;
  men_label: string;
  women_label: string;
  other_label: string;
};

export type AgeChartPoint = {
  bin_index: number;
  age_min_val: number;
  age_max_val: number | null;
  label: string;
  user_count: number;
};

export type PanelChartPoint = Record<
  string,
  string | number | null | undefined
>;

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

async function postPanel<T>(
  path: string,
  filters: PanelFilters,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Panel request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function fetchPanelMetrics(
  view: PanelView,
  filters: PanelFilters,
  signal?: AbortSignal,
): Promise<PanelMetrics> {
  return postPanel(`/panels/${view}/metrics`, filters, signal);
}

export function fetchPanelChart(
  view: PanelView,
  filters: PanelFilters,
  signal?: AbortSignal,
): Promise<PanelChartPoint[]> {
  return postPanel(`/panels/${view}/charts`, filters, signal);
}

export async function requestAccess<T = unknown>(
  name: string,
  email: string,
  organization: string,
  bio: string,
): Promise<T> {
  const path = "/user/request_access";
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name,
      email: email,
      organization: organization,
      bio: bio,
    }),
  });

  if (!response.ok) {
    throw new Error(`Access request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function login(
  email: string,
  password: string,
  remember: boolean,
): Promise<Response> {
  const path = "/auth/token";
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
      remember: remember,
    }),
  });

  return response;
}

export async function getCurrentUser(): Promise<Response> {
  const path = "/auth/me";
  const response = await fetch(`${API_URL}${path}`, {
    method: "get",
    credentials: "include",
  });

  return response;
}

export async function signup(
  email: string,
  password: string,
): Promise<Response> {
  const path = "/user/signup";
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  return response;
}
