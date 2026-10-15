import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type ResearchOutput = {
  type: string;
  title: string;
  authors: string;
  year: number;
  actionLabel: string;
  url?: string | null;
};

type ResearchOutputsProps = {
  outputs: ResearchOutput[];
};

export function ResearchOutputs({ outputs }: ResearchOutputsProps) {
  if (!outputs.length) {
    return (
      <p className="text-sm leading-6 text-slate-500">
        No outputs have been added yet.
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {outputs.map((output, index) => (
        <div key={`${output.type}-${output.title}-${output.year}`}>
          <article className="grid gap-4 py-5 md:grid-cols-[1fr_auto] md:items-center">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-slate-300 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700"
                >
                  {output.type}
                </Badge>

                <span className="text-xs font-medium text-slate-500">
                  {output.year}
                </span>
              </div>

              <h4 className="font-serif text-lg font-bold leading-snug text-[#112040]">
                {output.title}
              </h4>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                {output.authors}
              </p>
            </div>

            {output.url ? (
              <a
                href={output.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-fit items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                {output.actionLabel}

                <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-fit"
                disabled
              >
                {output.actionLabel}
              </Button>
            )}
          </article>

          {index < outputs.length - 1 ? (
            <Separator className="bg-slate-200" />
          ) : null}
        </div>
      ))}
    </div>
  );
}
