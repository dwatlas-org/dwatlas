import { useFetcher, useRouteError, isRouteErrorResponse } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LoginForm } from "@/components/login-form";
import { RequestForm } from "@/components/request-form";
import { Separator } from "@/components/ui/separator";

export async function requestAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const organization = formData.get("organization");
  const bio = formData.get("bio");

  if (typeof name !== "string" || !name.trim()) {
    return { error: "Name is required" };
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return { error: "Valid email is required" };
  }

  if (typeof organization !== "string" || !organization.trim()) {
    return { error: "Organization is required" };
  }

  if (typeof bio !== "string" || !bio.trim()) {
    return { error: "Tell us what you intend to do with the data" };
  }

  return { success: true, name, email };
}

export function Registration() {
  const fetcher = useFetcher<typeof requestAction>();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <div className="min-h-svh w-full bg-[#F0F0F0] flex flex-col items-center justify-center px-6 pb-12">
      <h1 className="text-4xl font-bold">Access the dashboard</h1>
      <span className="text-sm text-slate-500 pb-6">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </span>
      <div className="w-full max-w-4xl">
        <Card className="overflow-hidden bg-white ring-1 ring-slate-200/70 shadow-sm rounded-2xl p-0">
          <CardContent className="grid lg:grid-cols-2 p-0 gap-0">
            <LoginForm bare />
            {/*<Separator orientation="vertical" className="border-t-mist-700/20 w-1" />*/}
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
        <p className="mt-6 text-center text-sm text-slate-500">
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            className="font-medium text-slate-700 underline underline-offset-4 hover:text-slate-900"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="font-medium text-slate-700 underline underline-offset-4 hover:text-slate-900"
          >
            Privacy Policy
          </a>
          .
        </p>
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
