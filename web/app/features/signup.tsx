import { useFetcher, useRouteError, isRouteErrorResponse } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { SignupForm } from "@/components/signup-form";

export async function signupAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (typeof email !== "string" || !email.includes("@")) {
    return { error: "Valid email is required" };
  }

  if (typeof password !== "string" || password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  return { success: true, email };
}

export function Signup() {
  const fetcher = useFetcher<typeof signupAction>();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <div className="flex min-h-svh w-full flex-col items-center bg-slate-50 px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-900">Create your account</h1>
      <span className="mb-8 mt-2 text-sm text-slate-500">
        Sign up to access the dashboard.
      </span>
      <div className="w-full max-w-2xl">
        <Card className="overflow-hidden rounded-2xl bg-white p-0 shadow-sm ring-1 ring-slate-200/70">
          <CardContent>
            <SignupForm
              bare
              Form={fetcher.Form}
              isSubmitting={isSubmitting}
              error={fetcher.data?.error}
              success={
                fetcher.data?.success
                  ? `Successfully signed up with ${fetcher.data.email}`
                  : undefined
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col gap-1.5 p-8 text-red-600">
        <h3 className="text-lg font-bold">Error {error.status}</h3>
        <p className="text-sm opacity-90">{error.statusText || error.data}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 p-8 text-red-600">
      <h3 className="text-lg font-bold">Unexpected error</h3>
      <p className="text-sm opacity-90">
        {error instanceof Error ? error.message : "An unknown error occurred"}
      </p>
    </div>
  );
}
