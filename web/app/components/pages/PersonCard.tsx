import { ChevronDown, Mail, UserRound } from "lucide-react";

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

export function PersonCard({ person }: PersonCardProps) {
  return (
    <Card className="min-h-[380px] rounded-lg border border-slate-200 bg-white shadow-none">
      <CardContent className="flex min-h-[380px] flex-col p-5">
        {/* Profile information */}
        <div className="flex min-w-0 items-start gap-5">
          <div className="flex h-[150px] w-[120px] shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100">
            {person.imageRef ? (
              <img
                src={person.imageRef}
                alt={`${person.name} profile`}
                className="block h-full w-full object-cover object-center"
              />
            ) : (
              <UserRound
                className="h-14 w-14 text-slate-400"
                strokeWidth={1.5}
                aria-hidden="true"
              />
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

        {/* Description */}
        <p className="mt-5 min-h-[72px] text-sm leading-6 text-slate-700">
          {person.description}
        </p>

        {/* Contributions */}
        <div className="pt-5">
          <Collapsible>
            <CollapsibleTrigger
              disabled={!person.contributions}
              className="group flex w-full items-center justify-between rounded-md bg-slate-100 px-4 py-2.5 text-left text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-200 disabled:cursor-default disabled:opacity-100"
            >
              <span>Contributions to the network</span>

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
        </div>

        {/* Contact information */}
        <div className="mt-auto pt-4">
          <a
            href={`mailto:${person.email}`}
            className="inline-flex items-center gap-2 break-all text-sm text-slate-800 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-950"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{person.email}</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
