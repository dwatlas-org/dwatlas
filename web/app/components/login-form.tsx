import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

function LoginFormBody({ className }: { className?: string }) {
  return (
    <form
      className={cn(
        "p-8 lg:p-12 flex flex-col gap-6 justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start gap-1 text-left">
          <div className="text-[11px] font-bold tracking-wider text-[#13315C] uppercase">
            FOR THOSE WHO ALREADY HAVE AN ACCOUNT
          </div>
          <h2 className="font-heading text-3xl font-bold text-slate-900 mt-1">
            Log in
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Use your e-mail and password.
          </p>
        </div>

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
              type="email"
              placeholder="you@organisation.org"
              required
              className="h-10 px-3.5 rounded-lg border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:border-slate-400 transition-all outline-none"
            />
          </Field>

          <Field className="flex flex-col gap-1.5">
            <FieldLabel
              htmlFor="password"
              className="font-semibold text-slate-800 text-sm"
            >
              Password
            </FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              required
              className="h-10 px-3.5 rounded-lg border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:border-slate-400 transition-all outline-none"
            />
          </Field>

          <div className="flex items-center justify-between text-sm py-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
              <input
                type="checkbox"
                id="remember"
                className="size-4 rounded border-slate-300 text-[#13315C] focus:ring-[#13315C] cursor-pointer"
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
          className="h-10 w-full bg-[#13315C] hover:bg-[#0E2545] text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
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
