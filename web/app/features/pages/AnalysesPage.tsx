import { useMemo, useState } from "react";

import { AnalysisCard } from "@/components/pages/AnalysisCard";
import { InstitutionalHero } from "@/components/pages/InstitutionalHero";

import analysesContent from "./content/analyses.json";

export function AnalysesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");

  const items = useMemo(() => {
    const filtered =
      activeFilter === "All"
        ? analysesContent.items
        : analysesContent.items.filter((item) =>
            item.categories.includes(activeFilter),
          );

    return [...filtered].sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return sortOrder === "recent" ? bTime - aTime : aTime - bTime;
    });
  }, [activeFilter, sortOrder]);

  return (
    <main className="w-full bg-white">
      <InstitutionalHero
        kicker={analysesContent.hero.kicker}
        title={analysesContent.hero.title}
        description={analysesContent.hero.description}
      />

      <section className="w-full py-7 md:py-9">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
          <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {analysesContent.filters.map((filter) => {
                const isActive = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={
                      isActive
                        ? "rounded-md bg-[#0b3d91] px-4 py-2 text-sm font-semibold text-white"
                        : "rounded-md bg-sky-50 px-4 py-2 text-sm font-semibold text-[#143bd4] transition-colors hover:bg-sky-100"
                    }
                    aria-pressed={isActive}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            <label className="flex items-center gap-2 text-sm text-[#3551a4]">
              <span>{analysesContent.sort.label}:</span>
              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as "recent" | "oldest")
                }
                className="rounded-md border border-blue-100 bg-white px-3 py-2 font-semibold text-[#102a8f] outline-none focus:border-[#143bd4]"
              >
                <option value="recent">{analysesContent.sort.default}</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </div>

          <div className="divide-y divide-blue-100">
            {items.map((item, index) => (
              <AnalysisCard
                key={item.id}
                item={item}
                imagePosition={index % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>

          <div className="mt-7 flex justify-center">
            <button
              type="button"
              className="rounded-md bg-sky-50 px-6 py-3 text-sm font-semibold text-[#143bd4] hover:bg-sky-100"
            >
              {analysesContent.loadMoreLabel}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
