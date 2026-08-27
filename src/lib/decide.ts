import type { AffiliateProduct } from "@/lib/types";

export type When = "soon" | "year" | "looking";
export type Budget = "under250" | "mid" | "open";
export type Where = "city" | "east" | "either";
export type Kids = "yes" | "no";
export type Flood = "high" | "check" | "unsure";
export type Risk = "now" | "wait";
export type Household = "couple" | "family" | "large";
export type Water = "city" | "well" | "unsure";
export type Storm = "season" | "off";

export type DecideAnswers = {
  when: When;
  budget: Budget;
  where: Where;
  kids: Kids;
  flood: Flood;
  risk: Risk;
};

export type KitPrefs = {
  household: Household;
  water: Water;
  storm: Storm;
};

export type VerdictId = "buy" | "wait" | "watch";

export type Verdict = {
  id: VerdictId;
  kicker: string;
  headline: string;
  body: string;
  points: string[];
  primary: { slug: string; label: string; why: string };
  secondary: { slug: string; label: string; why: string };
};

type Option<T extends string> = { value: T; label: string; detail: string };

export type Question<K extends keyof DecideAnswers = keyof DecideAnswers> = {
  key: K;
  prompt: string;
  hint: string;
  options: Option<DecideAnswers[K]>[];
};

export const QUESTIONS: [
  Question<"when">,
  Question<"budget">,
  Question<"where">,
  Question<"kids">,
  Question<"flood">,
  Question<"risk">,
] = [
  {
    key: "when",
    prompt: "When do you need keys?",
    hint: "Alford Farms has no public sales date.",
    options: [
      { value: "soon", label: "In the next 90 days", detail: "Lease up, job start, or already on a clock." },
      { value: "year", label: "Sometime this year", detail: "You can wait, but you need a real closing calendar." },
      { value: "looking", label: "Just mapping the county", detail: "No move date yet." },
    ],
  },
  {
    key: "budget",
    prompt: "What’s the purchase range?",
    hint: "Collection has been advertised from the low $200,000s. Alford has no public list prices.",
    options: [
      { value: "under250", label: "Under $250,000", detail: "New construction in that band is the in-town product." },
      { value: "mid", label: "$250,000–$350,000", detail: "Still shop Collection first; Alford prices are unknown." },
      { value: "open", label: "Flexible / not sure", detail: "Status matters more than a round number right now." },
    ],
  },
  {
    key: "where",
    prompt: "Where do you actually want to live?",
    hint: "East Palatka is unincorporated Putnam. Palatka city is a different utility and school story.",
    options: [
      { value: "city", label: "In Palatka city", detail: "17th Street, downtown side of the river." },
      { value: "east", label: "East Palatka / SR 207", detail: "Toward St. Augustine. Wells and PUDs live here." },
      { value: "either", label: "Either, if the house is right", detail: "You’ll still pick city vs unincorporated on the parcel." },
    ],
  },
  {
    key: "kids",
    prompt: "School assignment matter?",
    hint: "Use the Putnam County School District locator with a street, not a Facebook comment.",
    options: [
      { value: "yes", label: "Yes — kids in the house", detail: "Palatka Jr.-Sr. High is the main secondary campus." },
      { value: "no", label: "No school-age kids", detail: "Still confirm the address if you might rent it later." },
    ],
  },
  {
    key: "flood",
    prompt: "How do you want to handle flood risk?",
    hint: "You are on a major Florida river. Neighborhood names are not FEMA maps.",
    options: [
      { value: "high", label: "I want the higher ground", detail: "East Palatka PUDs sell this. Verify the exact lot." },
      { value: "check", label: "I’ll pull the parcel map", detail: "Correct. Do that before you love a rendering." },
      { value: "unsure", label: "I haven’t looked yet", detail: "Do that before you pick a community." },
    ],
  },
  {
    key: "risk",
    prompt: "Can you wait on a county file?",
    hint: "A PUD approval is an entitlement, not a for-sale sign.",
    options: [
      { value: "now", label: "I need a house that exists", detail: "Shop what’s selling. Watch the pipeline on the side." },
      { value: "wait", label: "I can wait if the land is right", detail: "Fine — just don’t time a lease to Alford." },
    ],
  },
];

export const DEFAULT_KIT: KitPrefs = {
  household: "family",
  water: "unsure",
  storm: "season",
};

