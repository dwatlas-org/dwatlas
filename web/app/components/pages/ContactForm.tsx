import { type FormEvent, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ContactField = {
  id: string;
  label: string;
  optionalLabel?: string;
  type: string;
  placeholder: string;
  required: boolean;
  options?: string[];
};

type ContactFormContent = {
  title: string;
  fields: ContactField[];
  submitLabel: string;
  privacyText: string;
  privacyLinkLabel: string;
  privacyLinkTarget: string;
};

type ContactFormProps = {
  form: ContactFormContent;
};

type FormValues = Record<string, string>;

export function ContactForm({ form }: ContactFormProps) {
  const initialValues = useMemo(
    () =>
      Object.fromEntries(
        form.fields.map((field) => [field.id, ""]),
      ) as FormValues,
    [form.fields],
  );

  const [values, setValues] = useState<FormValues>(initialValues);

  function updateValue(id: string, value: string) {
    setValues((current) => ({
      ...current,
      [id]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Submission endpoint/service can be connected here later.
  }

  const nameField = form.fields.find((field) => field.id === "name");

  const emailField = form.fields.find((field) => field.id === "email");

  const organizationField = form.fields.find(
    (field) => field.id === "organization",
  );

  const subjectField = form.fields.find((field) => field.id === "subject");

  const messageField = form.fields.find((field) => field.id === "message");

  return (
    <div className="rounded-lg border border-blue-100 bg-white p-6 md:p-7">
      <h2 className="font-serif text-3xl font-extrabold leading-tight tracking-tight text-[#102a8f] md:text-4xl">
        {form.title}
      </h2>

      <form onSubmit={handleSubmit} className="mt-7">
        <div className="grid gap-x-7 gap-y-6 md:grid-cols-2">
          {nameField ? (
            <ContactInput
              field={nameField}
              value={values[nameField.id] ?? ""}
              onChange={updateValue}
            />
          ) : null}

          {emailField ? (
            <ContactInput
              field={emailField}
              value={values[emailField.id] ?? ""}
              onChange={updateValue}
            />
          ) : null}

          {organizationField ? (
            <ContactInput
              field={organizationField}
              value={values[organizationField.id] ?? ""}
              onChange={updateValue}
            />
          ) : null}

          {subjectField ? (
            <div className="space-y-2">
              <Label
                htmlFor={subjectField.id}
                className="text-sm font-semibold text-[#102a8f]"
              >
                {subjectField.label}
              </Label>

              <div className="relative">
                <select
                  id={subjectField.id}
                  name={subjectField.id}
                  required={subjectField.required}
                  value={values[subjectField.id] ?? ""}
                  onChange={(event) =>
                    updateValue(subjectField.id, event.target.value)
                  }
                  className={cn(
                    "flex h-12 w-full appearance-none rounded-md border border-blue-200 bg-white px-4 pr-10 text-sm text-[#102a8f] outline-none transition-colors",
                    "focus:border-[#143bd4] focus:ring-2 focus:ring-[#143bd4]/15",
                  )}
                >
                  <option value="" disabled>
                    {subjectField.placeholder}
                  </option>

                  {subjectField.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#143bd4]"
                  aria-hidden="true"
                />
              </div>
            </div>
          ) : null}

          {messageField ? (
            <div className="space-y-2 md:col-span-2">
              <Label
                htmlFor={messageField.id}
                className="text-sm font-semibold text-[#102a8f]"
              >
                {messageField.label}
              </Label>

              <textarea
                id={messageField.id}
                name={messageField.id}
                required={messageField.required}
                placeholder={messageField.placeholder}
                value={values[messageField.id] ?? ""}
                onChange={(event) =>
                  updateValue(messageField.id, event.target.value)
                }
                className="min-h-48 w-full resize-y rounded-md border border-blue-200 bg-white px-4 py-3 text-sm text-[#102a8f] shadow-none outline-none placeholder:text-slate-400 focus:border-[#143bd4] focus:ring-2 focus:ring-[#143bd4]/20"
              />
            </div>
          ) : null}
        </div>

        <Button
          type="submit"
          className="mt-5 min-w-60 bg-[#0b3d91] px-8 py-6 text-base font-semibold text-white hover:bg-[#082f73]"
        >
          {form.submitLabel}
        </Button>

        <p className="mt-4 text-sm leading-6 text-[#4164bf]">
          {privacyTextBeforeLink(form.privacyText, form.privacyLinkLabel)}

          <a
            href={`/pages/${form.privacyLinkTarget}`}
            className="text-[#143bd4] underline underline-offset-2"
          >
            {form.privacyLinkLabel}
          </a>

          {privacyTextAfterLink(form.privacyText, form.privacyLinkLabel)}
        </p>
      </form>
    </div>
  );
}

type ContactInputProps = {
  field: ContactField;
  value: string;
  onChange: (id: string, value: string) => void;
};

function ContactInput({ field, value, onChange }: ContactInputProps) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={field.id}
        className="text-sm font-semibold text-[#102a8f]"
      >
        {field.label}

        {field.optionalLabel ? (
          <span className="ml-1 font-normal text-[#4164bf]">
            ({field.optionalLabel})
          </span>
        ) : null}
      </Label>

      <Input
        id={field.id}
        name={field.id}
        type={field.type}
        required={field.required}
        placeholder={field.placeholder}
        value={value}
        onChange={(event) => onChange(field.id, event.target.value)}
        className="h-12 border-blue-200 px-4 text-sm text-[#102a8f] shadow-none placeholder:text-slate-400 focus-visible:ring-[#143bd4]/20"
      />
    </div>
  );
}

function privacyTextBeforeLink(text: string, linkLabel: string) {
  const index = text.indexOf(linkLabel);

  if (index === -1) {
    return `${text} `;
  }

  return text.slice(0, index);
}

function privacyTextAfterLink(text: string, linkLabel: string) {
  const index = text.indexOf(linkLabel);

  if (index === -1) {
    return "";
  }

  return text.slice(index + linkLabel.length);
}
