import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

import { ResearchOutputs } from "./ResearchOutputs";

type ResearchPerson = {
  name: string;
  role: string;
};

type ResearchPeriod = {
  start: string;
  end: string;
  label: string;
};

type ResearchOutput = {
  type: string;
  title: string;
  authors: string;
  year: number;
  actionLabel: string;
  url?: string | null;
};

type ResearchDetails = {
  people?: ResearchPerson[];
  period?: ResearchPeriod;
  institutions?: string[];
  funding?: string[];
  contributionTitle?: string;
  contribution?: string[];
};

export type ResearchProject = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageRef?: string | null;
  imageAlt?: string | null;
  details?: ResearchDetails | null;
  outputs?: ResearchOutput[];
};

type ResearchCardProps = {
  project: ResearchProject;
};

function DetailList({ label, items }: { label: string; items: string[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <ul className="mt-2 list-none space-y-1 p-0 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function ResearchCard({ project }: ResearchCardProps) {
  const hasDetails = Boolean(project.details);
  const hasOutputs = Boolean(project.outputs?.length);
  const canExpand = hasDetails || hasOutputs;

  return (
    <Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-none">
      <CardContent className="p-0">
        <div className="grid overflow-hidden lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex min-w-0 flex-col p-6 md:p-7">
            <h2 className="mt-3 max-w-3xl font-serif text-2xl font-extrabold leading-tight tracking-tight text-[#112040] md:text-3xl">
              {project.title}
            </h2>

            <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-700">
              {project.description}
            </p>

            {project.tags.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-full border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative h-full overflow-hidden border-l border-slate-200 bg-[#edf1f5]">
            {project.imageRef ? (
              <img
                src={project.imageRef}
                alt={project.imageAlt ?? ""}
                className="absolute inset-0 h-full w-full scale-[1.12] object-cover object-center"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-8 text-center text-sm leading-6 text-slate-500">
                Project image
              </div>
            )}
          </div>
        </div>

        <Separator className="bg-slate-200" />

        <Collapsible>
          <CollapsibleTrigger
            disabled={!canExpand}
            className="group flex w-full items-center justify-between bg-[#f4f6f8] px-6 py-4 text-left text-sm font-bold text-[#112040] transition-colors hover:bg-[#edf1f5] disabled:cursor-default disabled:opacity-100 md:px-7"
          >
            <span>
              {hasDetails
                ? "Project details"
                : hasOutputs
                  ? "Outputs"
                  : "More information"}
            </span>

            <ChevronDown
              className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180"
              aria-hidden="true"
            />
          </CollapsibleTrigger>

          {canExpand ? (
            <CollapsibleContent>
              <div className="space-y-8 px-6 py-7 md:px-7">
                {project.details ? (
                  <div className="grid gap-7 md:grid-cols-2">
                    {project.details.people?.length ? (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                          People
                        </p>

                        <div className="mt-2 space-y-2">
                          {project.details.people.map((person) => (
                            <div
                              key={`${person.name}-${person.role}`}
                              className="text-sm leading-6 text-slate-700"
                            >
                              <span className="font-semibold text-slate-900">
                                {person.name}
                              </span>
                              <span className="text-slate-500">
                                {" "}
                                · {person.role}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {project.details.period ? (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                          Period
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {project.details.period.label}
                        </p>
                      </div>
                    ) : null}

                    <DetailList
                      label="Institutions"
                      items={project.details.institutions ?? []}
                    />

                    <DetailList
                      label="Funding"
                      items={project.details.funding ?? []}
                    />
                  </div>
                ) : null}

                {project.details?.contribution?.length ? (
                  <div className="rounded-md bg-[#f4f6f8] p-5">
                    <h3 className="font-serif text-lg font-bold text-[#112040]">
                      {project.details.contributionTitle ??
                        "Contribution to Delivery Worker Atlas"}
                    </h3>

                    <div className="mt-3 space-y-3">
                      {project.details.contribution.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-sm leading-6 text-slate-700"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}

                {hasOutputs ? (
                  <div>
                    <h3 className="mb-3 font-serif text-xl font-bold text-[#112040]">
                      Outputs
                    </h3>

                    <ResearchOutputs outputs={project.outputs ?? []} />
                  </div>
                ) : null}
              </div>
            </CollapsibleContent>
          ) : null}
        </Collapsible>
      </CardContent>
    </Card>
  );
}
