import type { Confidence, OfficialLink, ProjectStatus } from "@/lib/types";

export type SeedProject = {
  slug: string;
  name: string;
  locationLabel: string;
  area: string;
  lat: number;
  lng: number;
  status: ProjectStatus;
  acres: number | null;
  lotsCurrent: number | null;
  lotsRezoning: number | null;
  unitsNote: string;
  commercialSqft: number | null;
  builder: string | null;
  developer: string | null;
  countyCase: string | null;
  ordinance: string | null;
  sjrwmdFile: string | null;
  officialLinks: OfficialLink[];
  latestSummary: string;
  latestSummaryAt: string;
  confidence: Confidence;
  published: boolean;
  featured: boolean;
  milestones: {
    occurredOn: string;
    title: string;
    body: string;
    sourceUrl?: string;
    sourceLabel?: string;
  }[];
};

// TEMP_MINIMAL_RESTORE - full catalog follows in next commit if this is truncated
export const SEED_PROJECTS: SeedProject[] = [];
export const SEED_UPDATES: {
  projectSlug: string | null;
  title: string;
  body: string;
  kind: string;
  sourceLabel: string;
  createdAt: string;
}[] = [];
export const SEED_SOURCES: { name: string; url: string; kind: string }[] = [];
export const SEED_MARKET = {
  capturedOn: "2026-06-30",
  medianSaleLow: 220000,
  medianSaleHigh: 310000,
  medianNote: "See site.",
  daysOnMarket: 60,
  sourceNote: "Compiled from public dashboards.",
};
export const SEED_PRODUCTS: {
  asin: string | null;
  title: string;
  category: string;
  blurb: string;
  searchQuery: string;
  sortOrder: number;
}[] = [];
export const SEED_FAQS: { question: string; answer: string; sortOrder: number }[] = [];
