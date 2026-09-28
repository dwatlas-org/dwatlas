import { LoaderCircle, SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchBarProps = {
  query: string;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
  onFocus: () => void;
  onClear: () => void;
};

export function SearchBar({
  query,
  isLoading,
  onQueryChange,
  onFocus,
  onClear,
}: SearchBarProps) {
  return (
    <div className="relative">
      <SearchIcon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        aria-hidden="true"
      />

      <Input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        onFocus={onFocus}
        placeholder="Search Delivery Worker Atlas..."
        autoComplete="off"
        aria-label="Search Delivery Worker Atlas"
        className="h-11 w-full rounded-lg border-slate-300 bg-white pl-10 pr-10 text-sm text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-300"
      />

      {isLoading ? (
        <LoaderCircle
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-500"
          aria-hidden="true"
        />
      ) : query ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
