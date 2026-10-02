export type PanelView =
  "temporal_evolution" | "retention_rate" | "registrations";

export type PanelFilters = {
  start_date?: string;
  end_date?: string;
  city?: string;
  state?: string;
};

export type PanelMetrics = {
  metrics: Record<string, number>;
};

export type PanelChartPoint = {
  label: string;
  [key: string]: string | number;
};

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

export async function requestAccess(
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

export async function login(email: string, password: string): Promise<T> {
  const path = "/auth/token";
  console.log("hello from login");
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  return response as Promise<T>;
}
