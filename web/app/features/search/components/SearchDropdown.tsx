import type { SearchRecord } from "../types/search";
import { SearchResultCard } from "./SearchResultCard";

type SearchDropdownProps = {
  query: string;
  results: SearchRecord[];
  isLoading: boolean;
  isOpen: boolean;
  onSelectResult?: () => void;
};

export function SearchDropdown({
  query,
  results,
  isLoading,
  isOpen,
  onSelectResult,
}: SearchDropdownProps) {
  if (!isOpen || !query.trim()) {
    return null;
  }

  return (
    <div
      className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
      role="region"
      aria-label="Search results"
    >
      {isLoading && results.length === 0 ? (
        <div className="px-4 py-5 text-sm text-slate-500">Searching...</div>
      ) : results.length > 0 ? (
        <div>
          {results.map((result) => (
            <SearchResultCard
              key={result.objectID}
              result={result}
              onSelect={onSelectResult}
            />
          ))}
        </div>
      ) : (
        <div className="px-4 py-5">
          <p className="text-sm font-medium text-slate-800">No results found</p>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            Try another term or a broader keyword.
          </p>
        </div>
      )}
    </div>
  );
}
