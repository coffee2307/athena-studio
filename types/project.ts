export type ProjectKind = "founder" | "research" | "client";
export type ProjectStatus = "đang phát triển" | "nghiên cứu" | "đã bàn giao";
export type ProjectVisibility = "published" | "review";
export interface Project {
  slug: string;
  title: string;
  kicker: string;
  category: string;
  kind: ProjectKind;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  featured: boolean;
  summary: string;
  introduction: string;
  challenge: string;
  approach: string;
  outcome: string;
  outcomeNote: string;
  technologies: string[];
  activities: string[];
  sourceUrl?: string;
  websiteUrl?: string;
  gallery: {src:string;alt:string;caption:string;rightsVerified:boolean}[];
  responsibility: string;
  evidenceNote: string;
  artwork: "pham"|"econith"|"qrio"|"neutral";
  updatedLabel: string;
}
