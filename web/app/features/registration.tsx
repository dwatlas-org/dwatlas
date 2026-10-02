import { useFetcher, useRouteError, isRouteErrorResponse } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/components/login-form";
import { RequestForm } from "@/components/request-form";
import { requestAccess, login } from "@/lib/api";

// TODO typing in function signatures
async function requestAction(formData) {
  console.log("hello from requestAction");
  console.log(formData);
  const name = formData.get("name");
  const email = formData.get("email");
  const organization = formData.get("organization");
  const bio = formData.get("bio");
  console.log(
    `name: ${name} email: ${email} organization: ${organization} bio: ${bio}`,
  );

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

  requestAccess(name, email, organization, bio);
  return { successRequest: true, name, email };
}

async function loginAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const remember = formData.get("remember");

  if (typeof email !== "string" || !email.includes("@")) {
    return { errorLogin: "Valid email is required" };
  }
  if (typeof password !== "string" || !password.trim()) {
    return { errorLogin: "Password is required" };
  }

  const response = await login(email, password);

  if (!response.ok) {
    return { errorLogin: "Incorrect email or password" };
  }

  const data = await response.json();
  const token = data.access_token;

  if (remember === "on") {
    localStorage.setItem("token", JSON.stringify(token));
  } else if (remember === null) {
    sessionStorage.setItem("token", JSON.stringify(token));
  }

  return { successLogin: true };
}

export async function requestOrLoginAction({ request }: { request: Request }) {
  const formData = await request.formData();
  console.log(formData);
  const formType = formData.get("form_type");
  // this is very hacky (and not working), not sure if this is the way to proceed
  console.log("Hello from requestOrLoginAction");
  if (formType == "request") {
    console.log("form_type is request");
    return await requestAction(formData);
  } else if (formType == "login") {
    console.log("form_type is login");
    return await loginAction(formData);
  }
  return { success: true };
}

export function Registration() {
  const fetcher = useFetcher<typeof requestOrLoginAction>();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center bg-slate-50 px-6 py-12">
      <h1 className="text-4xl font-bold text-slate-900">
        Access the dashboard
      </h1>
      <span className="mb-8 mt-2 text-sm text-slate-500">
        Log in or request access to continue.
      </span>
      <div className="w-full max-w-4xl">
        <Card className="overflow-hidden rounded-2xl bg-white p-0 shadow-sm ring-1 ring-slate-200/70">
          <CardContent className="grid p-0 lg:grid-cols-2 lg:divide-x lg:divide-slate-100">
            <LoginForm
              bare
              Form={fetcher.Form}
              error={fetcher.data?.errorLogin}
              success={
                fetcher.data?.successLogin ? "Login successful" : undefined
              }
            />
            <RequestForm
              bare
              Form={fetcher.Form}
              requestIsSubmitting={isSubmitting}
              error={fetcher.data?.error}
              success={
                fetcher.data?.successRequest
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
