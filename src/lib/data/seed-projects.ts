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
      {
        label: "FEMA — how flood map revisions work",
        url: "https://www.fema.gov/flood-maps/change-your-flood-zone/revision-process",
      },
      { label: "SJRWMD e-permitting", url: "https://permitting.sjrwmd.com/ep/" },
      {
        label: "SJRWMD Putnam County permits",
        url: "https://www.sjrwmd.com/district-counties/putnam-county/",
      },
    ],
    latestSummary:
      "Alford Farms is still in engineering and environmental permitting. It is not a sales opening. Putnam County approved an Agriculture-to-PUD rezoning on August 13, 2024 (Ordinance 2024-017, case PUD24-000004) for roughly 165 acres along SR 207 and Alford Road in East Palatka. Rezoning materials described up to 700 single-family homes plus about 60,000 square feet of commercial space, an amenity center, and a park. Later engineering (September 2025) shows a 559-lot layout. D.R. Horton, Inc. is named as an agent in the county file. SJRWMD file 224892-1 was received August 29, 2024; an RAI went out February 20, 2025, with a partial response in June 2025. Putnam County has noticed a proposed flood map revision for FIRM panel 12107C0212C near SR 207 / Cabbage Patch Road — base flood elevations and Special Flood Hazard Area boundaries may change. Review that with the Building Division and check the exact lot on the official map. No plat recorded. No model home open.",
    latestSummaryAt: "2026-09-07T12:00:00.000Z",
    confidence: "confirmed",
    published: true,
    featured: true,
    milestones: [
      {
        occurredOn: "2024-08-13",
        title: "PUD rezoning approved",
        body: "BOCC adopted Ordinance 2024-017, rezoning the tract from Agriculture (AG) to Planned Unit Development (PUD), case PUD24-000004.",
        sourceLabel: "Ordinance 2024-017",
        sourceUrl: "https://www.putnam-fl.gov/",
      },
      {
        occurredOn: "2024-08-29",
        title: "SJRWMD application received",
        body: "Environmental resource / stormwater application 224892-1 received by St. Johns River Water Management District.",
        sourceLabel: "SJRWMD file 224892-1",
        sourceUrl: "https://permitting.sjrwmd.com/ep/",
      },
      {
        occurredOn: "2026-03-01",
        title: "Permit review still active",
        body: "Public reporting of the file in spring 2026 still showed environmental permitting as open. No confirmed start of home sales.",
        sourceLabel: "Public record compilation",
      },
      {
        occurredOn: "2026-08-29",
        title: "Flood map revision noticed",
        body: "Putnam County publicly noticed a proposed flood map revision for the Alford Farms area affecting FIRM panel 12107C0212C (south of SR 207, east of Cabbage Patch Road). Proposed changes would establish base flood elevations and may alter Special Flood Hazard Area boundaries. This is not a sales opening. Confirm hearing materials and lot status with the Putnam County Building Division.",
        sourceLabel: "Putnam County Building Division / public hearing notice",
        sourceUrl: "https://www.putnam-fl.gov/",
      },
    ],
  },
  {
    slug: "collection-at-palatka",
    name: "The Collection at Palatka",
    locationLabel: "508 N. 17th Street, Palatka",
    area: "Palatka",
    lat: 29.6509,
    lng: -81.6408,
    status: "selling",
    acres: null,
    lotsCurrent: null,
    lotsRezoning: null,
    unitsNote:
      "Century Complete lists three floor plans (about 1,150–1,680 sq ft) and advertised starting prices in the low-to-mid $200,000s in 2026, with some quick move-in homes. This is a small in-town community, not an East Palatka PUD.",
    commercialSqft: null,
    builder: "Century Complete (Century Communities)",
    developer: "Century Complete",
    countyCase: null,
    ordinance: null,
    sjrwmdFile: null,
    officialLinks: [
      {
        label: "Century Complete — The Collection at Palatka",
        url: "https://www.centurycommunities.com/find-your-new-home/florida/jacksonville-metro/palatka/the-collection-at-palatka/",
      },
      { label: "City of Palatka", url: "https://www.palatka-fl.gov/" },
    ],
    latestSummary:
      "Need a house this year: The Collection at Palatka, 508 N. 17th Street. Century Complete (Century Communities’ value line) is selling three single-family plans with advertised prices starting around $217,000 as of 2026 listings, including some quick move-in homes. It is a small in-town community. Pricing and inventory change on the builder’s site. Alford Farms, the large East Palatka PUD on SR 207, is still in the county file.",
    latestSummaryAt: "2026-08-19T12:00:00.000Z",
    confidence: "reported",
    published: true,
    featured: false,
    milestones: [
      {
        occurredOn: "2025-07-01",
        title: "Builder lists the community as selling",
        body: "Century Complete published The Collection at Palatka as an active Palatka community with floor plans and starting prices.",
        sourceLabel: "Century Complete",
        sourceUrl:
          "https://www.centurycommunities.com/find-your-new-home/florida/jacksonville-metro/palatka/the-collection-at-palatka/",
      },
    ],
  },
  {
    slug: "nobles-crossing",
    name: "Nobles Crossing",
    locationLabel: "Newcastle Road, Palatka",
    area: "Palatka",
    lat: 29.6221,
    lng: -81.7233,
    status: "selling",
    acres: null,
    lotsCurrent: null,
    lotsRezoning: null,
    unitsNote:
      "Century Complete lists Nobles Crossing as an active Palatka community on Newcastle Road with single-story plans. Inventory and advertised prices change — verify on the builder page. Separate from The Collection at Palatka (508 N. 17th Street) and from Alford Farms (East Palatka PUD, not selling).",
    commercialSqft: null,
    builder: "Century Complete (Century Communities)",
    developer: "Century Complete",
    countyCase: null,
    ordinance: null,
    sjrwmdFile: null,
    officialLinks: [
      {
        label: "Century Complete — Nobles Crossing",
        url: "https://www.centurycommunities.com/find-your-new-home/florida/jacksonville-metro/palatka/nobles-crossing/",
      },
      { label: "City of Palatka", url: "https://www.palatka-fl.gov/" },
    ],
    latestSummary:
      "Nobles Crossing is a Century Complete community on Newcastle Road in Palatka. Builder shows inventory on Newcastle Road and Fenham Court — some ready, some still building. Advertised asks have been low-to-mid $300s; verify live. Different from The Collection at Palatka (508 N. 17th Street, also Century Complete, advertised from the low $200,000s) and from Alford Farms in East Palatka (PUD file, not selling).",
    latestSummaryAt: "2026-09-07T12:00:00.000Z",
    confidence: "reported",
    published: true,
    featured: true,
    milestones: [
      {
        occurredOn: "2025-01-01",
        title: "Builder lists community as selling",
        body: "Century Complete publishes Nobles Crossing as an active Palatka community with floor plans and homesites on Newcastle Road.",
        sourceLabel: "Century Complete",
        sourceUrl:
          "https://www.centurycommunities.com/find-your-new-home/florida/jacksonville-metro/palatka/nobles-crossing/",
      },
    ],
  },
];
