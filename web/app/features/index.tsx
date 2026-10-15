import { NavLink } from "react-router";
import {
  ArrowRight,
  Smartphone,
  CloudUpload,
  Shield,
  ClipboardCheck,
  LineChart,
  Globe,
} from "lucide-react";
import heroWorkers from "../assets/hero-workers.png";

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
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 py-12 lg:py-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a]">
            Research dashboard
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold leading-[1.15] text-slate-900">
            Data and research on app-based delivery workers
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-slate-600">
            Delivery Worker Atlas is a management and research platform for
            app-based delivery workers. This dashboard shows longitudinal data
            collected directly from workers—from April 2024 to the present.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <NavLink
              to="/pages/about"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-none hover:bg-slate-50 transition-colors no-underline"
            >
              About the research
            </NavLink>
            <NavLink
              to="/panels"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-none hover:bg-orange-700 transition-colors no-underline"
            >
              View the data <ArrowRight className="h-4 w-4" />
            </NavLink>
          </div>
        </div>

        <div className="flex w-full items-center justify-center">
          <img
            src={heroWorkers}
            alt="Delivery workers"
            className="h-auto w-full max-w-xl object-contain"
          />
        </div>
      </section>

      {/* KPI Section */}
      <section className="w-full">
        <div className="flex w-full flex-col">
          {/* Sample Overview */}
          <div className="w-full bg-[#10203f] text-white">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
              <div className="w-44 shrink-0 text-xs font-bold uppercase tracking-widest text-slate-300/80 leading-tight">
                Sample
                <br />
                overview
              </div>
              <div className="flex-1 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-8 w-full">
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-bold leading-tight">
                    366
                  </span>
                  <span className="text-xs sm:text-sm text-slate-300 font-normal">
                    Participating workers
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-bold leading-tight">
                    Apr 2024 –<br className="hidden sm:inline" /> Jul 2026
                  </span>
                  <span className="text-xs sm:text-sm text-slate-300 font-normal">
                    Sample period
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-bold leading-tight">
                    156
                  </span>
                  <span className="text-xs sm:text-sm text-slate-300 font-normal">
                    Cities
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-bold leading-tight">
                    34
                  </span>
                  <span className="text-xs sm:text-sm text-slate-300 font-normal">
                    Monitored companies
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Work Characteristics */}
          <div className="w-full border-t border-blue-900/40 bg-[#0c1830] text-white">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
              <div className="w-44 shrink-0 text-xs font-bold uppercase tracking-widest text-slate-300/80 leading-tight">
                Work
                <br />
                characteristics
              </div>
              <div className="flex-1 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6 w-full">
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-[#F5A623] leading-tight">
                    R$915.10
                  </span>
                  <span className="text-xs sm:text-sm text-slate-300 font-normal">
                    Monthly average net earnings
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-[#FF6B6B] leading-tight">
                    R$306.50
                  </span>
                  <span className="text-xs sm:text-sm text-slate-300 font-normal">
                    Monthly average expenses
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-[#A78BFA] leading-tight">
                    94.7%
                  </span>
                  <span className="text-xs sm:text-sm text-slate-300 font-normal">
                    Monthly average active days
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-[#4EBA6F] leading-tight">
                    77.7%
                  </span>
                  <span className="text-xs sm:text-sm text-slate-300 font-normal">
                    Monthly average trips
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-[#F2994A] leading-tight">
                    66.2%
                  </span>
                  <span className="text-xs sm:text-sm text-slate-300 font-normal">
                    Share of monthly gross earnings
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MethodologySection />
    </div>
  );
}

export function MethodologySection() {
  return (
    <section className="w-full bg-white px-6 sm:px-8 lg:px-12 py-16 font-sans">
      <div className="mx-auto flex max-w-5xl flex-col">
        <div className="mb-12">
          <h2 className="mb-4 font-serif text-4xl font-extrabold text-slate-900">
            Understand how the data is produced
          </h2>
          <p className="text-lg text-slate-600">
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
          <NavLink
            to="/pages/methodology"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-none hover:bg-orange-700 transition-colors no-underline"
          >
            View Methodology <ArrowRight className="h-4 w-4" />
          </NavLink>
        </div>
      </div>
    </section>
  );
}
