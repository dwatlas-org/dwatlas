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
          <DataTreeDiagram diagram={dataTreeContent.diagram} />

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

          <div className="mt-8 rounded-xl border border-blue-100 bg-sky-50/70 p-6 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#102a8f]">
                {dataTreeContent.cta.title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#3551a4]">
                {dataTreeContent.cta.description}
              </p>
            </div>

            <a
              href={`/pages/${dataTreeContent.cta.actionTarget}`}
              className="mt-4 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#143bd4] underline-offset-4 hover:underline md:mt-0"
            >
              {dataTreeContent.cta.actionLabel}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
