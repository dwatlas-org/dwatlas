import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Database,
  FileText,
  Fuel,
  Map,
  MapPin,
  Smartphone,
  Table2,
  User,
} from "lucide-react";

type DataTreeGroup = {
  id: string;
  title: string;
  fields: string[];
};

type DataTreeDiagramData = {
  source: { title: string; description: string };
  groups: DataTreeGroup[];
  processing: Array<{ title: string }>;
  outputs: string[];
};

type DataTreeDiagramProps = { diagram: DataTreeDiagramData };

const groupIcons = {
  profile: User,
  work: BriefcaseBusiness,
  geolocation: MapPin,
  earnings: Database,
  expenses: Fuel,
};

const outputIcons = {
  Tables: Table2,
  Charts: BarChart3,
  Maps: Map,
  Texts: FileText,
};

function Connector() {
  return (
    <div className="flex shrink-0 items-center justify-center py-1 text-blue-400 lg:py-0">
      <ArrowDown className="h-5 w-5 lg:hidden" aria-hidden="true" />
      <ArrowRight className="hidden h-5 w-5 lg:block" aria-hidden="true" />
    </div>
  );
}

export function DataTreeDiagram({ diagram }: DataTreeDiagramProps) {
  return (
    <div className="min-w-0 rounded-xl border border-blue-100 bg-white p-4 md:p-6">
      <div className="flex min-w-0 flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:gap-2">
        <div className="flex min-w-0 flex-col items-center justify-center rounded-xl bg-sky-50 px-3 py-5 text-center lg:w-[13%] lg:shrink-0">
          <Smartphone className="h-9 w-9 text-[#102a8f]" aria-hidden="true" />
          <h3 className="mt-3 font-serif text-lg font-bold text-[#102a8f]">
            {diagram.source.title}
          </h3>
          <p className="mt-2 text-xs leading-5 text-[#3551a4]">
            {diagram.source.description}
          </p>
        </div>

        <Connector />

        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {diagram.groups.map((group) => {
            const Icon =
              groupIcons[group.id as keyof typeof groupIcons] ?? Database;
            return (
              <div
                key={group.id}
                className="grid min-w-0 grid-cols-1 gap-2 rounded-xl border border-blue-100 p-2 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
              >
                <div className="flex min-w-0 items-center gap-2 rounded-lg bg-sky-50 px-3 py-3">
                  <Icon
                    className="h-5 w-5 shrink-0 text-[#102a8f]"
                    aria-hidden="true"
                  />
                  <h4 className="min-w-0 break-words font-serif text-sm font-bold text-[#102a8f]">
                    {group.title}
                  </h4>
                </div>
                <div className="min-w-0 px-3 py-2 xl:px-1">
                  <ul className="list-disc space-y-0.5 pl-4 text-xs leading-4 text-[#17307f] marker:text-[#102a8f]">
                    {group.fields.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <Connector />

        {diagram.processing.map((step, index) => {
          const Icon = index === 0 ? BarChart3 : Database;
          return (
            <div key={`${index}-${step.title}`} className="contents">
              {index > 0 ? <Connector /> : null}
              <div className="flex min-w-0 flex-col items-center justify-center rounded-xl border border-blue-100 bg-sky-50/60 px-3 py-5 text-center lg:w-[15%] lg:shrink-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#102a8f]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h4 className="mt-3 break-words font-serif text-sm font-bold leading-5 text-[#102a8f]">
                  {step.title}
                </h4>
              </div>
            </div>
          );
        })}

        <Connector />

        <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:w-[13%] lg:shrink-0 lg:grid-cols-1">
          {diagram.outputs.map((output) => {
            const Icon =
              outputIcons[output as keyof typeof outputIcons] ?? FileText;
            return (
              <div
                key={output}
                className="flex min-w-0 items-center gap-2 rounded-xl bg-sky-50 px-3 py-3"
              >
                <Icon
                  className="h-5 w-5 shrink-0 text-[#102a8f]"
                  aria-hidden="true"
                />
                <span className="min-w-0 break-words font-serif text-sm font-bold text-[#102a8f]">
                  {output}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
