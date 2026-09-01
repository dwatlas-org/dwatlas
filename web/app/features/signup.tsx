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
    <div className="min-h-svh w-full bg-[#F0F0F0] flex flex-col items-center justify-start pb-12">
      <h1 className="text-4xl font-bold">Create your account</h1>
      <span className="text-sm text-slate-500 pb-6">
        Sign up to access the dashboard.
      </span>
      <div className="w-full max-w-2xl">
        <Card className="overflow-hidden bg-white ring-1 ring-slate-200/70 shadow-sm rounded-2xl p-0">
          <CardContent>
            <div className="hidden lg:block" />
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
      <div className="text-red-600">
        <h3 className="font-bold">Error {error.status}</h3>
        <p>{error.statusText || error.data}</p>
      </div>
    );
  }

  return (
    <div className="text-red-600">
      <h3 className="font-bold">Unexpected Error</h3>
      <p>
        {error instanceof Error ? error.message : "An unknown error occurred"}
      </p>
    </div>
  );
}
