import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

type SignupFormProps = React.ComponentProps<"div"> & {
  Form?: React.ElementType;
  isSubmitting?: boolean;
  error?: string;
  success?: string;
  bare?: boolean;
};

function SignupFormBody({
  className,
  Form = "form",
  isSubmitting = false,
  error,
  success,
}: {
  className?: string;
  Form?: React.ElementType;
  isSubmitting?: boolean;
  error?: string;
  success?: string;
}) {
  return (
    <Form
      method="post"
      className={cn(
        "p-8 lg:p-12 flex flex-col gap-6 justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start gap-1 text-left">
          <div className="text-[11px] font-bold tracking-wider text-[#13315C] uppercase">
            NEW TO THE DASHBOARD?
          </div>
          <h2 className="font-heading text-3xl font-bold text-slate-900 mt-1">
            Create an account
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Tell us who you are and why.
          </p>
        </div>

        {success ? (
          <div className="text-sm text-green-600">{success}</div>
        ) : null}
        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <div className="flex flex-col gap-4 mt-2">
          <Field className="flex flex-col gap-1.5">
            <FieldLabel
              htmlFor="email"
              className="font-semibold text-slate-800 text-sm"
            >
              E-mail
            </FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@organisation.org"
              required
              className="h-10 px-3.5 rounded-lg border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:border-slate-400 transition-all outline-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field className="flex flex-col gap-1.5">
              <FieldLabel
                htmlFor="password"
                className="font-semibold text-slate-800 text-sm"
              >
                Password
              </FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-10 px-3.5 rounded-lg border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:border-slate-400 transition-all outline-none"
              />
            </Field>
            <Field className="flex flex-col gap-1.5">
              <FieldLabel
                htmlFor="confirm-password"
                className="font-semibold text-slate-800 text-sm"
              >
                Confirm
              </FieldLabel>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                className="h-10 px-3.5 rounded-lg border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:border-slate-400 transition-all outline-none"
              />
            </Field>
          </div>

          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 w-full bg-[#13315C] hover:bg-[#0E2545] text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
        >
          <span>{isSubmitting ? "Creating Account..." : "Create account"}</span>
          <ArrowRight className="size-4 shrink-0" />
        </Button>
      </div>
    </Form>
  );
}

export function SignupForm({
  className,
  Form = "form",
  isSubmitting = false,
  error,
  success,
  bare = false,
  ...props
}: SignupFormProps) {
  if (bare) {
    return (
      <SignupFormBody
        className={className}
        Form={Form}
        isSubmitting={isSubmitting}
        error={error}
        success={success}
      />
    );
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <SignupFormBody
        Form={Form}
        isSubmitting={isSubmitting}
        error={error}
        success={success}
      />
      <FieldDescription className="px-6 text-center">
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
      </FieldDescription>
    </div>
  );
}
