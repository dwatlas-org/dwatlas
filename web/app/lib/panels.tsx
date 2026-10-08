import type { ComponentType } from "react";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  Globe,
  MapPin,
  Moon,
  Smartphone,
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
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.91667 17.1817L9.91667 18.874L12.25 16.5663V15.1817L13.75 14.1048H15.25L16.9167 11.6433V9.64325L18.75 8.10479L18.5833 6.10479L17.25 4.87402H15.25L14.25 3.95095L12.9167 3.64325L11.75 3.95095V3.02787V2.25864L10.9167 1.48941L8.91667 2.25864H7.75V0.874023L5.75 1.18172L5.41667 2.72018L4.08333 2.25864L2.91667 2.56633V4.87402L1.41667 5.33556L0.75 6.41249V7.7971L2.91667 8.41249L3.75 7.7971H4.58333V8.72018L6.09375 10.5663L7.91667 11.3356V13.3356L9.41667 14.1048V15.6433L7.91667 17.1817Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
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
  chartTitle?: string;
  dataKey?: string;
  xKey?: string;
  tooltipLabelKey?: string;
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
        title: "Temporal evolution",
        description:
          "Variation in the number of regular users of the app over time.",
        view: "temporal_evolution",
        chartType: "line",
        metricLabel: "Regular Users",
      },
      {
        slug: "length-of-stay",
        title: "Length of stay",
        description: "How long delivery workers stay active on the platforms.",
        view: "retention_rate",
        chartType: "bar",
        metricLabel: "Users",
        chartTitle: "Distribution of users by length of stay",
        dataKey: "user_count",
        xKey: "upper_limit",
        tooltipLabelKey: "retention_range",
      },
      {
        slug: "registration-activities",
        title: "Registration activity",
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
    title: "Work characteristics",
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
    title: "Workday",
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
    title: "Expense breakdown",
    icon: Moon,
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
    title: "Earnings breakdown",
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
    title: "Net earnings",
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
    title: "Goals",
    icon: CheckCircle2,
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
    title: "Urban circulation",
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
