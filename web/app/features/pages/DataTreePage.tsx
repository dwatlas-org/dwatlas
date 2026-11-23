import { ArrowUpRight, FileText } from "lucide-react";

import { DataTreeDiagram } from "@/components/pages/DataTreeDiagram";
import { InstitutionalHero } from "@/components/pages/InstitutionalHero";

import dataTreeContent from "./content/data-tree.json";

export function DataTreePage() {
  return (
    <main className="w-full bg-white">
      <InstitutionalHero
        kicker={dataTreeContent.hero.kicker}
        title={dataTreeContent.hero.title}
        description={dataTreeContent.hero.description}
      />

      <section className="w-full py-8 md:py-10">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
          <div className="relative left-1/2 w-[calc(100vw-3rem)] max-w-[1440px] -translate-x-1/2">
            <DataTreeDiagram diagram={dataTreeContent.diagram} />
          </div>

          <div className="mt-8 space-y-4 text-[15px] leading-7 text-[#17307f] md:text-base">
            {dataTreeContent.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <a
              href={`/pages/${dataTreeContent.methodologyAction.target}`}
              className="inline-flex items-center gap-2 rounded-md border border-[#143bd4] bg-white px-4 py-2 text-sm font-semibold text-[#102a8f] transition-colors hover:bg-sky-50"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              {dataTreeContent.methodologyAction.label}
            </a>
          </div>

          <div className="mt-8 grid gap-5 rounded-xl border border-blue-100 bg-sky-50/70 px-6 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-8 lg:px-8">
            <div className="min-w-0">
              <h2 className="!m-0 font-serif text-2xl font-bold leading-tight text-[#102a8f]">
                {dataTreeContent.cta.title}
              </h2>
              <p className="!mb-0 mt-3 max-w-2xl text-sm leading-7 text-[#3551a4]">
                {dataTreeContent.cta.description}
              </p>
            </div>

            <a
              href={`/pages/${dataTreeContent.cta.actionTarget}`}
              className="inline-flex w-fit shrink-0 self-start items-center justify-center gap-2 rounded-md border border-[#143bd4] bg-white px-5 py-3 text-base font-semibold text-[#143bd4] transition-colors hover:bg-blue-50"
            >
              {dataTreeContent.cta.actionLabel}
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
