interface InstitutionalHeroProps {
  kicker: string;
  title: string;
  description: string;
}

export function InstitutionalHero({
  kicker,
  title,
  description,
}: InstitutionalHeroProps) {
  return (
    <section className="w-full bg-[#f0f2f6]">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-14 md:px-8 md:py-16">
        <p className="text-sm font-semibold tracking-wide text-[#fa6215] uppercase">
          {kicker}
        </p>

        <h1 className="font-serif text-5xl leading-[1.05] font-extrabold tracking-tight text-[#112040] md:text-6xl">
          {title}
        </h1>

        <p className="max-w-5xl text-base leading-7 text-[#6576a1] md:text-lg md:leading-8">
          {description}
        </p>
      </div>
    </section>
  );
}
