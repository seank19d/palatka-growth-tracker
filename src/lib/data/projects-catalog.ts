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
      {
        label: "Putnam County official site",
        url: "https://www.putnam-fl.gov/",
      },
      {
        label: "SJRWMD e-permitting",
        url: "https://permitting.sjrwmd.com/ep/",
      },
      {
        label: "SJRWMD Putnam County permits",
        url: "https://www.sjrwmd.com/district-counties/putnam-county/",
      },
    ],
    latestSummary:
      "As of public records through early 2026, Alford Farms is in engineering and environmental permitting — not selling homes. Putnam County approved an Agriculture-to-PUD rezoning on August 13, 2024 (Ordinance 2024-017, case PUD24-000004) for roughly 165 acres along SR 207 and Alford Road in East Palatka. The entitlement described up to 700 single-family homes plus about 60,000 square feet of commercial space, an amenity center, and a park. Later engineering materials (September 2025) show a 559-lot layout. D.R. Horton, Inc. is named as an agent in the county file; that is not the same as a published grand opening. St. Johns River Water Management District file 224892-1 was received August 29, 2024. An RAI went out February 20, 2025; a partial response followed in June 2025. No final plat recording or home-sale opening is confirmed in the records this tracker reviews. If a builder website lists the community, treat marketing as separate from county status.",
    latestSummaryAt: "2026-04-15T12:00:00.000Z",
    confidence: "confirmed",
    published: true,
    featured: true,
    milestones: [
      {
        occurredOn: "2024-06-12",
        title: "Planning Commission recommendation",
        body: "Putnam County Planning Commission reviewed the Alford Farms PUD request and recommended approval 5–2.",
        sourceLabel: "Putnam County Planning Commission",
        sourceUrl: "https://www.putnam-fl.gov/241/Planning-Zoning",
      },
      {
        occurredOn: "2024-07-23",
        title: "BOCC first reading",
        body: "Board of County Commissioners advanced the rezoning on first reading, 4–1, with requested revisions.",
        sourceLabel: "Putnam County BOCC",
        sourceUrl: "https://www.putnam-fl.gov/",
      },
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
        occurredOn: "2025-02-20",
        title: "SJRWMD request for additional information",
        body: "District issued an RAI, which is routine on large residential ERP files and means the review stayed open.",
        sourceLabel: "SJRWMD",
        sourceUrl: "https://www.sjrwmd.com/district-counties/putnam-county/",
      },
      {
        occurredOn: "2025-06-15",
        title: "Partial RAI response",
        body: "Applicant materials were treated as a partial RAI response. Additional documentation was still required.",
        sourceLabel: "SJRWMD correspondence",
      },
      {
        occurredOn: "2025-09-01",
        title: "559-lot engineering layout",
        body: "Engineering documents in the file describe a 559-lot development layout, down from the 700-home entitlement envelope.",
        sourceLabel: "County / permit engineering materials",
      },
      {
        occurredOn: "2026-03-01",
        title: "Permit review still active",
        body: "Public reporting of the file in spring 2026 still showed environmental permitting as open. No confirmed start of home sales.",
        sourceLabel: "Public record compilation",
      },
    ],
  },
  {
    slug: "east-river-road",
    name: "East River Road tract",
    locationLabel: "Putnam County Blvd & East River Road, East Palatka",
    area: "East Palatka",
    lat: 29.6712,
    lng: -81.6235,
    status: "concept",
    acres: null,
    lotsCurrent: 189,
    lotsRezoning: 189,
    unitsNote:
      "Local reports describe a D.R. Horton plan for about 189 single-family homes. A county case number has not been independently confirmed in this tracker’s source set.",
    commercialSqft: null,
    builder: "D.R. Horton (reported)",
    developer: null,
    countyCase: null,
    ordinance: null,
    sjrwmdFile: null,
    officialLinks: [
      {
        label: "Putnam County Planning & Zoning",
        url: "https://www.putnam-fl.gov/241/Planning-Zoning",
      },
    ],
    latestSummary:
      "Community reports in 2025–2026 describe a second D.R. Horton subdivision of about 189 homes near Putnam County Boulevard and East River Road in East Palatka. Unlike Alford Farms, this tracker has not yet tied the report to a published PUD ordinance or SJRWMD file number. Treat the lot count and builder name as reported, not confirmed. The site is on the watch list so that when a case number appears in county agendas, it can be promoted to a confirmed record instead of disappearing into rumor.",
    latestSummaryAt: "2026-01-20T12:00:00.000Z",
    confidence: "reported",
    published: true,
    featured: false,
    milestones: [
      {
        occurredOn: "2025-12-01",
        title: "Local reports of a 189-home plan",
        body: "Residents and local real-estate discussion named D.R. Horton and a 189-home layout at Putnam County Blvd and East River Road. No ordinance number is attached in our file yet.",
        sourceLabel: "Local reporting / community notices",
      },
    ],
  },
  {
    slug: "palatka-riverfront-infill",
    name: "Palatka riverfront infill",
    locationLabel: "Downtown Palatka / St. Johns riverfront",
    area: "Palatka",
    lat: 29.6478,
    lng: -81.6315,
    status: "concept",
    acres: null,
    lotsCurrent: null,
    lotsRezoning: null,
    unitsNote:
      "Not a single PUD. This entry groups city-scale infill, CRA, and riverfront reuse so downtown housing does not fall off the tracker.",
    commercialSqft: null,
    builder: null,
    developer: "City of Palatka / private owners",
    countyCase: null,
    ordinance: null,
    sjrwmdFile: null,
    officialLinks: [
      { label: "City of Palatka", url: "https://www.palatka-fl.gov/" },
      { label: "Putnam County", url: "https://www.putnam-fl.gov/" },
    ],
    latestSummary:
      "Palatka’s historic riverfront is a different animal from East Palatka’s greenfield PUDs: smaller lots, older buildings, floodplain and historic-district constraints, and city rather than county process. There is no single 500-lot filing. This card exists so people moving here can see downtown housing as a live option — renovated cottages, occasional new construction, and commercial-to-residential reuse — without confusing it with Alford Farms. Check city building permits and the Community Redevelopment Agency for current filings; nothing here should be read as an approved master plan.",
    latestSummaryAt: "2026-06-01T12:00:00.000Z",
    confidence: "watch",
    published: true,
    featured: false,
    milestones: [
      {
        occurredOn: "2024-01-15",
        title: "Tracked as a watch district",
        body: "Added as an umbrella watch so riverfront and downtown housing activity is not missed while the East Palatka PUDs dominate headlines.",
        sourceLabel: "Tracker methodology",
      },
    ],
  },
  {
    slug: "gilbert-road-tract",
    name: "Gilbert Road large tract",
    locationLabel: "Gilbert Road, East Palatka",
    area: "East Palatka",
    lat: 29.6385,
    lng: -81.552,
    status: "concept",
    acres: 1300,
    lotsCurrent: null,
    lotsRezoning: null,
    unitsNote:
      "Marketed as a large rural assemblage. Public discussion has included possible data-center use. It is not an approved housing PUD.",
    commercialSqft: null,
    builder: null,
    developer: null,
    countyCase: null,
    ordinance: null,
    sjrwmdFile: null,
    officialLinks: [
      {
        label: "Putnam County Planning & Zoning",
        url: "https://www.putnam-fl.gov/241/Planning-Zoning",
      },
    ],
    latestSummary:
      "A roughly 1,300-acre rural property off Gilbert Road in East Palatka has been marketed as a large land assemblage. Local coverage in 2026 discussed possible data-center interest; listings have also pointed at nearby fiber and wastewater. Nothing in this tracker’s sources shows an approved residential PUD on this tract. It is here because a land-use change of this size would affect East Palatka traffic, utilities, and housing demand — not because homes are entitled. Status remains Concept / watch until a county application is filed.",
    latestSummaryAt: "2026-05-01T12:00:00.000Z",
    confidence: "watch",
    published: true,
    featured: false,
    milestones: [
      {
        occurredOn: "2026-04-01",
        title: "Public marketing of the assemblage",
        body: "Local media and listing materials described a ~1,300-acre Gilbert Road property. No housing entitlement is attached.",
        sourceLabel: "Local reporting",
      },
    ],
  },
  {
    slug: "american-gardens",
    name: "American Gardens",
    locationLabel: "East Palatka",
    area: "East Palatka",
    lat: 29.6554,
    lng: -81.5981,
    status: "built_out",
    acres: null,
    lotsCurrent: 211,
    lotsRezoning: null,
    unitsNote:
      "Established neighborhood with homes dating from the late 19th century through recent infill. Not a new PUD.",
    commercialSqft: null,
    builder: "Various",
    developer: null,
    countyCase: null,
    ordinance: null,
    sjrwmdFile: null,
    officialLinks: [
      { label: "Putnam County Property Appraiser", url: "https://pa.putnam-fl.com/" },
    ],
    latestSummary:
      "American Gardens is an existing East Palatka neighborhood, not a greenfield subdivision. MLS and public-record compilations describe on the order of 200 homes with a very wide age range. It is on this tracker so buyers comparing “East Palatka” to Alford Farms can tell established streets from entitled dirt. Occasional infill or teardown-rebuilds show up as ordinary building permits, not a PUD. If you want new construction with a builder warranty, this is not that product; if you want to live in East Palatka now, it is part of the real inventory.",
    latestSummaryAt: "2026-07-01T12:00:00.000Z",
    confidence: "confirmed",
    published: true,
    featured: false,
    milestones: [
      {
        occurredOn: "2024-01-01",
        title: "Existing community baseline",
        body: "Recorded as a built-out reference neighborhood so the tracker is not only pipeline dirt.",
        sourceLabel: "Property appraiser / MLS compilations",
      },
    ],
  },
  {
    slug: "interlachen-lakes",
    name: "Interlachen Lakes area",
    locationLabel: "Interlachen, western Putnam County",
    area: "Putnam County",
    lat: 29.6227,
    lng: -81.891,
    status: "selling",
    acres: null,
    lotsCurrent: null,
    lotsRezoning: null,
    unitsNote:
      "Existing lake-lot and inland neighborhood fabric west of Palatka. Lots and older homes still trade; this is not a single new PUD.",
    commercialSqft: null,
    builder: "Various",
    developer: null,
    countyCase: null,
    ordinance: null,
    sjrwmdFile: null,
    officialLinks: [
      { label: "Town of Interlachen", url: "https://www.interlachen-fl.gov/" },
      { label: "Putnam County", url: "https://www.putnam-fl.gov/" },
    ],
    latestSummary:
      "Interlachen sits on the west side of Putnam County, a different housing market from the SR 207 commute toward St. Augustine. Neighborhoods such as Interlachen Lakes Estates still see lot and home sales at prices generally below Palatka and far below St. Johns County. There is no Alford-scale PUD here in our file. The entry exists because people “moving to Putnam” are often choosing among Palatka, East Palatka, Interlachen, Crescent City, and river towns like Welaka — and those are not interchangeable. Expect wells and septic on many lots, Clay Electric or FPL depending on the street, and a longer drive to Palatka services.",
    latestSummaryAt: "2026-07-15T12:00:00.000Z",
    confidence: "confirmed",
    published: true,
    featured: false,
    milestones: [
      {
        occurredOn: "2024-01-01",
        title: "Existing community baseline",
        body: "Tracked as an active existing market, not a new master plan.",
        sourceLabel: "Local market compilations",
      },
    ],
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
    title: "Alford Farms still in permit review, not sales",
    body: "Spring 2026 file reads still show SJRWMD and engineering work as the live step. Rezoning from August 2024 is the last major political milestone. No confirmed plat recording or model-home opening.",
    kind: "whats_new",
    sourceLabel: "Public records compilation",
    createdAt: "2026-04-15T12:00:00.000Z",
  },
  {
    projectSlug: "east-river-road",
    title: "Second Horton site remains unconfirmed in county ordinances",
    body: "The 189-home East River Road report is still on the watch list. We have not matched it to a published PUD case number. That is the whole update: absence of a filing is itself information.",
    kind: "whats_new",
    sourceLabel: "Tracker review",
    createdAt: "2026-01-20T12:00:00.000Z",
  },
  {
    projectSlug: "gilbert-road-tract",
    title: "Gilbert Road assemblage is not a housing approval",
    body: "Large-tract marketing and data-center chatter are not a residential PUD. This tracker will only change the status if a county application lands.",
    kind: "whats_new",
    sourceLabel: "Local reporting",
    createdAt: "2026-05-01T12:00:00.000Z",
  },
];

