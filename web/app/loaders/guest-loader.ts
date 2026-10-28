import { redirect } from "react-router";
import { getCurrentUser } from "@/lib/api";

export async function guestLoader() {
  const response = await getCurrentUser();
  if (response.ok) {
    throw redirect("/panels");
  }
  return null;
}
