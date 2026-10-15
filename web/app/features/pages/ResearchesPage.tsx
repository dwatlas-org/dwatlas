import { InstitutionalHero } from "../../components/pages/InstitutionalHero";
import {
  ResearchCard,
  type ResearchProject,
} from "../../components/pages/ResearchCard";
import researchesContent from "./content/researches.json";

const { hero, projects } = researchesContent;

export function ResearchesPage() {
  return (
    <main className="w-full bg-white font-sans">
      <InstitutionalHero
        kicker={hero.kicker}
        title={hero.title}
        description={hero.description}
      />

      <section className="w-full py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="space-y-7">
            {projects.map((project) => (
              <ResearchCard
                key={project.id}
                project={project as ResearchProject}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
