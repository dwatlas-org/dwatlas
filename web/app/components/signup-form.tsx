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

const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-200";

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
        "flex flex-col justify-between gap-6 p-8 lg:p-12",
        className,
      )}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start gap-1 text-left">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#13315C]">
            NEW TO THE DASHBOARD?
          </div>
          <h2 className="mt-1 font-heading text-3xl font-bold text-slate-900">
            Create an account
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Tell us who you are and why.
          </p>
        </div>

        {success ? (
          <div className="text-sm text-green-600">{success}</div>
        ) : null}
        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <div className="mt-2 flex flex-col gap-4">
          <Field className="flex flex-col gap-1.5">
            <FieldLabel
              htmlFor="email"
              className="text-sm font-semibold text-slate-800"
            >
              E-mail
            </FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@organisation.org"
              required
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field className="flex flex-col gap-1.5">
              <FieldLabel
                htmlFor="password"
                className="text-sm font-semibold text-slate-800"
              >
                Password
              </FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className={inputClass}
              />
            </Field>
            <Field className="flex flex-col gap-1.5">
              <FieldLabel
                htmlFor="confirm-password"
                className="text-sm font-semibold text-slate-800"
              >
                Confirm
              </FieldLabel>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                className={inputClass}
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
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#13315C] font-semibold text-white transition-all hover:bg-[#0E2545] active:scale-[0.98] disabled:opacity-60"
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
