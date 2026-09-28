export type SearchRecordType =
  | "dashboard"
  | "institutional"
  | "analysis"
  | "methodology"
  | "glossary"
  | "faq";

export type SearchRecord = {
  objectID: string;
  id: string;
  type: SearchRecordType;
  section: string;
  title: string;
  description: string;
  url: string;
  keywords?: string[];
};
