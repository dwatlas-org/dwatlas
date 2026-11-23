import { ArrowUpRight } from "lucide-react";

import { FAQItem } from "@/components/pages/FAQItem";
import { InstitutionalHero } from "@/components/pages/InstitutionalHero";

import faqContent from "./content/faq.json";

export function FAQPage() {
  return (
    <main className="w-full bg-white">
      <InstitutionalHero
        kicker={faqContent.hero.kicker}
        title={faqContent.hero.title}
        description={faqContent.hero.description}
      />

      <section className="w-full pt-3 pb-8 md:pt-4 md:pb-10">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
          <div className="space-y-12">
            {faqContent.categories.map((category) => (
              <section
                key={category.id}
                id={category.id}
                className="scroll-mt-24"
              >
                <h2 className="!mt-0 mb-2 font-serif text-3xl font-extrabold leading-tight tracking-tight text-[#102a8f] md:text-4xl">
                  {category.title}
                </h2>

                <div className="space-y-2">
                  {category.questions.map((item) => (
                    <FAQItem
                      key={item.question}
                      question={item.question}
                      answer={item.answer}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 grid gap-5 rounded-xl border border-blue-100 bg-sky-50/70 px-6 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-8 lg:px-8">
            <div className="min-w-0">
              <h2 className="!mt-0 font-serif text-2xl font-bold leading-tight text-[#102a8f]">
                {faqContent.cta.title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#3551a4]">
                {faqContent.cta.description}
              </p>
            </div>

            <a
              href={`/pages/${faqContent.cta.actionTarget}`}
              className="inline-flex w-fit shrink-0 self-start items-center justify-center gap-2 rounded-md border border-[#143bd4] bg-white px-6 py-3 text-base font-semibold text-[#143bd4] transition-colors hover:bg-blue-50"
            >
              {faqContent.cta.actionLabel}
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
