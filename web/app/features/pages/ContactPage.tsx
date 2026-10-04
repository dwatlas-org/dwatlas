import { ContactForm } from "@/components/pages/ContactForm";
import { InstitutionalHero } from "@/components/pages/InstitutionalHero";

import contactContent from "./content/contact.json";

export function ContactPage() {
  return (
    <main className="flex min-h-full w-full flex-col bg-white">
      <InstitutionalHero
        kicker={contactContent.hero.kicker}
        title={contactContent.hero.title}
        description={contactContent.hero.description}
      />

      <section className="w-full flex-1 py-8 md:py-10">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
          <ContactForm form={contactContent.form} />
        </div>
      </section>
    </main>
  );
}
