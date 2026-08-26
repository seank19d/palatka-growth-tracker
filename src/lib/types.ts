export const PROJECT_STATUSES = [
  "concept",
  "rezoning",
  "engineering",
  "permitting",
  "plat_recorded",
  "under_construction",
  "selling",
  "built_out",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type Confidence = "confirmed" | "reported" | "watch";

export type OfficialLink = {
  label: string;
  url: string;
};

export type Project = {
  id: number;
  slug: string;
  name: string;
  locationLabel: string;
  area: string;
  lat: number | null;
  lng: number | null;
  status: ProjectStatus;
  acres: number | null;
  lotsCurrent: number | null;
  lotsRezoning: number | null;
  unitsNote: string | null;
  commercialSqft: number | null;
  builder: string | null;
  developer: string | null;
  countyCase: string | null;
  ordinance: string | null;
  sjrwmdFile: string | null;
  officialLinks: OfficialLink[];
  latestSummary: string | null;
  latestSummaryAt: string | null;
  confidence: Confidence;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Milestone = {
  id: number;
  projectId: number;
  occurredOn: string;
  title: string;
  body: string | null;
  sourceUrl: string | null;
  sourceLabel: string | null;
  sortOrder: number;
};

export type ProjectUpdate = {
  id: number;
  projectId: number | null;
  projectName: string | null;
  projectSlug: string | null;
  title: string;
  body: string;
  kind: string;
  sourceLabel: string | null;
  createdAt: string;
};

export type GuideSection = {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
  callout?: { title: string; body: string };
};

export type GuidePage = {
  slug: string;
  title: string;
  navLabel: string;
  excerpt: string;
  affiliateCategory: string | null;
  sortOrder: number;
  lastRefreshedAt: string | null;
  sections: GuideSection[];
};

export type Faq = {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
  generated: boolean;
};

export type AffiliateProduct = {
  id: number;
  asin: string | null;
  title: string;
  category: string;
  blurb: string;
  searchQuery: string;
  url: string;
  imageUrl: string | null;
  priceLabel: string | null;
  sortOrder: number;
};


export type MarketSnapshot = {
  id: number;
  capturedOn: string;
  medianSaleLow: number | null;
  medianSaleHigh: number | null;
  medianNote: string;
  daysOnMarket: number | null;
  sourceNote: string;
};

export type SourceRow = {
  id: number;
  name: string;
  url: string;
  kind: string;
  enabled: boolean;
  lastCheckedAt: string | null;
  lastSuccessAt: string | null;
  lastError: string | null;
};

export type JobRun = {
  id: number;
  jobName: string;
  startedAt: string;
  finishedAt: string | null;
  status: string;
  summary: string | null;
  error: string | null;
};

export type SourceItem = {
  id: number;
  sourceName: string | null;
  title: string;
  url: string | null;
  snippet: string | null;
  publishedAt: string | null;
  matchedProjectName: string | null;
  isNewProjectCandidate: boolean;
  createdAt: string;
};
