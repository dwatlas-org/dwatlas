import { getCurrentUser } from "@/lib/api";
import { redirect } from "react-router";

export async function protectedLoader() {
  const response = await getCurrentUser();
  if (!response.ok) {
    throw redirect("/register");
  }
  return null;
}
