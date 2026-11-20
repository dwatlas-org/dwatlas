import { useFetcher } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { UpdatePasswordForm } from "@/components/updatepassword-form";
import { updatePassword } from "@/lib/api";
import { useSearchParams } from "react-router";

export async function updatePasswordAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const token = formData.get("token");
  const email = formData.get("email");

  if (typeof password !== "string" || password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const response = await updatePassword(email, token, password);

  if (!response.ok) {
    return { error: "Failed to update password" };
  }

  return { success: true, email };
}

export function PasswordUpdate() {
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  return (
    <div className="flex min-h-svh w-full flex-col items-center bg-slate-50 px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-900">Password Reset</h1>
      <span className="mb-8 mt-2 text-sm text-slate-500">
        Finish resetting your password
      </span>
      <div className="w-full max-w-2xl">
        <Card className="overflow-hidden rounded-2xl bg-white p-0 shadow-sm ring-1 ring-slate-200/70">
          <CardContent>
            <UpdatePasswordForm
              bare
              Form={fetcher.Form}
              token={token}
              email={email}
              isSubmitting={fetcher.data?.success}
              error={fetcher.data?.error}
              success={fetcher.data?.success}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
