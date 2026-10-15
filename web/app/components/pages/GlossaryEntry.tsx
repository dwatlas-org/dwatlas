import { ChevronDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type GlossaryEntryProps = {
  term: string;
  definition: string | null;
  source: string | null;
  tags: string[];
};

export function GlossaryEntry({
  term,
  definition,
  source,
  tags,
}: GlossaryEntryProps) {
  const hasDefinition = Boolean(definition);

  return (
    <Collapsible
      defaultOpen={term === "Worker-generated data"}
      disabled={!hasDefinition}
      className="group border-b border-blue-100"
    >
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center justify-between gap-4 px-2 py-3 text-left text-sm font-semibold text-[#102a8f]",
          hasDefinition
            ? "cursor-pointer hover:bg-sky-50/60"
            : "cursor-default",
        )}
        aria-label={
          hasDefinition ? `Toggle definition for ${term}` : `${term} definition`
        }
      >
        <span>{term}</span>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            hasDefinition
              ? "text-[#143bd4] group-data-[state=open]:rotate-180"
              : "text-slate-300",
          )}
          aria-hidden="true"
        />
      </CollapsibleTrigger>

      {hasDefinition ? (
        <CollapsibleContent>
          <div className="border-t border-blue-100 bg-sky-50/40 px-5 py-4">
            <p className="text-sm leading-6 text-[#3551a4]">{definition}</p>

            {source ? (
              <p className="mt-3 text-sm text-[#3551a4]">
                <span className="font-medium">Source:</span> {source}.
              </p>
            ) : null}

            {tags.length > 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-[#143bd4]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </CollapsibleContent>
      ) : null}
    </Collapsible>
  );
}
