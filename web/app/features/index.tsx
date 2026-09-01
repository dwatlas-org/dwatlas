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
    <div className="flex flex-col w-full min-h-screen font-sans bg-white">
      <section className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col space-y-6">
          <span className="text-sm font-bold text-blue-900 tracking-wide uppercase">
            Research dashboard
          </span>
          <h1 className="text-5xl font-extrabold font-serif leading-tight text-black">
            Data and research on app-based delivery workers
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Delivery Worker Atlas is a management and research platform for
            app-based delivery workers. This dashboard shows longitudinal data
            collected directly from workers, from April 2024 to the present.
          </p>
          <div className="flex flex-row space-x-4 pt-2">
            <Button
              variant="outline"
              className="border-gray-300 text-black hover:bg-gray-50 px-6 py-6 font-semibold"
            >
              About the research
            </Button>
            <Button className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-6 py-6 font-semibold">
              View the data <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center items-center w-full">
          <img
            src="/api/placeholder/600/400"
            alt="Illustration of app-based delivery workers on motorcycles and bicycles"
            className="object-contain w-full h-auto"
          />
        </div>
      </section>

      <section className="w-full">
        <Card className="w-full overflow-hidden border-0 rounded-none shadow-none">
          <div className="flex flex-col w-full">
            <div className="bg-[#112040] text-white w-full py-8 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-6 gap-8 items-start">
              <div className="col-span-1 text-sm font-semibold tracking-widest uppercase opacity-90 pt-1">
                Sample overview
              </div>
              <div className="col-span-5 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col space-y-1">
                  <span className="text-3xl font-bold">366</span>
                  <span className="text-sm opacity-90">
                    Participating workers
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-3xl font-bold">
                    Apr 2024 - Jul 2026
                  </span>
                  <span className="text-sm opacity-90">Sample period</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-3xl font-bold">156</span>
                  <span className="text-sm opacity-90">Cities</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-3xl font-bold">34</span>
                  <span className="text-sm opacity-90">
                    Monitored companies
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#1a365d] text-white w-full py-8 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-6 gap-8 items-start border-t border-blue-900/50">
              <div className="col-span-1 text-sm font-semibold tracking-widest uppercase opacity-90 pt-1">
                Work characteristics
              </div>
              <div className="col-span-5 grid grid-cols-2 md:grid-cols-5 gap-8">
                <div className="flex flex-col space-y-1">
                  <span className="text-3xl font-bold text-[#eab308]">
                    R$915.10
                  </span>
                  <span className="text-sm opacity-90">
                    Monthly average net earnings
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-3xl font-bold text-[#f87171]">
                    R$306.50
                  </span>
                  <span className="text-sm opacity-90">
                    Monthly average expenses
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-3xl font-bold text-[#a78bfa]">
                    94.7%
                  </span>
                  <span className="text-sm opacity-90">
                    Monthly average active days
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-3xl font-bold text-[#4ade80]">
                    77.7%
                  </span>
                  <span className="text-sm opacity-90">
                    Monthly average trips
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-3xl font-bold text-[#fb923c]">
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

export default function MethodologySection() {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto flex flex-col">
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold font-serif text-black mb-4">
            Understand how the data is produced
          </h2>
          <p className="text-gray-600 text-lg">
            From the worker's record to the public dashboard, this is the
            journey each data point takes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-start gap-0">
                <div className="flex items-center mt-2 shrink-0">
                  <div className="w-9 h-9 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm z-10 shadow-sm">
                    {step.id}
                  </div>
                  <div className="w-6 h-[1px] bg-gray-300 z-0" />
                  <div className="w-16 h-16 rounded-full bg-[#f4f6fb] flex items-center justify-center z-10">
                    <Icon className="w-7 h-7 text-[#1e3a8a]" strokeWidth={2} />
                  </div>
                </div>

                <div className="flex flex-col ml-5 pt-2">
                  <h3 className="text-[#1e3a8a] font-bold text-lg mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed pr-4">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-end">
          <Button className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-6 py-5 font-semibold text-base rounded-md">
            View Methodology <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
