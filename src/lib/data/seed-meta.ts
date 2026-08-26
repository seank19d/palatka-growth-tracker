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
    body: "Large-tract marketing and data-center chatter are not a residential PUD. Status stays Concept until a county application lands.",
    kind: "whats_new",
    sourceLabel: "Local reporting",
    createdAt: "2026-05-01T12:00:00.000Z",
  },
  {
    projectSlug: "collection-at-palatka",
    title: "In-town new construction is already selling",
    body: "The Collection at Palatka by Century Complete is listed as selling near downtown, with advertised prices in the low $200,000s. That is a separate product from Alford Farms on SR 207, which is still in the county file.",
    kind: "whats_new",
    sourceLabel: "Builder listing / public marketing",
    createdAt: "2026-08-19T12:00:00.000Z",
  },
  {
    projectSlug: "alford-farms",
    title: "August 2026 file check: still permitting, not sales",
    body: "A fresh pass over the public file in August 2026 found no plat recording and no confirmed home-sale opening. Status remains engineering and environmental permitting under PUD24-000004.",
    kind: "whats_new",
    sourceLabel: "Public records compilation",
    createdAt: "2026-08-20T12:00:00.000Z",
  },
];

export const SEED_SOURCES: { name: string; url: string; kind: string }[] = [
  {
    name: "Google News — Alford Farms / East Palatka housing",
    url: "https://news.google.com/rss/search?q=%22Alford+Farms%22+(Palatka+OR+%22East+Palatka%22+OR+Putnam)&hl=en-US&gl=US&ceid=US:en",
    kind: "rss",
  },
  {
    name: "Google News — Palatka development",
    url: "https://news.google.com/rss/search?q=Palatka+Florida+(housing+OR+subdivision+OR+rezoning+OR+development+OR+Mattamy+OR+%22new+homes%22)&hl=en-US&gl=US&ceid=US:en",
    kind: "rss",
  },
  {
    name: "Google News — Collection / Mattamy Palatka",
    url: "https://news.google.com/rss/search?q=%22Collection+at+Palatka%22+OR+(Mattamy+Palatka)+OR+%22Century+Complete%22+Palatka&hl=en-US&gl=US&ceid=US:en",
    kind: "rss",
  },
  {
    name: "Palatka Daily News feed",
    url: "https://www.palatkadailynews.com/feed",
    kind: "rss",
  },
  {
    name: "Putnam County Planning & Zoning",
    url: "https://www.putnam-fl.gov/departments/development-services/planning-and-zoning/",
    kind: "html",
  },
  {
    name: "City of Palatka Planning",
    url: "https://palatka-fl.gov/131/Planning-Department",
    kind: "html",
  },
  {
    name: "SJRWMD Putnam County",
    url: "https://news.google.com/rss/search?q=SJRWMD+(Palatka+OR+Putnam+OR+%22East+Palatka%22)+(permit+OR+ERP+OR+stormwater)&hl=en-US&gl=US&ceid=US:en",
    kind: "rss",
  },
];

export const SEED_MARKET = {
  capturedOn: "2026-06-30",
  medianSaleLow: 220000,
  medianSaleHigh: 310000,
  medianNote:
    "Public dashboards for mid-2026 do not agree on a single Putnam median. Typical-value products print near $220,000. Some Palatka listing medians sit closer to $300,000. Redfin’s short-window county median around June 2026 came in near $309,000. Waterfront and newer homes pull the number up; inland stock pulls it down. Read it as a range, not an asking price.",
  daysOnMarket: 60,
  sourceNote:
    "Compiled from public market dashboards (Zillow, Redfin, Realtor.com, and local MLS recaps) as of June–July 2026. Not an appraisal.",
};
