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

      <section className="w-full py-8 md:py-10">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
          <div className="space-y-8">
            {faqContent.categories.map((category, categoryIndex) => (
              <section
                key={category.id}
                id={category.id}
                className="scroll-mt-24"
              >
                <h2 className="mb-2 font-serif text-3xl font-extrabold leading-tight tracking-tight text-[#102a8f] md:text-4xl">
                  {category.title}
                </h2>

                <div>
                  {category.questions.map((item, questionIndex) => (
                    <FAQItem
                      key={item.question}
                      question={item.question}
                      answer={item.answer}
                      link={item.link}
                      defaultOpen={categoryIndex === 0 && questionIndex === 0}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-blue-100 bg-sky-50/70 p-6 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#102a8f]">
                {faqContent.cta.title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#3551a4]">
                {faqContent.cta.description}
              </p>
            </div>

            <a
              href={`/pages/${faqContent.cta.actionTarget}`}
              className="mt-4 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#143bd4] underline-offset-4 hover:underline md:mt-0"
            >
              {faqContent.cta.actionLabel}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
