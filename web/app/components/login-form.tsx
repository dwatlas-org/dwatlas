import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-200";

function LoginFormBody({ className }: { className?: string }) {
  return (
    <form
      className={cn(
        "flex flex-col justify-between gap-6 p-8 lg:p-12",
        className,
      )}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start gap-1 text-left">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#13315C]">
            FOR THOSE WHO ALREADY HAVE AN ACCOUNT
          </div>
          <h2 className="mt-1 font-heading text-3xl font-bold text-slate-900">
            Log in
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Use your e-mail and password.
          </p>
        </div>

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
              type="email"
              placeholder="you@organisation.org"
              required
              className={inputClass}
            />
          </Field>

          <Field className="flex flex-col gap-1.5">
            <FieldLabel
              htmlFor="password"
              className="text-sm font-semibold text-slate-800"
            >
              Password
            </FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              required
              className={inputClass}
            />
          </Field>

          <div className="flex items-center justify-between py-1 text-sm">
            <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-600">
              <input
                type="checkbox"
                id="remember"
                className="size-4 cursor-pointer rounded border-slate-300 text-[#13315C] focus:ring-[#13315C]"
              />
              <span>Remember me</span>
            </label>
            <a
              href="#"
              className="font-semibold text-[#13315C] hover:underline"
            >
              Forgot your password?
            </a>
          </div>
        </div>
        <Button
          type="submit"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#13315C] font-semibold text-white transition-all hover:bg-[#0E2545] active:scale-[0.98]"
        >
          <span>Log in</span>
          <ArrowRight className="size-4 shrink-0" />
        </Button>
      </div>
    </form>
  );
}

export function LoginForm({
  className,
  bare = false,
  ...props
}: React.ComponentProps<"div"> & { bare?: boolean }) {
  if (bare) {
    return <LoginFormBody className={className} />;
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <LoginFormBody />
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
