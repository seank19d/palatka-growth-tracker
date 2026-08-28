import type { AffiliateProduct } from "@/lib/types";

export type House = "collection" | "east" | "old" | "looking";
export type People = "couple" | "family" | "large";
export type Backup = "none" | "station" | "generator";
export type Water = "city" | "well" | "unsure";

export type StormAnswers = {
  house: House;
  people: People;
  backup: Backup;
  water: Water;
};

type Option<T extends string> = { value: T; label: string; detail: string };

export type StormQuestion<K extends keyof StormAnswers = keyof StormAnswers> = {
  key: K;
  prompt: string;
  hint: string;
  options: Option<StormAnswers[K]>[];
};

export const STORM_QUESTIONS: [
  StormQuestion<"house">,
  StormQuestion<"people">,
  StormQuestion<"backup">,
  StormQuestion<"water">,
] = [
  {
    key: "house",
    prompt: "Which house are you in when it hits?",
    hint: "Putnam is inland. Trees, laterals, and the river still do the damage — not a beach surge.",
    options: [
      {
        value: "collection",
        label: "New construction in town",
        detail: "Collection-class house. Warranty, builder glass, no shutters yet.",
      },
      {
        value: "east",
        label: "East Palatka / acreage",
        detail: "Unincorporated. Longer laterals, often a well, often clay roads that pond.",
      },
      {
        value: "old",
        label: "An older Palatka house",
        detail: "Cottages and 1970s ranch. Humidity after the outage is the second storm.",
      },
      {
        value: "looking",
        label: "Still looking / not closed",
        detail: "Buy water and a radio before you buy furniture.",
      },
    ],
  },
  {
    key: "people",
    prompt: "How many people overnight?",
    hint: "Water and light scale. A 50-inch TV does not.",
    options: [
      { value: "couple", label: "1–2", detail: "One lantern, one water jug, one pack of batteries can be enough." },
      { value: "family", label: "3–4", detail: "A cooler and a second water jug beat a last-minute Publix run." },
      { value: "large", label: "5 or more", detail: "Assume the power is out overnight and the stores are picked over." },
    ],
  },
  {
    key: "backup",
    prompt: "What power do you already have?",
    hint: "Clay Electric outage line is 1-888-434-9844. FPL is 1-800-4OUTAGE. Neither replaces a light in the house.",
    options: [
      { value: "none", label: "Nothing yet", detail: "A mid-size power station is the item that actually gets used." },
      { value: "station", label: "A power station / big battery", detail: "Add a heavy cord and a CO detector if you also run a generator." },
      { value: "generator", label: "A generator", detail: "Carbon monoxide kills people in closed garages. Put the detector in the house, not on the unit." },
    ],
  },
  {
    key: "water",
    prompt: "How does the house get water?",
    hint: "A well pump is an electric appliance. City taps can still go on a boil-water notice.",
    options: [
      { value: "city", label: "City of Palatka tap", detail: "Store drinking water anyway. Pressure can drop on a long outage." },
      { value: "well", label: "Private well", detail: "No power, no pump. Test the well after floodwater, not before." },
      { value: "unsure", label: "Not sure", detail: "Treat it as a well until the property appraiser and a plumber say otherwise." },
    ],
  },
];

export type StormRead = {
  kicker: string;
  headline: string;
  body: string;
  points: string[];
};

