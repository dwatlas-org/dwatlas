import { redirect } from "react-router";
import { getCurrentUser } from "@/lib/api";

export async function protectedLoader() {
  const response = await getCurrentUser();
  if (!response.ok) {
    throw redirect("/register");
  }
  return null;
}
