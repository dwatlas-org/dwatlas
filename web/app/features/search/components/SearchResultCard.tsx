import { ArrowUpRight } from "lucide-react";
import type { SearchRecord } from "../types/search";

type SearchResultCardProps = {
  result: SearchRecord;
  onSelect?: () => void;
};

function formatType(type: SearchRecord["type"]) {
  switch (type) {
    case "dashboard":
      return "Data Panel";
    case "institutional":
      return "Institutional";
    case "analysis":
      return "Analysis";
    case "methodology":
      return "Methodology";
    case "glossary":
      return "Glossary";
    case "faq":
      return "FAQ";
    default:
      return type;
  }
}

export function SearchResultCard({ result, onSelect }: SearchResultCardProps) {
  return (
    <a
      href={result.url}
      onClick={onSelect}
      className="group block border-b border-slate-200 px-4 py-3.5 transition-colors last:border-b-0 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-serif text-base font-bold leading-snug text-[#112040]">
            {result.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">
            {result.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span>{formatType(result.type)}</span>
            <span aria-hidden="true">›</span>
            <span>{result.section}</span>
          </div>
        </div>

        <ArrowUpRight
          className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-[#112040]"
          aria-hidden="true"
        />
      </div>
    </a>
  );
}
