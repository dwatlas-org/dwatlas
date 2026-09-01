import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Smartphone,
  CloudUpload,
  Shield,
  ClipboardCheck,
  LineChart,
  Globe,
} from "lucide-react";
import placeholder from "../assets/placeholder.svg";

const steps = [
  {
    id: 1,
    title: "Recording",
    description: "The delivery worker logs their working day in the app.",
    icon: Smartphone,
  },
  {
    id: 2,
    title: "Submission",
    description: "The data are sent securely to our servers.",
    icon: CloudUpload,
  },
  {
    id: 3,
    title: "Anonymisation",
    description: "The delivery worker's identity is removed in the app.",
    icon: Shield,
  },
  {
    id: 4,
    title: "Anonymisation",
    description:
      "Personal information is removed or transformed to protect the user.",
    icon: ClipboardCheck,
  },
  {
    id: 5,
    title: "Analysis",
    description:
      "The validated data are aggregated and analysed to generate indicators.",
    icon: LineChart,
  },
  {
    id: 6,
    title: "Publication",
    description: "The results are published on the public dashboard.",
    icon: Globe,
  },
];

export function Index() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white font-sans">
      <section className="mx-auto grid grid-cols-1 items-center gap-12 px-20 py-16 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <span className="text-sm font-bold uppercase tracking-wide text-blue-900">
            Research dashboard
          </span>
          <h1 className="font-serif text-5xl font-extrabold leading-tight text-black">
            Data and research on app-based delivery workers
          </h1>
          <p className="text-lg leading-relaxed text-gray-700">
            Delivery Worker Atlas is a management and research platform for
            app-based delivery workers. This dashboard shows longitudinal data
            collected directly from workers, from April 2024 to the present.
          </p>
          <div className="flex gap-4 pt-2">
            <Button
              variant="outline"
              className="border-gray-300 px-6 py-6 font-semibold text-black hover:bg-gray-50"
            >
              About the research
            </Button>
            <Button className="bg-orange-600 px-6 py-6 font-semibold text-white hover:bg-orange-700">
              View the data <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex w-full items-center justify-center">
          <img
            src={placeholder}
            alt="Placeholder image"
            className="h-auto w-full"
          />
        </div>
      </section>

      <section className="w-full">
        <Card className="w-full overflow-hidden rounded-none shadow-none">
          <div className="flex w-full flex-col">
            <div className="grid w-full grid-cols-1 items-start gap-8 bg-[#112040] px-6 py-8 text-white md:px-12 lg:grid-cols-6">
              <div className="col-span-1 pt-1 text-sm font-semibold uppercase tracking-widest opacity-90">
                Sample overview
              </div>
              <div className="col-span-5 grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold">366</span>
                  <span className="text-sm opacity-90">
                    Participating workers
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold">
                    Apr 2024 - Jul 2026
                  </span>
                  <span className="text-sm opacity-90">Sample period</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold">156</span>
                  <span className="text-sm opacity-90">Cities</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold">34</span>
                  <span className="text-sm opacity-90">
                    Monitored companies
                  </span>
                </div>
              </div>
            </div>

            <div className="grid w-full grid-cols-1 items-start gap-8 border-t border-blue-900/50 bg-[#1a365d] px-6 py-8 text-white md:px-12 lg:grid-cols-6">
              <div className="col-span-1 pt-1 text-sm font-semibold uppercase tracking-widest opacity-90">
                Work characteristics
              </div>
              <div className="col-span-5 grid grid-cols-2 gap-8 md:grid-cols-5">
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-yellow-500">
                    R$915.10
                  </span>
                  <span className="text-sm opacity-90">
                    Monthly average net earnings
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-red-400">
                    R$306.50
                  </span>
                  <span className="text-sm opacity-90">
                    Monthly average expenses
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-violet-400">
                    94.7%
                  </span>
                  <span className="text-sm opacity-90">
                    Monthly average active days
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-green-400">
                    77.7%
                  </span>
                  <span className="text-sm opacity-90">
                    Monthly average trips
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-orange-400">
                    66.2%
                  </span>
                  <span className="text-sm opacity-90">
                    Share of monthly gross earnings
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <MethodologySection />
    </div>
  );
}

export function MethodologySection() {
  return (
    <section className="w-full bg-white px-4 py-16 font-sans md:px-8">
      <div className="mx-auto flex max-w-5xl flex-col">
        <div className="mb-12">
          <h2 className="mb-4 font-serif text-4xl font-extrabold text-black">
            Understand how the data is produced
          </h2>
          <p className="text-lg text-gray-600">
            From the worker's record to the public dashboard, this is the
            journey each data point takes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-start">
                <div className="mt-2 flex items-center">
                  <div className="z-10 flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-sm font-bold text-white shadow-sm">
                    {step.id}
                  </div>
                  <div className="h-[1px] w-6 bg-gray-300" />
                  <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                    <Icon className="h-7 w-7 text-blue-900" strokeWidth={2} />
                  </div>
                </div>

                <div className="ml-5 flex flex-col pt-2">
                  <h3 className="mb-1.5 text-lg font-bold text-blue-900">
                    {step.title}
                  </h3>
                  <p className="pr-4 text-sm leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-end">
          <Button className="rounded-md bg-orange-600 px-6 py-5 text-base font-semibold text-white hover:bg-orange-700">
            View Methodology <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
