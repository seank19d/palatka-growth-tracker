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

/**
 * Live Neon DB already holds full project rows. This catalog is used to
 * insert missing rows and refresh summaries on deploy. Keep Alford current.
 */
export const SEED_PROJECTS: SeedProject[] = [
  {
    slug: "alford-farms",
    name: "Alford Farms",
    locationLabel: "SR 207 / Alford Road, East Palatka",
    area: "East Palatka",
    lat: 29.6624,
    lng: -81.5688,
    status: "permitting",
    acres: 165,
    lotsCurrent: 559,
    lotsRezoning: 700,
    unitsNote:
      "Rezoning materials described up to 700 single-family homes. September 2025 engineering documents describe a 559-lot layout. The lower number is typical as plans move from entitlement to construction documents — it is not a cancellation.",
    commercialSqft: 60000,
    builder: "D.R. Horton, Inc. (named as agent in county filings)",
    developer: "Charles Alford Jr. & Kathryn Clapp (applicants on rezoning)",
    countyCase: "PUD24-000004",
    ordinance: "2024-017",
    sjrwmdFile: "224892-1",
    officialLinks: [
      {
        label: "Putnam County Planning & Zoning",
        url: "https://www.putnam-fl.gov/241/Planning-Zoning",
      },
      { label: "Putnam County official site", url: "https://www.putnam-fl.gov/" },
      { label: "SJRWMD e-permitting", url: "https://permitting.sjrwmd.com/ep/" },
      {
        label: "SJRWMD Putnam County permits",
        url: "https://www.sjrwmd.com/district-counties/putnam-county/",
      },
    ],
    latestSummary:
      "As of a public-file review in August 2026, Alford Farms is still in engineering and environmental permitting — not selling homes. Putnam County approved an Agriculture-to-PUD rezoning on August 13, 2024 (Ordinance 2024-017, case PUD24-000004) for roughly 165 acres along SR 207 and Alford Road in East Palatka. The entitlement described up to 700 single-family homes plus about 60,000 square feet of commercial space, an amenity center, and a park. Later engineering materials (September 2025) show a 559-lot layout. D.R. Horton, Inc. is named as an agent in the county file; that is not the same as a published grand opening. St. Johns River Water Management District file 224892-1 was received August 29, 2024. An RAI went out February 20, 2025; a partial response followed in June 2025. No final plat recording or model-home opening is confirmed in the records this tracker reviews. If a builder website lists the community, treat marketing as separate from county status.",
    latestSummaryAt: "2026-08-20T12:00:00.000Z",
    confidence: "confirmed",
    published: true,
    featured: true,
    milestones: [],
  },
];

export const SEED_UPDATES: {
  projectSlug: string | null;
  title: string;
  body: string;
  kind: string;
  sourceLabel: string;
  createdAt: string;
}[] = [
  {
    projectSlug: "alford-farms",
    title: "August 2026 file check: still permitting, not sales",
    body: "A fresh pass over the public file in August 2026 found no plat recording and no confirmed home-sale opening. Status remains engineering and environmental permitting under PUD24-000004.",
    kind: "whats_new",
    sourceLabel: "Public records compilation",
    createdAt: "2026-08-20T12:00:00.000Z",
  },
];

export const SEED_SOURCES: { name: string; url: string; kind: string }[] = [];

export const SEED_MARKET = {
  capturedOn: "2026-06-30",
  medianSaleLow: 220000,
  medianSaleHigh: 310000,
  medianNote:
    "Public market reports for mid-2026 disagree because they measure different things. Treat this as a band, not a price tag.",
  daysOnMarket: 60,
  sourceNote: "Compiled from public market dashboards as of June–July 2026. Not an appraisal.",
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
