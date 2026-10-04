import { ChevronRight } from "lucide-react";

import { InstitutionalHero } from "@/components/pages/InstitutionalHero";
import { MethodologySection } from "@/components/pages/MethodologySection";
import { MethodologySidebar } from "@/components/pages/MethodologySidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";

import methodologyContent from "./content/methodology.json";

function MethodologyContent() {
  const { open, toggleSidebar } = useSidebar();

  return (
    <div className="flex w-full items-start bg-white">
      {open ? (
        <MethodologySidebar
          navigation={methodologyContent.navigation}
          searchPlaceholder={methodologyContent.search.placeholder}
        />
      ) : null}

      <div className="relative min-w-0 flex-1 bg-white">
        {!open ? (
          <div className="sticky top-0 z-20 flex h-12 items-center border-b border-slate-100 bg-white/95 px-3 backdrop-blur">
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Expand methodology sidebar"
              className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        ) : null}

        <div className="mx-auto w-full max-w-6xl px-6 py-8 md:px-8 lg:py-10">
          <div className="space-y-10">
            {methodologyContent.sections.map((section) => (
              <MethodologySection key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MethodologyPage() {
  return (
    <main className="w-full bg-white">
      <InstitutionalHero
        kicker={methodologyContent.hero.kicker}
        title={methodologyContent.hero.title}
        description={methodologyContent.hero.description}
      />

      <SidebarProvider
        defaultOpen
        className="min-h-0 w-full items-stretch bg-white"
      >
        <MethodologyContent />
      </SidebarProvider>
    </main>
  );
}
