import { get_current_user } from "@/lib/api";

export async function rootLoader() {
  const response = await get_current_user();
  if (!response.ok) {
    return { user: null };
  }
  const user = await response.json();
  return { user };
}
