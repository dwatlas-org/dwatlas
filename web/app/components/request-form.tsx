import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ChevronDown, Info } from "lucide-react";

type RequestFormProps = React.ComponentProps<"div"> & {
  Form?: React.ElementType;
  isSubmitting?: boolean;
  error?: string;
  success?: string;
  bare?: boolean;
};

const inputClass =
  "h-10 px-3.5 rounded-lg border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:border-slate-400 transition-all outline-none";

function RequestFormBody({
  Form = "form",
  error,
  success,
}: {
  Form?: React.ElementType;
  error?: string;
  success?: string;
}) {
  return (
    <>
      {success ? <div className="text-sm text-green-600">{success}</div> : null}
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      <Form id="profile">
        <FieldGroup className="flex flex-col gap-4">
          <Field className="flex flex-col gap-1.5">
            <FieldLabel
              htmlFor="name"
              className="font-semibold text-slate-800 text-sm"
            >
              Full name
            </FieldLabel>
            <Input
              id="name"
              name="name"
              placeholder="Jane Roe"
              required
              className={inputClass}
            />
          </Field>
          <Field className="flex flex-col gap-1.5">
            <FieldLabel
              htmlFor="email"
              className="font-semibold text-slate-800 text-sm"
            >
              Organizational e-mail
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
          <Field className="flex flex-col gap-1.5">
            <FieldLabel
              htmlFor="organization"
              className="font-semibold text-slate-800 text-sm"
            >
              Organization / Institution
            </FieldLabel>
            <div className="relative">
              <select
                id="organization"
                name="organization"
                defaultValue=""
                className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3.5 pr-9 text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:border-slate-400"
              >
                <option value="" disabled>
                  Select your organization
                </option>
                <option value="university">University / Research Center</option>
                <option value="ngo">NGO / Civil Society</option>
                <option value="government">Government / Public Body</option>
                <option value="media">Media / Press</option>
                <option value="union">Union / Association</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-400"
              />
            </div>
          </Field>
          <Field className="flex flex-col gap-1.5">
            <FieldLabel
              htmlFor="bio"
              className="font-semibold text-slate-800 text-sm"
            >
              Purpose of access
            </FieldLabel>
            <textarea
              id="bio"
              name="bio"
              placeholder="Briefly describe what you intend to do with the data."
              required
              className="field-sizing-content min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-colors outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:border-slate-400"
            />
          </Field>
          <div className="flex items-start gap-3 rounded-lg bg-[#F1F5F9] px-3.5 py-3 text-sm text-slate-600">
            <Info className="mt-0.5 size-4 shrink-0 text-[#13315C]" />
            <p>
              Access is granted individually and reviewed by the DeliveryWorker
              Atlas team. You will be notified by e-mail.
            </p>
          </div>
        </FieldGroup>
      </Form>
    </>
  );
}

export function RequestForm({
  className,
  Form = "form",
  isSubmitting = false,
  error,
  success,
  bare = false,
  ...props
}: RequestFormProps) {
  if (bare) {
    return (
      <div
        className={cn(
          "p-8 lg:p-12 flex flex-col gap-6 justify-between",
          className,
        )}
      >
        <div className="flex flex-col items-start gap-1 text-left">
          <div className="text-[11px] font-bold tracking-wider text-[#13315C] uppercase">
            FOR THOSE WHO DON'T HAVE AN ACCOUNT YET
          </div>
          <h2 className="font-heading text-3xl font-bold text-slate-900 mt-1">
            Request access
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Tell us who you are and how you'll use the data.
          </p>
        </div>
        <RequestFormBody Form={Form} error={error} success={success} />
        <Button
          type="submit"
          form="profile"
          disabled={isSubmitting}
          className="h-10 w-full bg-[#13315C] hover:bg-[#0E2545] text-white font-semibold rounded-lg transition-all active:scale-[0.98]"
        >
          {isSubmitting ? "Sending request..." : "Send access request"}
        </Button>
      </div>
    );
  }

  return (
    <Card className={cn("mx-auto w-full max-w-md", className)} {...props}>
      <CardHeader>
        <CardTitle>Request access</CardTitle>
        <CardDescription>Tell us who you are and why.</CardDescription>
      </CardHeader>
      <CardContent>
        <RequestFormBody Form={Form} error={error} success={success} />
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="profile"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Sending request..." : "Send access request"}
        </Button>
      </CardFooter>
    </Card>
  );
}
