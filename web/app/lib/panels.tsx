import type { ComponentType } from "react";
import {
  Briefcase,
  Clock,
  DollarSign,
  Globe,
  MapPin,
  PieChart,
  Smartphone,
  Target,
  Users,
} from "lucide-react";

import type { PanelView } from "@/lib/api";

export type ChartType = "line" | "bar" | "area" | "map";

export type BarSeries = {
  dataKey: string;
  label: string;
  color: string;
};

function BrazilIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7.5 4c2.2-.8 4.2-.4 6 .5 1.8 1 3 .6 4.5 1.8 1.2 1 2 2.8 1.5 4.5-.4 1.4-1.2 2.2-2 3.5-.8 1.3-1 2.8-.5 4.2.4 1.2-.6 2.5-1.8 3-1.2.5-2.2 0-3-.5-1-.6-1.8-1.5-2.5-2.6-.8-1.2-1.5-2-2.8-2.6-1.2-.6-2-1.5-2.4-2.8-.4-1.3 0-2.8-.2-4.2-.2-1.4-1-2.5-.5-3.8.5-1.2 1.8-1.8 3.7-2z" />
    </svg>
  );
}

export type PanelSubItem = {
  slug: string;
  title: string;
  description: string;
  view?: PanelView;
  chartType?: ChartType;
  metricLabel?: string;
  dataKey?: string;
  barSeries?: BarSeries[];
};

export type PanelGroup = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  defaultOpen?: boolean;
  items: PanelSubItem[];
};

export const panelGroups: PanelGroup[] = [
  {
    title: "Participant Sample",
    icon: Users,
    defaultOpen: true,
    items: [
      {
        slug: "temporal-evolution",
        title: "Temporal Evolution",
        description:
          "Variation in the number of regular users of the app over time.",
        view: "temporal_evolution",
        chartType: "line",
        metricLabel: "Regular Users",
      },
      {
        slug: "length-of-stay",
        title: "Length of Stay",
        description: "How long delivery workers stay active on the platforms.",
        view: "retention_rate",
        chartType: "bar",
        metricLabel: "Average Days",
        dataKey: "average_days",
      },
      {
        slug: "registration-activities",
        title: "Registration Activities",
        description: "Expenses and earnings registered by workers over time.",
        view: "registrations",
        chartType: "bar",
        metricLabel: "Amount",
        barSeries: [
          { dataKey: "expenses", label: "Expenses", color: "#dc2626" },
          { dataKey: "earnings", label: "Earnings", color: "#16a34a" },
        ],
      },
    ],
  },
  {
    title: "Sociodemographic Profile",
    icon: BrazilIcon,
    items: [
      {
        slug: "age-demographics",
        title: "Age & Demographics",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "gender-identity",
        title: "Gender & Identity",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "education-level",
        title: "Education Level",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
  {
    title: "Work Characteristics",
    icon: Briefcase,
    items: [
      {
        slug: "app-platforms",
        title: "App Platforms",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "vehicle-types",
        title: "Vehicle Types",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "employment-modality",
        title: "Employment Modality",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
  {
    title: "Working Hours",
    icon: Clock,
    items: [
      {
        slug: "daily-hours",
        title: "Daily Hours",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "weekly-schedule",
        title: "Weekly Schedule",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "peak-shifts",
        title: "Peak Shifts",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
  {
    title: "Expense Breakdown",
    icon: PieChart,
    items: [
      {
        slug: "fuel-energy",
        title: "Fuel & Energy",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "maintenance-repairs",
        title: "Maintenance & Repairs",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "gear-telecom",
        title: "Gear & Telecom",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
  {
    title: "Earnings Breakdown",
    icon: Smartphone,
    items: [
      {
        slug: "base-delivery-fares",
        title: "Base Delivery Fares",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "platform-surge-bonuses",
        title: "Platform Surge & Bonuses",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "customer-tips",
        title: "Customer Tips",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
  {
    title: "Net Earnings",
    icon: DollarSign,
    items: [
      {
        slug: "hourly-rate",
        title: "Hourly Rate",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "weekly-net-margins",
        title: "Weekly Net Margins",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "tax-deductions",
        title: "Tax & Deductions",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
  {
    title: "Goals & Targets",
    icon: Target,
    items: [
      {
        slug: "daily-revenue-goals",
        title: "Daily Revenue Goals",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "trip-milestones",
        title: "Trip Milestones",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "achievement-progress",
        title: "Achievement Progress",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
  {
    title: "Urban Circulation",
    icon: MapPin,
    items: [
      {
        slug: "route-hotspots",
        title: "Route Hotspots",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "coverage-zones",
        title: "Coverage & Zones",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "distance-traveled",
        title: "Distance Traveled",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
  {
    title: "Countries (Beta)",
    icon: Globe,
    items: [
      {
        slug: "brazil",
        title: "Brazil",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "mexico",
        title: "Mexico",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        slug: "colombia",
        title: "Colombia",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
];

export const panelItems = panelGroups.flatMap((group) => group.items);

export function getPanelBySlug(slug?: string): PanelSubItem | undefined {
  if (!slug) return undefined;
  return panelItems.find((item) => item.slug === slug);
}

export const defaultPanelSlug =
  panelItems.find((item) => item.view !== undefined)?.slug ?? "";

export function getGroupFirstPanelSlug(group: PanelGroup): string | undefined {
  return group.items.find((item) => item.view !== undefined)?.slug;
}
