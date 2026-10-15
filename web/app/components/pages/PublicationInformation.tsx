import { ChevronDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type PublicationInformationData = {
  authors: string[];
  contributors: string[];
  submitted: string;
  published: string;
  lastUpdated: string;
  version: string;
  doi: string;
  issn: string;
  language: string;
  recommendedCitation: string;
};

type PublicationInformationProps = {
  information: PublicationInformationData;
};

export function PublicationInformation({
  information,
}: PublicationInformationProps) {
  return (
    <Collapsible className="group rounded-lg border border-blue-100 bg-sky-50/40">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-5 py-4 text-left">
        <span className="font-serif text-xl font-bold text-[#102a8f]">
          Publication information
        </span>
        <ChevronDown className="h-5 w-5 text-[#143bd4] transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="grid gap-x-8 gap-y-3 border-t border-blue-100 px-5 py-5 text-sm text-[#3551a4] md:grid-cols-2">
          <InfoRow label="Authors" value={information.authors.join(", ")} />
          <InfoRow label="Version" value={information.version} />

          <InfoRow
            label="Contributors"
            value={information.contributors.join(", ")}
          />
          <InfoRow label="DOI" value={information.doi} />

          <InfoRow label="Submitted" value={information.submitted} />
          <InfoRow label="ISSN" value={information.issn} />

          <InfoRow label="Published" value={information.published} />
          <InfoRow label="Language" value={information.language} />

          <InfoRow label="Last updated" value={information.lastUpdated} />
          <InfoRow
            label="Recommended citation"
            value={information.recommendedCitation}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-3">
      <span className="font-semibold text-[#102a8f]">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
