import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type MethodologyNavigationItem = {
  number: string;
  id: string;
  title: string;
  contentAvailable: boolean;
};

type MethodologySidebarProps = {
  navigation: MethodologyNavigationItem[];
  searchPlaceholder: string;
};

export function MethodologySidebar({
  navigation,
  searchPlaceholder,
}: MethodologySidebarProps) {
  const { toggleSidebar } = useSidebar();

  const [query, setQuery] = useState("");

  const [activeId, setActiveId] = useState(
    navigation.find((item) => item.contentAvailable)?.id ?? "",
  );

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return navigation;
    }

    return navigation.filter((item) =>
      `${item.number} ${item.title}`.toLowerCase().includes(normalizedQuery),
    );
  }, [navigation, query]);

  useEffect(() => {
    const availableIds = navigation
      .filter((item) => item.contentAvailable)
      .map((item) => item.id);

    if (availableIds.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-18% 0px -65% 0px",
        threshold: [0.05, 0.2, 0.5],
      },
    );

    availableIds.forEach((id) => {
      const element = document.getElementById(id);

      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [navigation]);

  function handleNavigation(item: MethodologyNavigationItem) {
    if (!item.contentAvailable) {
      return;
    }

    const target = document.getElementById(item.id);

    if (!target) {
      return;
    }

    setActiveId(item.id);

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", `#${item.id}`);
  }

  return (
    <aside className="sticky top-0 hidden h-[calc(100vh-4rem)] w-[17rem] shrink-0 self-start border-r border-slate-200 bg-white lg:block">
      <div className="flex h-full flex-col px-4 py-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#163bc7]"
              aria-hidden="true"
            />

            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 border-slate-200 bg-white pl-9 text-sm shadow-none"
              aria-label="Search methodology sections"
            />
          </div>

          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Collapse methodology sidebar"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
          >
            <ChevronLeft className="size-4" />
          </button>
        </div>

        <nav
          className="min-h-0 flex-1 overflow-y-auto pr-1"
          aria-label="Methodology sections"
        >
          <ol className="m-0 list-none space-y-1 p-0">
            {visibleItems.map((item) => {
              const isActive = activeId === item.id;
              const isDisabled = !item.contentAvailable;

              return (
                <li key={item.id} className="list-none">
                  <button
                    type="button"
                    onClick={() => handleNavigation(item)}
                    disabled={isDisabled}
                    className={cn(
                      "relative flex w-full items-start gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",

                      isActive &&
                        "bg-sky-50 font-semibold text-[#102a8f] before:absolute before:bottom-1 before:left-0 before:top-1 before:w-1 before:rounded-r-full before:bg-[#ff5b24]",

                      !isActive &&
                        !isDisabled &&
                        "text-[#17307f] hover:bg-slate-50",

                      isDisabled &&
                        "cursor-not-allowed text-slate-400 opacity-70",
                    )}
                  >
                    <span
                      className={cn(
                        "w-6 shrink-0 font-medium",

                        isDisabled ? "text-slate-400" : "text-[#ff5b24]",
                      )}
                    >
                      {item.number}
                    </span>

                    <span className="min-w-0 leading-5">{item.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </aside>
  );
}
