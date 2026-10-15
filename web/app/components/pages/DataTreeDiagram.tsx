import {
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
  source: {
    title: string;
    description: string;
  };
  groups: DataTreeGroup[];
  processing: Array<{
    title: string;
  }>;
  outputs: string[];
};

type DataTreeDiagramProps = {
  diagram: DataTreeDiagramData;
};

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

function ArrowConnector() {
  return (
    <ArrowRight
      className="hidden h-5 w-5 shrink-0 text-blue-400 xl:block"
      aria-hidden="true"
    />
  );
}

export function DataTreeDiagram({ diagram }: DataTreeDiagramProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white p-4 md:p-6">
      <div className="min-w-[980px]">
        <div className="grid grid-cols-[150px_26px_330px_26px_150px_26px_150px_26px_170px] items-center gap-2">
          <div className="flex min-h-[190px] flex-col items-center justify-center rounded-xl bg-sky-50 px-4 text-center">
            <Smartphone className="h-9 w-9 text-[#102a8f]" aria-hidden="true" />
            <h3 className="mt-3 font-serif text-xl font-bold text-[#102a8f]">
              {diagram.source.title}
            </h3>
            <p className="mt-2 text-xs leading-5 text-[#3551a4]">
              {diagram.source.description}
            </p>
          </div>

          <ArrowConnector />

          <div className="space-y-3">
            {diagram.groups.map((group) => {
              const Icon =
                groupIcons[group.id as keyof typeof groupIcons] ?? Database;

              return (
                <div
                  key={group.id}
                  className="grid grid-cols-[150px_1fr] gap-3"
                >
                  <div className="flex items-center gap-3 rounded-xl bg-sky-50 px-4 py-4">
                    <Icon
                      className="h-7 w-7 shrink-0 text-[#102a8f]"
                      aria-hidden="true"
                    />
                    <h4 className="font-serif text-base font-bold text-[#102a8f]">
                      {group.title}
                    </h4>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-white px-4 py-3">
                    <ul className="space-y-0.5 text-xs leading-4 text-[#17307f]">
                      {group.fields.map((field) => (
                        <li
                          key={field}
                          className="list-disc marker:text-[#102a8f]"
                        >
                          {field}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <ArrowConnector />

          <div className="rounded-xl border border-blue-100 bg-sky-50/60 px-4 py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#102a8f]">
              <BarChart3 className="h-6 w-6" aria-hidden="true" />
            </div>
            <h4 className="mt-4 font-serif text-base font-bold leading-5 text-[#102a8f]">
              {diagram.processing[0]?.title}
            </h4>
          </div>

          <ArrowConnector />

          <div className="rounded-xl border border-blue-100 bg-sky-50/60 px-4 py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#102a8f]">
              <Database className="h-6 w-6" aria-hidden="true" />
            </div>
            <h4 className="mt-4 font-serif text-base font-bold leading-5 text-[#102a8f]">
              {diagram.processing[1]?.title}
            </h4>
          </div>

          <ArrowConnector />

          <div className="space-y-3">
            {diagram.outputs.map((output) => {
              const Icon =
                outputIcons[output as keyof typeof outputIcons] ?? FileText;

              return (
                <div
                  key={output}
                  className="flex items-center gap-3 rounded-xl bg-sky-50 px-4 py-4"
                >
                  <Icon
                    className="h-7 w-7 shrink-0 text-[#102a8f]"
                    aria-hidden="true"
                  />
                  <span className="font-serif text-base font-bold text-[#102a8f]">
                    {output}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