export const SEED_SOURCES: { name: string; url: string; kind: string }[] = [
  {
    name: "Google News — Alford Farms / East Palatka housing",
    url: "https://news.google.com/rss/search?q=Alford+Farms+Palatka+OR+%22East+Palatka%22+subdivision+OR+%22Putnam+County%22+PUD&hl=en-US&gl=US&ceid=US:en",
    kind: "rss",
  },
  {
    name: "Google News — Palatka development",
    url: "https://news.google.com/rss/search?q=Palatka+Florida+(housing+OR+subdivision+OR+rezoning+OR+development)&hl=en-US&gl=US&ceid=US:en",
    kind: "rss",
  },
  {
    name: "Palatka Daily News feed",
    url: "https://www.palatkadailynews.com/feed",
    kind: "rss",
  },
  {
    name: "Putnam County Planning & Zoning",
    url: "https://www.putnam-fl.gov/241/Planning-Zoning",
    kind: "html",
  },
  {
    name: "SJRWMD Putnam County",
    url: "https://www.sjrwmd.com/district-counties/putnam-county/",
    kind: "html",
  },
];

export const SEED_MARKET = {
  capturedOn: "2026-06-30",
  medianSaleLow: 220000,
  medianSaleHigh: 310000,
  medianNote:
    "Public market reports for mid-2026 disagree because they measure different things. Zillow-style typical values for Putnam County sit near $220,000. County-wide sale medians in some realtor summaries are in the mid-$200,000s. Redfin’s three-month Putnam median around June 2026 printed near $309,000. Palatka listing medians on Realtor.com were near $300,000. Treat this as a band, not a price tag: mix of sales (waterfront vs inland, new vs old) moves the median more than any one month of “the market.”",
  daysOnMarket: 60,
  sourceNote:
    "Compiled from public market dashboards (Zillow, Redfin, Realtor.com, and local MLS recaps) as of June–July 2026. Not an appraisal.",
};

