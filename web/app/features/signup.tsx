import { useFetcher, useRouteError, isRouteErrorResponse } from "react-router";
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
    <div className="flex min-h-svh w-full items-center justify-center p-6 bg-[#f0f0f0] md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm
          Form={fetcher.Form}
          isSubmitting={isSubmitting}
          error={fetcher.data?.error}
          success={
            fetcher.data?.success
              ? `Successfully signed up with ${fetcher.data.email}`
              : undefined
          }
          className="mx-auto py-10"
        />
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
