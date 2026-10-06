import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/components/login-form";
import { useFetcher } from "react-router";

export function Login() {
  const fetcher = useFetcher();
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
            <LoginForm bare />
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
