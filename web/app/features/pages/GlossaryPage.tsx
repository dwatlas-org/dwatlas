import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { GlossaryEntry } from "@/components/pages/GlossaryEntry";
import { GlossaryFilters } from "@/components/pages/GlossaryFilters";
import { InstitutionalHero } from "@/components/pages/InstitutionalHero";

import glossaryContent from "./content/glossary.json";

type GlossaryTerm = (typeof glossaryContent.terms)[number];

export function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const activeCategoryLabel = glossaryContent.categories.find(
    (category) => category.id === activeCategory,
  )?.label;

  const filteredTerms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return glossaryContent.terms.filter((term) => {
      const matchesQuery =
        !normalizedQuery ||
        term.term.toLowerCase().includes(normalizedQuery) ||
        term.definition?.toLowerCase().includes(normalizedQuery) ||
        term.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      if (!matchesQuery) {
        return false;
      }

      if (activeCategory === "all") {
        return true;
      }

      if (!activeCategoryLabel) {
        return true;
      }

      return term.tags.some(
        (tag) => tag.toLowerCase() === activeCategoryLabel.toLowerCase(),
      );
    });
  }, [activeCategory, activeCategoryLabel, query]);

  const groupedTerms = useMemo(() => {
    return filteredTerms.reduce<Record<string, GlossaryTerm[]>>(
      (groups, term) => {
        if (!groups[term.letter]) {
          groups[term.letter] = [];
        }

        groups[term.letter].push(term);
        return groups;
      },
      {},
    );
  }, [filteredTerms]);

  const availableLetters = useMemo(
    () => new Set(Object.keys(groupedTerms)),
    [groupedTerms],
  );

  function handleLetterSelect(letter: string) {
    const target = document.getElementById(`glossary-${letter}`);

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", `#glossary-${letter}`);
  }

  return (
    <main className="w-full bg-white">
      <InstitutionalHero
        kicker={glossaryContent.hero.kicker}
        title={glossaryContent.hero.title}
        description={glossaryContent.hero.description}
      />

      <section className="w-full py-8 md:py-10">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
          <GlossaryFilters
            query={query}
            onQueryChange={setQuery}
            categories={glossaryContent.categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            alphabet={glossaryContent.alphabet}
            availableLetters={availableLetters}
            onLetterSelect={handleLetterSelect}
            searchPlaceholder={glossaryContent.search.placeholder}
          />

          <div className="mt-8 space-y-8">
            {Object.entries(groupedTerms).map(([letter, terms]) => (
              <section
                key={letter}
                id={`glossary-${letter}`}
                className="scroll-mt-24"
              >
                <div className="mb-2 border-b border-slate-200 pb-1">
                  <h2 className="font-serif text-4xl font-extrabold leading-none text-[#102a8f]">
                    {letter}
                  </h2>
                </div>

                <div>
                  {terms.map((term) => (
                    <GlossaryEntry
                      key={`${term.letter}-${term.term}`}
                      term={term.term}
                      definition={term.definition}
                      source={term.source}
                      tags={term.tags}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {filteredTerms.length === 0 ? (
            <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 px-5 py-6 text-center">
              <p className="text-sm font-semibold text-[#102a8f]">
                No glossary terms found.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try another search term or category.
              </p>
            </div>
          ) : null}

          <div className="mt-10 rounded-xl border border-blue-100 bg-sky-50/70 p-6 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#102a8f]">
                {glossaryContent.cta.title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#3551a4]">
                {glossaryContent.cta.description}
              </p>
            </div>

            <a
              href={`/pages/${glossaryContent.cta.actionTarget}`}
              className="mt-4 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#143bd4] underline-offset-4 hover:underline md:mt-0"
            >
              {glossaryContent.cta.actionLabel}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