export const SEED_PRODUCTS: {
  asin: string | null;
  title: string;
  category: string;
  blurb: string;
  searchQuery: string;
  sortOrder: number;
}[] = [
  {
    asin: "B00006IC57",
    title: "Heavy-duty moving boxes",
    category: "moving",
    blurb: "Florida humidity and a long I-95 day will crush bargain cartons. Use real moving boxes.",
    searchQuery: "bankers box moving boxes",
    sortOrder: 1,
  },
  {
    asin: "B0000DH8GQ",
    title: "Packing tape (multi-pack)",
    category: "moving",
    blurb: "Cheap tape fails in heat. Get a name-brand multi-pack and extra dispensers.",
    searchQuery: "scotch packing tape 6 pack",
    sortOrder: 2,
  },
  {
    asin: "B00KT1P03W",
    title: "First-aid kit",
    category: "moving",
    blurb: "For the truck, the first night, and the junk-drawer gap before you unpack.",
    searchQuery: "family first aid kit",
    sortOrder: 3,
  },
  {
    asin: "B00CWS7TKE",
    title: "Basic home tool kit",
    category: "tools",
    blurb: "New construction and 1940s cottages both need a driver, level, tape, and hammer on day one.",
    searchQuery: "home tool kit set",
    sortOrder: 4,
  },
  {
    asin: null,
    title: "Mattress protector (waterproof)",
    category: "home-setup",
    blurb: "Humidity, spills, and Florida pests. Put one on every bed before the first night.",
    searchQuery: "waterproof mattress protector queen",
    sortOrder: 5,
  },
  {
    asin: null,
    title: "Dehumidifier",
    category: "home-setup",
    blurb: "Closets and interior rooms will sweat in summer if the A/C is undersized or you are between systems.",
    searchQuery: "dehumidifier 50 pint",
    sortOrder: 6,
  },
  {
    asin: null,
    title: "Box fan / air circulator",
    category: "home-setup",
    blurb: "Useful during move-in, storms, and the week you wait on an A/C appointment.",
    searchQuery: "lasko air circulator fan",
    sortOrder: 7,
  },
  {
    asin: null,
    title: "Outdoor all-weather rug",
    category: "outdoor",
    blurb: "A screened porch or lanai is half the reason people move here. Start with a washable outdoor rug.",
    searchQuery: "indoor outdoor rug 5x7",
    sortOrder: 8,
  },
  {
    asin: null,
    title: "Gas or charcoal grill",
    category: "outdoor",
    blurb: "Most East Palatka lots have the space. Check HOA/PUD rules before a permanent outdoor kitchen.",
    searchQuery: "propane grill two burner",
    sortOrder: 9,
  },
  {
    asin: null,
    title: "Garden hose and nozzle",
    category: "outdoor",
    blurb: "New sod, well water, and sandy soil. A 75-foot hose is not overkill.",
    searchQuery: "50 foot garden hose nozzle",
    sortOrder: 10,
  },
  {
    asin: null,
    title: "Hurricane supply kit",
    category: "hurricane",
    blurb: "Season runs June through November. Water, radio, batteries, and a plan beat last-minute stores.",
    searchQuery: "emergency weather radio batteries water",
    sortOrder: 11,
  },
  {
    asin: null,
    title: "LED flashlights and lanterns",
    category: "hurricane",
    blurb: "Clay Electric and FPL are generally solid; storms still take trees down on rural laterals.",
    searchQuery: "led lantern flashlight rechargeable",
    sortOrder: 12,
  },
  {
    asin: null,
    title: "Mosquito treatment for yards",
    category: "outdoor",
    blurb: "You are next to a river and wetlands. Treat the yard before you host anyone at dusk.",
    searchQuery: "yard mosquito fogger spray",
    sortOrder: 13,
  },
  {
    asin: null,
    title: "Window solar film",
    category: "home-setup",
    blurb: "West-facing rooms on new construction can cook. Film is cheaper than fighting the A/C.",
    searchQuery: "window solar film heat control",
    sortOrder: 14,
  },
];

