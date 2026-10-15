import { InstitutionalHero } from "../../components/pages/InstitutionalHero";
import { OrganizationLogoCard } from "../../components/pages/OrganizationLogoCard";
import { PersonCard } from "../../components/pages/PersonCard";
import aboutContent from "./content/about.json";

const { hero, sections } = aboutContent;

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="mb-7 font-serif text-3xl font-extrabold leading-tight tracking-tight text-[#112040] md:text-4xl">
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

      <section className="w-full py-10 md:py-12">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <SectionHeading title={sections.currentContributors.title} />

          <ul className="grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
            {sections.currentContributors.people.map((person) => (
              <li key={person.id} className="h-full list-none">
                <PersonCard person={person} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="w-full pb-12 pt-6 md:pb-14 md:pt-8">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <SectionHeading title={sections.pastContributors.title} />

          <ul className="grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
            {sections.pastContributors.people.map((person) => (
              <li key={person.id} className="h-full list-none">
                <PersonCard person={person} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="w-full border-t border-[#e3e7ef] py-12 md:py-14">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <SectionHeading title={sections.institutions.title} />
          <OrganizationGrid items={sections.institutions.items} />
        </div>
      </section>

      <section className="w-full pb-16 pt-4 md:pb-20 md:pt-6">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <SectionHeading title={sections.funding.title} />
          <OrganizationGrid items={sections.funding.items} />
        </div>
      </section>
    </main>
  );
}
