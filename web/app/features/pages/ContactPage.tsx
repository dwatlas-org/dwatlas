import { ContactForm } from "@/components/pages/ContactForm";
import { InstitutionalHero } from "@/components/pages/InstitutionalHero";

import contactContent from "./content/contact.json";

export function ContactPage() {
  return (
    <main className="flex min-h-full w-full flex-col bg-white">
      <InstitutionalHero
        kicker={undefined}
        title={contactContent.hero.title}
        description={contactContent.hero.description}
      />

      <section className="w-full flex-1 pb-8 pt-3 md:pb-10 md:pt-4">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
          <ContactForm form={contactContent.form} />
        </div>
      </section>
    </main>
  );
}