export function scoreDecide(a: DecideAnswers): Verdict {
  const needKeys = a.when === "soon" || a.risk === "now";
  const cityLean = a.where === "city";
  const eastLean = a.where === "east" && a.risk === "wait" && a.when !== "soon";
  const justLooking = a.when === "looking" && a.risk === "wait" && !cityLean;

  let id: VerdictId = "watch";
  if (needKeys || cityLean || a.budget === "under250") id = "buy";
  else if (eastLean) id = "wait";
  else if (justLooking) id = "watch";
  else id = "buy";

  const points: string[] = [];
  if (a.kids === "yes") {
    points.push(
      "Run the Putnam County School District locator on the street address. Palatka Jr.-Sr. High is the main secondary campus; elementary follows the parcel, not the marketing name.",
    );
  }
  if (a.flood === "unsure" || a.flood === "high") {
    points.push(
      "Pull the FEMA map for the exact lot before you pick a community. East Palatka PUDs talk up high ground; the river and wetlands are still next door.",
    );
  } else {
    points.push("Keep the FEMA map and a Florida insurance quote on the same week as the builder tour.");
  }
  if (a.budget === "under250") {
    points.push(
      "The only new-construction product on this site advertised in the low-to-mid $200,000s is The Collection. Alford has no public list prices.",
    );
  }
  points.push(
    "This is not a brokerage and not the county. If a Putnam PDF disagrees with this page, the PDF wins.",
  );

  if (id === "buy") {
    return {
      id,
      kicker: "Buy what’s selling",
      headline: "The Collection is the shoppable new construction.",
      body: "Century Complete is taking contracts at 508 N. 17th Street, inside Palatka city, advertised from the low $200,000s. Alford Farms on SR 207 is a 2024 Putnam PUD still in engineering and permitting. A PUD is not a closing date. If you need keys this year, start on 17th Street and keep Alford on a watch list.",
      points,
      primary: {
        slug: "collection-at-palatka",
        label: "The Collection at Palatka",
        why: "Selling · in-town · Century Complete",
      },
      secondary: {
        slug: "alford-farms",
        label: "Alford Farms file",
        why: "Permitting · East Palatka · not selling",
      },
    };
  }

  if (id === "wait") {
    return {
      id,
      kicker: "Watch the East Palatka file",
      headline: "You can follow Alford. Do not time a lease to it.",
      body: "The large East Palatka project people mean is Alford Farms on SR 207. Putnam approved PUD24-000004 in August 2024. Later engineering shows 559 lots, not the 700 talked up at rezoning. D.R. Horton is named as an agent. None of that is a sales opening. If your year slips, The Collection is the in-town product that is actually taking contracts.",
      points,
      primary: {
        slug: "alford-farms",
        label: "Alford Farms file",
        why: "The live East Palatka PUD — still not selling",
      },
      secondary: {
        slug: "collection-at-palatka",
        label: "The Collection at Palatka",
        why: "Backup that exists · selling now",
      },
    };
  }

  return {
    id,
    kicker: "Read both files",
    headline: "Don’t confuse a PUD with a for-sale sign.",
    body: "Two different products get sold as “new Palatka.” The Collection is a small Century Complete community on 17th Street that is marketed as selling. Alford Farms is a large East Palatka PUD with no public sales date. Tour the one that is open. Keep the other in the county file until dirt moves.",
    points,
    primary: {
      slug: "collection-at-palatka",
      label: "The Collection at Palatka",
      why: "The one you can walk this month",
    },
    secondary: {
      slug: "alford-farms",
      label: "Alford Farms file",
      why: "The one still in permitting",
    },
  };
}

const ALWAYS = new Set([
  "Heavy-duty moving boxes",
  "Packing tape (multi-pack)",
  "First-aid kit",
  "Basic home tool kit",
  "Mattress protector (waterproof)",
]);

export function buildKit(products: AffiliateProduct[], prefs: KitPrefs, verdict: VerdictId): AffiliateProduct[] {
  const want = new Set(ALWAYS);
  if (prefs.household !== "couple") want.add("Dehumidifier");
  if (prefs.water !== "city") {
    want.add("Garden hose and nozzle");
    want.add("Dehumidifier");
  }
  if (prefs.storm === "season") {
    want.add("Hurricane supply kit");
    want.add("LED flashlights and lanterns");
  }
  if (verdict === "buy") want.add("Window solar film");
  if (verdict !== "buy" || prefs.water !== "city") {
    want.add("Mosquito treatment for yards");
    want.add("Outdoor all-weather rug");
  }
  if (prefs.household === "large") want.add("Box fan / air circulator");

  const picked = products.filter((p) => want.has(p.title));
  picked.sort((a, b) => a.sortOrder - b.sortOrder);
  return picked.slice(0, 8);
}

export const DECIDE_FAQS = [
  {
    question: "Are there new construction homes for sale in Palatka right now?",
    answer:
      "Yes. The Collection at Palatka (Century Complete, 508 N. 17th Street) is marketed as selling, with starting prices in the low-to-mid $200,000s. Alford Farms in East Palatka is not selling lots in the public record this site reviews.",
  },
  {
    question: "Is Alford Farms selling homes yet?",
    answer:
      "Not according to the public record this site reviews. The PUD rezoning was approved in August 2024. Engineering and SJRWMD permitting were still the live steps into 2026. A PUD is an entitlement, not a closing date.",
  },
  {
    question: "Should I wait for Alford Farms instead of buying The Collection?",
    answer:
      "Only if you can live without a sales calendar. Alford is East Palatka, unincorporated, and still in the county file. The Collection is in Palatka city and advertised as selling. They are not the same product. Match your move date to a house that exists.",
  },
];