export function scoreStorm(a: StormAnswers): StormRead {
  if (a.house === "east" || a.water === "well") {
    return {
      kicker: "East Palatka / well",
      headline: "If the power is out, the well is out.",
      body: "Unincorporated Putnam sits on longer laterals and a lot of private wells. You do not need a bunker. You need drinking water you can lift, light you already own, and a radio that works when the phone tower is busy.",
      points: [
        "Clay Electric Cooperative — outages 1-888-434-9844. Palatka office (386) 328-1432.",
        "FPL — 1-800-4OUTAGE. Territory is by line, not by the word Palatka on a listing.",
        "Putnam County Emergency Management is the evacuation record. This page is not.",
        "After standing water, test the well. Do not guess from the color of the tap.",
      ],
    };
  }
  if (a.house === "collection") {
    return {
      kicker: "In-town new construction",
      headline: "A new house still goes dark when a tree hits a lateral.",
      body: "The Collection is inside Palatka city, not on the beach. Builder glass and a fresh roof help. They do not replace a radio, drinking water, or a battery you charged on a quiet Tuesday.",
      points: [
        "West-facing rooms cook after the A/C dies. Film is cheaper than a hotel.",
        "HOA/PUD rules can limit generators and fuel on the lot. Read that before you buy a 5,000-watt unit.",
        "Clay Electric or FPL — look up the street. City limits do not pick the utility.",
        "Putnam County Emergency Management issues the real notices. Not a builder text thread.",
      ],
    };
  }
  if (a.house === "old") {
    return {
      kicker: "Older Palatka house",
      headline: "The second storm is humidity.",
      body: "When the A/C stops, closets sweat and particleboard swells. A tarp, a dehumidifier you already own, and a fan you can run off a station beat a last-minute generator panic.",
      points: [
        "A poly tarp and a real tool kit matter more than sandbags on high ground.",
        "Run a carbon monoxide detector if anything with a motor lives in the garage.",
        "Boil-water notices come from the city or county, not from Facebook.",
        "This is not an official emergency list. Use Putnam County Emergency Management for that.",
      ],
    };
  }
  return {
    kicker: "Still looking",
    headline: "Buy water and a radio before you buy the sofa.",
    body: "Storm season in Putnam is June through November. You can land a Collection house in September and still sit through a named storm the first month. The cheap mistakes are waiting until the stores are empty.",
    points: [
      "A NOAA radio and a water jug travel with you if the closing slips.",
      "Decode the street for city vs unincorporated before you assume city water.",
      "Alford Farms is still a PUD file. Do not plan a storm season around a sales date that is not public.",
      "Putnam County Emergency Management is the official channel.",
    ],
  };
}

const ALWAYS = [
  "Hurricane supply kit",
  "LED flashlights and lanterns",
  "First-aid kit",
  "Drinking water containers",
  "AA batteries (bulk)",
];

export function buildStormKit(products: AffiliateProduct[], a: StormAnswers): AffiliateProduct[] {
  const want = new Set(ALWAYS);
  if (a.people !== "couple") want.add("Cooler");
  if (a.water !== "city") {
    want.add("Well water test kit");
    want.add("Drinking water containers");
  }
  if (a.backup === "none") want.add("Portable power station");
  if (a.backup === "generator") {
    want.add("Carbon monoxide detector");
    want.add("Heavy-duty extension cord");
  }
  if (a.backup === "station") want.add("Heavy-duty extension cord");
  if (a.house === "collection") want.add("Window solar film");
  if (a.house === "old" || a.house === "east") want.add("Heavy-duty tarp");
  if (a.house === "old") want.add("Dehumidifier");
  if (a.house === "east") want.add("Mosquito treatment for yards");

  const picked = products.filter((p) => want.has(p.title));
  const order = [
    "Portable power station",
    "Hurricane supply kit",
    "LED flashlights and lanterns",
    "Drinking water containers",
    "Well water test kit",
    "Carbon monoxide detector",
    "Heavy-duty extension cord",
    "AA batteries (bulk)",
    "First-aid kit",
    "Cooler",
    "Heavy-duty tarp",
    "Window solar film",
    "Dehumidifier",
    "Mosquito treatment for yards",
  ];
  return picked.sort((x, y) => order.indexOf(x.title) - order.indexOf(y.title)).slice(0, 9);
}

export const STORM_FAQS = [
  {
    question: "Does Palatka evacuate for hurricanes?",
    answer:
      "Putnam County is inland. Evacuation orders, if any, come from Putnam County Emergency Management — not from this site, not from a builder, and not from a Facebook group. Palatka still loses power and takes river flooding on tropical rain, even without a coastal surge.",
  },
  {
    question: "Who do I call when the lights go out?",
    answer:
      "Clay Electric Cooperative outages: 1-888-434-9844. Palatka district office: (386) 328-1432. FPL: 1-800-4OUTAGE. Look up the street. The word Palatka on a listing does not pick the utility.",
  },
  {
    question: "Will a well run during an outage?",
    answer:
      "No. A private well pump is an electric appliance. Store drinking water. After floodwater around the wellhead, test the water — color is not a lab result.",
  },
  {
    question: "Is this an official emergency kit?",
    answer:
      "No. It is a Palatka-specific shopping list with Amazon links. We may earn a commission. For official guidance use Putnam County Emergency Management and the National Weather Service Jacksonville office.",
  },
];
