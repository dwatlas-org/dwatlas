import { useEffect, useRef, useState } from "react";

import { searchClient, searchIndexName } from "../lib/algolia";
import type { SearchRecord } from "../types/search";
import { SearchBar } from "./SearchBar";
import { SearchDropdown } from "./SearchDropdown";

const SEARCH_DEBOUNCE_MS = 250;
const MAX_RESULTS = 6;

type SearchProps = {
  className?: string;
};

export function Search({ className = "" }: SearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    setIsOpen(true);

    const currentRequestId = ++requestIdRef.current;

    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await searchClient.search({
          requests: [
            {
              indexName: searchIndexName,
              query: trimmedQuery,
              hitsPerPage: MAX_RESULTS,
              attributesToRetrieve: [
                "objectID",
                "id",
                "type",
                "section",
                "title",
                "description",
                "url",
                "keywords",
              ],
            },
          ],
        });

        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        const firstResult = response.results[0];

        if (firstResult && "hits" in firstResult) {
          setResults(firstResult.hits as SearchRecord[]);
        } else {
          setResults([]);
        }
      } catch (error) {
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        console.error("Algolia search failed:", error);
        setResults([]);
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleClear() {
    requestIdRef.current += 1;
    setQuery("");
    setResults([]);
    setIsLoading(false);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <SearchBar
        query={query}
        isLoading={isLoading}
        onQueryChange={setQuery}
        onFocus={() => {
          if (query.trim()) {
            setIsOpen(true);
          }
        }}
        onClear={handleClear}
      />

      <SearchDropdown
        query={query}
        results={results}
        isLoading={isLoading}
        isOpen={isOpen}
        onSelectResult={() => setIsOpen(false)}
      />
    </div>
  );
}
