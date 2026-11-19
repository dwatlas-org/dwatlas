import { useParams } from "react-router";
import { useFetcher } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { UpdatePasswordForm } from "@/components/updatepassword-form";
import { resetPassword } from "@/lib/api";

export async function updatePasswordAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const token = formData.get("token");
  console.log(`action has token:${token}`);

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }
  return { success: true, email };
}

export function PasswordUpdate() {
  const fetcher = useFetcher();
  const params = useParams();
  const token = params.token;
  console.log(`PasswordUpdate has token:${token}`);

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
              isSubmitting={fetcher.data?.success}
              error={fetcher.data?.error}
              success={
                fetcher.data?.success
                  ? `If it corresponds to an existing user, we will send a password reset link to ${fetcher.data.email}.`
                  : undefined
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
