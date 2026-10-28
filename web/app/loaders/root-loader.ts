import { getCurrentUser } from "@/lib/api";

export async function rootLoader() {
  const response = await getCurrentUser();
  if (!response.ok) {
    return { user: null };
  }
  const user = await response.json();
  return { user };
}
