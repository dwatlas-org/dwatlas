import { ArrowUpRight, ChevronDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type FAQLink = {
  label: string;
  target: string;
};

type FAQItemProps = {
  question: string;
  answer: string[] | null;
  link?: FAQLink | null;
  defaultOpen?: boolean;
};

export function FAQItem({
  question,
  answer,
  link,
  defaultOpen = false,
}: FAQItemProps) {
  const hasContent = Boolean(answer?.length || link);

  return (
    <Collapsible
      defaultOpen={defaultOpen && hasContent}
      disabled={!hasContent}
      className="group border-b border-blue-100"
    >
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center justify-between gap-4 px-5 py-3 text-left text-sm font-semibold text-[#102a8f] transition-colors",
          hasContent ? "cursor-pointer hover:bg-sky-50/60" : "cursor-default",
          "group-data-[state=open]:bg-sky-50/80",
        )}
        aria-label={hasContent ? `Toggle answer for ${question}` : question}
      >
        <span>{question}</span>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            hasContent
              ? "text-[#143bd4] group-data-[state=open]:rotate-180"
              : "text-[#143bd4]",
          )}
          aria-hidden="true"
        />
      </CollapsibleTrigger>

      {hasContent ? (
        <CollapsibleContent>
          <div className="bg-sky-50/60 px-5 pb-5 pt-2">
            {answer?.length ? (
              <div className="space-y-3 text-sm leading-6 text-[#3551a4] md:text-[15px]">
                {answer.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            {link ? (
              <a
                href={`/pages/${link.target}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#143bd4] underline underline-offset-2 hover:no-underline"
              >
                {link.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </CollapsibleContent>
      ) : null}
    </Collapsible>
  );
}
