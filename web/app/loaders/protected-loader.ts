import { getCurrentUser } from "@/lib/api";

export async function protectedLoader() {
  await getCurrentUser();
  // if (!response.ok) {
  //   throw redirect("/register");
  // }
  return null;
}
