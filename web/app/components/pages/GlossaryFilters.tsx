import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type GlossaryCategory = {
  id: string;
  label: string;
};

type GlossaryFiltersProps = {
  query: string;
  onQueryChange: (value: string) => void;
  categories: GlossaryCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  alphabet: string[];
  availableLetters: Set<string>;
  onLetterSelect: (letter: string) => void;
  searchPlaceholder: string;
};

export function GlossaryFilters({
  query,
  onQueryChange,
  categories,
  activeCategory,
  onCategoryChange,
  alphabet,
  availableLetters,
  onLetterSelect,
  searchPlaceholder,
}: GlossaryFiltersProps) {
  return (
    <div>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#143bd4]"
          aria-hidden="true"
        />

        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Search glossary"
          className="h-11 rounded-md border-blue-100 bg-white pl-11 text-sm shadow-none"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-[#123482] bg-[#123482] text-white"
                  : "border-blue-100 bg-white text-[#17307f] hover:bg-sky-50",
              )}
              aria-pressed={isActive}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        {alphabet.map((letter) => {
          const isAvailable = availableLetters.has(letter);

          return (
            <button
              key={letter}
              type="button"
              disabled={!isAvailable}
              onClick={() => onLetterSelect(letter)}
              className={cn(
                "text-sm font-medium transition-colors",
                isAvailable
                  ? "text-[#102a8f] hover:text-[#143bd4] hover:underline"
                  : "cursor-default text-slate-300",
              )}
              aria-label={`Go to glossary terms beginning with ${letter}`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
