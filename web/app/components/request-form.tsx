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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

type RequestFormProps = React.ComponentProps<"div"> & {
  Form?: React.ElementType;
  isSubmitting?: boolean;
  error?: string;
  success?: string;
  bare?: boolean;
};

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
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" name="name" placeholder="shadcn" required />
            <FieldDescription>
              Your name may appear around GitHub where you contribute or are
              mentioned. You can remove it at any time.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Public Email</FieldLabel>
            <div className="relative">
              <select
                id="email"
                name="email"
                defaultValue="m@shadcn.com"
                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-input bg-transparent py-1 pr-8 pl-2.5 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 md:text-sm"
              >
                <option value="m@shadcn.com">m@shadcn.com</option>
                <option value="m@gmail.com">m@gmail.com</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              />
            </div>
            <FieldDescription>
              You can manage verified email addresses in your{" "}
              <a href="#email-settings">email settings</a>.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="bio">Bio</FieldLabel>
            <textarea
              id="bio"
              name="bio"
              placeholder="Tell us a little bit about yourself"
              required
              className="field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 md:text-sm"
            />
            <FieldDescription>
              You can <span>@mention</span> other users and organizations to
              link to them.
            </FieldDescription>
          </Field>
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
      <div className={cn("p-6 md:p-8", className)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Request Access</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Tell us who you are and why.
          </p>
        </div>
        <RequestFormBody Form={Form} error={error} success={success} />
        <Button
          type="submit"
          form="profile"
          disabled={isSubmitting}
          className="mt-5 w-full"
        >
          {isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    );
  }

  return (
    <Card className={cn("mx-auto w-full max-w-md", className)} {...props}>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your profile information.</CardDescription>
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
          {isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </CardFooter>
    </Card>
  );
}
