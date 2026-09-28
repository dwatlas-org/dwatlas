import { ChevronDown, Mail } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type PersonCardProps = {
  person: {
    id: string;
    name: string;
    role: string;
    affiliation: string;
    description: string;
    email: string;
    imageRef?: string | null;
    contributions?: string | null;
    placeholder?: boolean;
  };
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PersonCard({ person }: PersonCardProps) {
  const contributionLabel = person.placeholder
    ? "Contributions to the network"
    : `${person.name}'s contributions to the network`;

  return (
    <Card className="h-full rounded-lg border border-slate-200 bg-white shadow-none">
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex min-w-0 items-start gap-5">
          <div
            className="shrink-0 overflow-hidden rounded-md"
            style={{
              width: "120px",
              height: "150px",
              flex: "0 0 120px",
            }}
          >
            {person.imageRef ? (
              <img
                src={person.imageRef}
                alt={`${person.name} profile`}
                className="block"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm font-semibold text-slate-600">
                {getInitials(person.name)}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <h3 className="font-serif text-xl font-bold leading-tight text-slate-900">
              {person.name}
            </h3>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {person.role}
            </p>

            <p className="mt-1 text-sm leading-5 text-slate-600">
              {person.affiliation}
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-700">
          {person.description}
        </p>

        <div className="mt-auto pt-5">
          <Collapsible>
            <CollapsibleTrigger
              className="group flex w-full items-center justify-between rounded-md bg-slate-100 px-4 py-2.5 text-left text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-200 disabled:cursor-default disabled:opacity-100"
              disabled={!person.contributions}
            >
              <span>{contributionLabel}</span>

              <ChevronDown
                className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180"
                aria-hidden="true"
              />
            </CollapsibleTrigger>

            {person.contributions ? (
              <CollapsibleContent className="px-1 pt-3 text-sm leading-6 text-slate-700">
                {person.contributions}
              </CollapsibleContent>
            ) : null}
          </Collapsible>

          <a
            href={`mailto:${person.email}`}
            className="mt-4 inline-flex items-center gap-2 text-sm text-slate-800 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-950"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span>{person.email}</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
