import { redirect } from "react-router";
import { get_current_user } from "@/lib/api";

export async function protectedLoader() {
  const response = await get_current_user();
  if (!response.ok) {
    throw redirect("/register");
  }
  return null;
}
