import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleCheckBig,
  Database,
  FileText,
  Info,
  Search,
  Settings,
  User,
  Users,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ConceptCard = {
  title: string;
  description: string;
};

type FlowStep = {
  title: string;
  description?: string;
  subtitle?: string;
};

type ComparisonBlock = {
  title: string;
  items: string[];
};

type MethodologySectionData = {
  number: string;
  id: string;
  title: string;
  paragraphs?: string[];
  intro?: string;
  conceptCards?: ConceptCard[];
  flow?:
    | {
        title: string;
        subtitle: string;
        steps: FlowStep[];
        actionLabel: string;
        actionTarget: string;
      }
    | FlowStep[];
  cards?: ConceptCard[];
  sampleComparison?: {
    title: string;
    sample: {
      value: string;
      label: string;
    };
    universe: {
      value: string;
      label: string;
    };
    note: string;
  };
  biases?: ConceptCard[];
  classificationSteps?: ConceptCard[];
  criteria?: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  note?: {
    title: string;
    description: string;
  };
  whatDataAllow?: ComparisonBlock;
  whatNotToInfer?: ComparisonBlock;
};

type MethodologySectionProps = {
  section: MethodologySectionData;
};

const iconSequence = [Database, Settings, Users, BarChart3, FileText];

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-4">
      <div className="mb-1 text-lg font-bold text-[#ff5b24]">{number}</div>
      <h2 className="font-serif text-4xl font-extrabold leading-tight tracking-tight text-[#0f216b] md:text-5xl">
        {title}
      </h2>
    </div>
  );
}

