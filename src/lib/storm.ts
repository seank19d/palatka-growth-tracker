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
    prompt: "Where will you be?",
    hint: "Palatka isn’t the coast. Trees still take down lines, and the river still comes up.",
    options: [
      {
        value: "collection",
        label: "New construction in town",
        detail: "Something like The Collection. New roof, no shutters yet.",
      },
      {
        value: "east",
        label: "East Palatka or acreage",
        detail: "Unincorporated. Often a well. Roads that hold water.",
      },
      {
        value: "old",
        label: "An older Palatka house",
        detail: "Cottage or ranch. When the A/C dies, the house gets damp.",
      },
      {
        value: "looking",
        label: "Haven’t closed yet",
        detail: "Still looking, or waiting on a closing date.",
      },
    ],
  },
  {
    key: "people",
    prompt: "How many people in the house?",
    hint: "Used to size water and flashlights.",
    options: [
      { value: "couple", label: "1–2", detail: "One lantern and a couple of water jugs is usually enough." },
      { value: "family", label: "3–4", detail: "Add a cooler and extra water. Publix runs out of both." },
      { value: "large", label: "5 or more", detail: "Plan on the power being out overnight." },
    ],
  },
  {
    key: "backup",
    prompt: "Do you already have backup power?",
    hint: "Clay Electric outages: 1-888-434-9844. FPL: 1-800-4OUTAGE.",
    options: [
      { value: "none", label: "No", detail: "A small power station will run phones and a lamp." },
      { value: "station", label: "A power station / big battery", detail: "Add a heavy extension cord if you also have a generator." },
      { value: "generator", label: "A generator", detail: "Put a carbon monoxide detector in the house. Never run a generator in the garage." },
    ],
  },
  {
    key: "water",
    prompt: "How does the house get water?",
    hint: "A well pump needs electricity. City water can still lose pressure.",
    options: [
      { value: "city", label: "City of Palatka", detail: "Keep drinking water on hand anyway." },
      { value: "well", label: "Private well", detail: "No power, no pump. Test the well if floodwater sat around it." },
      { value: "unsure", label: "Not sure", detail: "If you don’t know, buy water as if you’re on a well." },
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
      body: "Most East Palatka lots run on a well. When Clay Electric or FPL is down, the pump is down. Keep drinking water you can carry, a flashlight, and a radio. Cell service gets slow when the whole county is on it.",
      points: [
        "Clay Electric Cooperative — outages 1-888-434-9844. Palatka office (386) 328-1432.",
        "FPL — 1-800-4OUTAGE. Look up your street; the word Palatka on a listing doesn’t tell you which company you have.",
        "Evacuation orders come from Putnam County Emergency Management.",
        "If water sat around the wellhead, get the well tested before you drink it.",
      ],
    };
  }
  if (a.house === "collection") {
    return {
      kicker: "In-town new construction",
      headline: "A new house still goes dark when a tree hits the line.",
      body: "The Collection is inside the city. A new roof helps. You still want drinking water, a radio, and a way to charge phones.",
      points: [
        "West-facing rooms get hot once the A/C stops. Window film is cheaper than a hotel.",
        "If the community has HOA rules, check them before you buy a generator.",
        "Clay Electric or FPL — look up the street. City limits don’t pick the utility.",
        "Official notices come from Putnam County Emergency Management.",
      ],
    };
  }
  if (a.house === "old") {
    return {
      kicker: "Older Palatka house",
      headline: "After the power goes out, the house gets damp.",
      body: "When the A/C stops, closets sweat. A tarp, a dehumidifier, and a fan you can run off a battery are the usual list.",
      points: [
        "A tarp and a basic tool kit cover a lot of roof and yard damage.",
        "If you have a generator, put a carbon monoxide detector in the house.",
        "Boil-water notices come from the city or the county.",
        "For official storm guidance, use Putnam County Emergency Management.",
      ],
    };
  }
  return {
    kicker: "Still looking",
    headline: "Get water and a radio even if you haven’t closed.",
    body: "Storm season in Putnam is June through November. You can close on a house in September and sit through a hurricane the first month. Stores empty out fast.",
    points: [
      "A radio and a water jug can go with you if closing slips.",
      "Check whether the street is city or unincorporated before you assume city water.",
      "Alford Farms is still a county file. Don’t plan around a sales date that isn’t public.",
      "Official notices: Putnam County Emergency Management.",
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
      "Putnam County is inland. If there is an evacuation, Putnam County Emergency Management issues it. Palatka still loses power and can flood from the river on heavy rain.",
  },
  {
    question: "Who do I call when the lights go out?",
    answer:
      "Clay Electric Cooperative: 1-888-434-9844. Palatka office: (386) 328-1432. FPL: 1-800-4OUTAGE. Look up your street — Palatka on a listing doesn’t tell you which company you have.",
  },
  {
    question: "Will a well run during an outage?",
    answer:
      "No. The pump needs power. Keep drinking water. If floodwater sat around the wellhead, get the well tested.",
  },
  {
    question: "Is this an official emergency kit?",
    answer:
      "No. It’s a shopping list for a Palatka house, with Amazon links. We may earn a commission. For official guidance use Putnam County Emergency Management and the National Weather Service in Jacksonville.",
  },
];