export const SEED_FAQS: { question: string; answer: string; sortOrder: number }[] = [
  {
    question: "Is Alford Farms selling homes yet?",
    answer:
      "Not according to the public record this site reviews. The PUD rezoning was approved in August 2024. Engineering and SJRWMD permitting were still the live steps into 2026. Rezoning is not a certificate of occupancy and it is not a sales opening. Check D.R. Horton and the county plat books before you plan a closing date around this community.",
    sortOrder: 1,
  },
  {
    question: "Why do some pages say 700 homes and others say 559?",
    answer:
      "The 700 figure is the entitlement envelope described at rezoning. The 559 figure appears in later engineering documents. Large Florida PUDs often shrink between the political approval and the construction set. Neither number is a promise of a closing calendar.",
    sortOrder: 2,
  },
  {
    question: "Is D.R. Horton the builder?",
    answer:
      "County filings name D.R. Horton, Inc. as an agent on Alford Farms, and local reports also attach Horton to a possible 189-home site at East River Road. “Named in the file” is not the same as a published community on the builder’s website. Confirm on Horton’s site and with the county before treating it as a shoppable community.",
    sortOrder: 3,
  },
  {
    question: "Where is East Palatka relative to Palatka?",
    answer:
      "East Palatka sits across / along the St. Johns River from downtown Palatka, on the SR 207 side toward St. Augustine. Many people who work in St. Johns County look here because land and list prices are lower. The commute on 207 is real; so are school-district and utility boundaries that do not match the marketing name “Palatka.”",
    sortOrder: 4,
  },
  {
    question: "Will I have city water and sewer?",
    answer:
      "Inside Palatka city limits, usually yes (confirm with the city). Unincorporated East Palatka and much of Putnam County still use wells and septic on older lots. New PUDs typically extend or build central utilities — that is one reason they take years. Ask the builder and the county utilities staff about the specific parcel; do not assume the neighbor’s setup.",
    sortOrder: 5,
  },
  {
    question: "Clay Electric or FPL?",
    answer:
      "Both serve Putnam County. Clay Electric Cooperative has a Palatka district office at 300 N. SR 19. FPL also has a large footprint. Territory follows lines on a map, not city names. Use each utility’s address lookup, or the Florida PSC map, before you schedule a connect.",
    sortOrder: 6,
  },
  {
    question: "What about flood zones and insurance?",
    answer:
      "You are on a major Florida river with tributaries, wetlands, and a hurricane coast two counties away. Pull the FEMA flood map for the exact parcel, budget for Florida property insurance (which has been volatile statewide), and ask about wind-mitigation credits. This site does not sell insurance and will not guess your premium.",
    sortOrder: 7,
  },
  {
    question: "Which schools would we use?",
    answer:
      "Putnam County School District. Palatka Jr.-Sr. High is the main Palatka secondary campus. Elementary assignments depend on the address — use the district’s school locator, not a Facebook comment. St. Johns River State College has a Palatka campus for dual-enrollment and two-year programs.",
    sortOrder: 8,
  },
  {
    question: "How does this site stay updated?",
    answer:
      "A scheduled job fetches county pages, water-management notices, and news RSS feeds. New items are matched to projects by name and case number. When an AI key is configured, the job writes a plain-language summary. If the job fails, the last good data stays on the site. An admin can force a refresh.",
    sortOrder: 9,
  },
  {
    question: "Are you the county or a realtor?",
    answer:
      "No. This is an independent public tracker and moving guide. It is not Putnam County, not the City of Palatka, not D.R. Horton, and not a brokerage. Sources are linked. If a county PDF and this page disagree, the county PDF wins.",
    sortOrder: 10,
  },
];