function Paragraphs({ paragraphs }: { paragraphs?: string[] }) {
  if (!paragraphs?.length) {
    return null;
  }

  return (
    <div className="space-y-3 text-[15px] leading-7 text-[#17307f] md:text-base">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function IntroductionSection({ section }: MethodologySectionProps) {
  return (
    <>
      <SectionTitle number={section.number} title={section.title} />
      <Paragraphs paragraphs={section.paragraphs} />

      {section.conceptCards?.length ? (
        <div className="mt-7 grid gap-5 border-b border-slate-200 pb-8 sm:grid-cols-2 lg:grid-cols-5">
          {section.conceptCards.map((card, index) => {
            const Icon = iconSequence[index % iconSequence.length];

            return (
              <div
                key={card.title}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-[#143bd4]">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold leading-5 text-[#102a8f]">
                  {card.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-[#3551a4]">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
}

function DataProvenanceSection({ section }: MethodologySectionProps) {
  const flow =
    section.flow && !Array.isArray(section.flow) ? section.flow : null;

  return (
    <>
      <SectionTitle number={section.number} title={section.title} />
      <Paragraphs paragraphs={section.paragraphs} />

      {flow ? (
        <div className="mt-6 rounded-xl bg-sky-50/80 p-5 md:p-6">
          <div className="mb-5">
            <h3 className="font-serif text-2xl font-bold text-[#102a8f]">
              {flow.title}
            </h3>
            <p className="mt-1 text-sm text-[#3551a4]">{flow.subtitle}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-7">
            {flow.steps.map((step, index) => {
              const Icon =
                [
                  User,
                  FileText,
                  Database,
                  Settings,
                  FileText,
                  BarChart3,
                  Users,
                ][index] ?? Database;

              return (
                <div key={step.title} className="relative min-w-0">
                  <div className="flex h-full flex-col items-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#143bd4] shadow-sm">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h4 className="mt-3 text-sm font-bold text-[#102a8f]">
                      {step.title}
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-[#3551a4]">
                      {step.description}
                    </p>
                  </div>

                  {index < flow.steps.length - 1 ? (
                    <ArrowRight
                      className="absolute -right-3 top-5 hidden h-5 w-5 text-[#143bd4] md:block"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex justify-end">
            <a
              href={`/pages/${flow.actionTarget}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#143bd4] underline-offset-4 hover:underline"
            >
              {flow.actionLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}

function TreatmentSection({ section }: MethodologySectionProps) {
  const flow = Array.isArray(section.flow) ? section.flow : null;

  return (
    <>
      <SectionTitle number={section.number} title={section.title} />

      {section.intro ? (
        <p className="text-[15px] leading-7 text-[#17307f] md:text-base">
          {section.intro}
        </p>
      ) : null}

      {section.cards?.length ? (
        <div className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2">
          {section.cards.map((card, index) => {
            const Icon = [Database, BarChart3, FileText, CircleCheckBig][index];

            return (
              <div
                key={card.title}
                className="flex gap-4 border-b border-slate-100 pb-5 md:border-b-0"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[#143bd4]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-[#102a8f]">{card.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#3551a4]">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {flow?.length ? (
        <div className="mt-7 grid gap-4 rounded-xl bg-sky-50/80 p-5 sm:grid-cols-2 md:grid-cols-5">
          {flow.map((step, index) => {
            const Icon = [
              FileText,
              Search,
              Database,
              CircleCheckBig,
              BarChart3,
            ][index];

            return (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#143bd4] shadow-sm">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h4 className="mt-3 text-sm font-bold text-[#102a8f]">
                  {step.title}
                </h4>
                <p className="mt-1 text-xs text-[#3551a4]">{step.subtitle}</p>

                {index < flow.length - 1 ? (
                  <ArrowRight
                    className="absolute -right-3 top-4 hidden h-5 w-5 text-[#143bd4] md:block"
                    aria-hidden="true"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
}

function SampleSection({ section }: MethodologySectionProps) {
  return (
    <>
      <SectionTitle number={section.number} title={section.title} />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Paragraphs paragraphs={section.paragraphs} />

        {section.sampleComparison ? (
          <div className="rounded-xl bg-sky-50/80 p-5">
            <h3 className="text-sm font-bold text-[#102a8f]">
              {section.sampleComparison.title}
            </h3>

            <div className="mt-4 grid items-center gap-4 sm:grid-cols-2">
              <div className="rounded-full bg-[#123482] px-6 py-8 text-center text-white">
                <div className="text-2xl font-bold">
                  {section.sampleComparison.sample.value}
                </div>
                <div className="mt-2 text-xs leading-5">
                  {section.sampleComparison.sample.label}
                </div>
              </div>

              <div className="rounded-full border-2 border-dashed border-blue-400 bg-white px-6 py-8 text-center text-[#102a8f]">
                <div className="text-2xl font-bold">
                  {section.sampleComparison.universe.value}
                </div>
                <div className="mt-2 text-xs leading-5">
                  {section.sampleComparison.universe.label}
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs font-medium text-[#3551a4]">
              {section.sampleComparison.note}
            </p>
          </div>
        ) : null}
      </div>

      {section.biases?.length ? (
        <div className="mt-7">
          <h3 className="mb-4 text-base font-bold text-[#102a8f]">
            Main identified biases
          </h3>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {section.biases.map((bias, index) => {
              const Icon = [User, BarChart3, Settings, CheckCircle2][index];

              return (
                <div
                  key={bias.title}
                  className="border-r border-slate-200 pr-4"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-[#143bd4]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h4 className="text-sm font-bold text-[#102a8f]">
                    {bias.title}
                  </h4>
                  <p className="mt-1 text-sm leading-5 text-[#3551a4]">
                    {bias.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}

function RegularUserSection({ section }: MethodologySectionProps) {
  return (
    <>
      <SectionTitle number={section.number} title={section.title} />
      <Paragraphs paragraphs={section.paragraphs} />

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        {section.classificationSteps?.length ? (
          <div className="rounded-xl bg-sky-50/80 p-5">
            <h3 className="mb-4 text-lg font-bold text-[#102a8f]">
              Classification steps
            </h3>

            <div className="grid gap-3 sm:grid-cols-3">
              {section.classificationSteps.map((step, index) => (
                <div
                  key={step.title}
                  className={cn(
                    "rounded-lg border p-4 text-center",
                    index === section.classificationSteps!.length - 1
                      ? "border-[#123482] bg-[#123482] text-white"
                      : "border-blue-100 bg-white text-[#102a8f]",
                  )}
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#143bd4]">
                    {index === 0 ? (
                      <User className="h-5 w-5" />
                    ) : index === 1 ? (
                      <CircleCheckBig className="h-5 w-5" />
                    ) : (
                      <Users className="h-5 w-5" />
                    )}
                  </div>
                  <h4 className="mt-3 font-bold">{step.title}</h4>
                  <p
                    className={cn(
                      "mt-2 text-xs leading-5",
                      index === section.classificationSteps!.length - 1
                        ? "text-blue-100"
                        : "text-[#3551a4]",
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {section.criteria?.length ? (
          <div className="rounded-xl bg-sky-50/80 p-5">
            <h3 className="mb-4 text-lg font-bold text-[#102a8f]">
              Criteria for being a regular user
            </h3>

            <div className="space-y-4">
              {section.criteria.map((criterion) => (
                <div key={criterion.number} className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff5b24] font-bold text-white">
                    {criterion.number}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#102a8f]">
                      {criterion.title}
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-[#3551a4]">
                      {criterion.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {section.note ? (
        <div className="mt-4 flex gap-3 rounded-xl bg-sky-50/80 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#143bd4]" />
          <div>
            <h4 className="font-bold text-[#102a8f]">{section.note.title}</h4>
            <p className="mt-1 text-sm text-[#3551a4]">
              {section.note.description}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

function InterpretationSection({ section }: MethodologySectionProps) {
  const blocks = [
    section.whatDataAllow
      ? {
          data: section.whatDataAllow,
          icon: CheckCircle2,
          tone: "positive" as const,
        }
      : null,
    section.whatNotToInfer
      ? {
          data: section.whatNotToInfer,
          icon: XCircle,
          tone: "warning" as const,
        }
      : null,
  ].filter(Boolean) as Array<{
    data: ComparisonBlock;
    icon: typeof CheckCircle2;
    tone: "positive" | "warning";
  }>;

  return (
    <>
      <SectionTitle number={section.number} title={section.title} />
      <Paragraphs paragraphs={section.paragraphs} />

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {blocks.map(({ data, icon: Icon, tone }) => (
          <div
            key={data.title}
            className={cn(
              "rounded-xl p-5",
              tone === "positive" ? "bg-sky-50/80" : "bg-orange-50",
            )}
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-white",
                  tone === "positive" ? "bg-[#2d60d3]" : "bg-[#ff5b24]",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#102a8f]">{data.title}</h3>
            </div>

            <ul className="space-y-2 pl-5 text-sm leading-6 text-[#17307f]">
              {data.items.map((item) => (
                <li key={item} className="list-disc">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export function MethodologySection({ section }: MethodologySectionProps) {
  let content;

  switch (section.id) {
    case "introduction":
      content = <IntroductionSection section={section} />;
      break;
    case "data-provenance":
      content = <DataProvenanceSection section={section} />;
      break;
    case "treatment-quality":
      content = <TreatmentSection section={section} />;
      break;
    case "sample-scope-biases":
      content = <SampleSection section={section} />;
      break;
    case "regular-user":
      content = <RegularUserSection section={section} />;
      break;
    case "interpretation":
      content = <InterpretationSection section={section} />;
      break;
    default:
      content = (
        <>
          <SectionTitle number={section.number} title={section.title} />
          <Paragraphs paragraphs={section.paragraphs} />
        </>
      );
  }

  return (
    <section
      id={section.id}
      className="scroll-mt-24 border-b border-slate-200 pb-10 last:border-b-0"
    >
      {content}
    </section>
  );
}
