import { useFetcher, useRouteError, isRouteErrorResponse } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import { LoginForm } from "@/components/login-form";
import { RequestForm } from "@/components/register-form";

export async function requestAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const bio = formData.get("bio");

  if (typeof name !== "string" || !name.trim()) {
    return { error: "Name is required" };
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return { error: "Valid email is required" };
  }

  if (typeof bio !== "string" || !bio.trim()) {
    return { error: "Tell us a little bit about yourself" };
  }

  return { success: true, name, email };
}

export function Registration() {
  const fetcher = useFetcher<typeof requestAction>();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 bg-[#F0F0F0] md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="mx-auto flex flex-col gap-6 py-10">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid gap-6 p-0 lg:grid-cols-2">
              <LoginForm bare />
              <RequestForm
                bare
                Form={fetcher.Form}
                isSubmitting={isSubmitting}
                error={fetcher.data?.error}
                success={
                  fetcher.data?.success
                    ? `Request submitted for ${fetcher.data.name} (${fetcher.data.email})`
                    : undefined
                }
              />
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
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
