import { InstitutionalHero } from "@/components/pages/InstitutionalHero";
import { OrganizationLogoCard } from "@/components/pages/OrganizationLogoCard";
import { PersonCard } from "@/components/pages/PersonCard";
import aboutContent from "./content/about.json";

const { hero, sections } = aboutContent;

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="!mt-0 mb-5 font-serif text-3xl font-extrabold leading-tight tracking-tight text-[#112040] md:text-4xl">
      {title}
    </h2>
  );
}

function OrganizationGrid({
  items,
}: {
  items: Array<{
    name: string;
    logoRef?: string | null;
    url?: string | null;
  }>;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <OrganizationLogoCard
          key={item.name}
          name={item.name}
          logoRef={item.logoRef}
          url={item.url}
        />
      ))}
    </div>
  );
}

export function AboutPage() {
  return (
    <main className="w-full bg-white font-sans">
      <InstitutionalHero
        kicker={hero.kicker}
        title={hero.title}
        description={hero.description}
      />

      <section className="w-full pb-5 pt-6 md:pb-6 md:pt-8">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <SectionHeading title={sections.currentContributors.title} />
          <ul className="grid list-none grid-cols-1 items-start gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
            {sections.currentContributors.people.map((person) => (
              <li key={person.id} className="min-w-0 list-none">
                <PersonCard person={person} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="w-full pb-8 pt-3 md:pb-10 md:pt-4">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <SectionHeading title={sections.pastContributors.title} />
          <ul className="grid list-none grid-cols-1 items-start gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
            {sections.pastContributors.people.map((person) => (
              <li key={person.id} className="min-w-0 list-none">
                <PersonCard person={person} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="w-full pb-8 pt-4 md:pb-10 md:pt-5">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <SectionHeading title={sections.institutions.title} />
          <OrganizationGrid items={sections.institutions.items} />
        </div>
      </section>

      <section className="w-full pb-12 pt-4 md:pb-14 md:pt-5">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <SectionHeading title={sections.funding.title} />
          <OrganizationGrid items={sections.funding.items} />
        </div>
      </section>
    </main>
  );
}
