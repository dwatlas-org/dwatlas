interface InstitutionalHeroProps {
  kicker?: string;
  title: string;
  description: string;
}

export function InstitutionalHero({
  title,
  description,
}: InstitutionalHeroProps) {
  return (
    <section className="w-full bg-[#f0f2f6]">
      <div className="mx-auto flex max-w-6xl flex-col justify-center gap-3 px-6 pt-7 pb-8 md:px-8 md:pt-8 md:pb-10">
        <h1 className="!m-0 font-serif text-4xl font-extrabold leading-[1.1] tracking-tight text-[#112040] md:text-5xl">
          {title}
        </h1>

        <p className="!m-0 max-w-5xl text-base leading-7 text-[#6576a1] md:text-lg md:leading-8">
          {description}
        </p>
      </div>
    </section>
  );
}
