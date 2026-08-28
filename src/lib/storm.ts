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
    prompt: "Where will you be riding this out?",
    hint: "We’re inland, so it’s usually trees on the lines and water in the roads.",
    options: [
      {
        value: "collection",
        label: "New construction in town",
        detail: "The Collection, or something like it. New roof, no shutters yet.",
      },
      {
        value: "east",
        label: "East Palatka or a bigger lot",
        detail: "Unincorporated. A lot of these are on a well, and the roads pond when it rains hard.",
      },
      {
        value: "old",
        label: "An older house in Palatka",
        detail: "Cottages and ranches. Once the A/C dies, the inside gets muggy fast.",
      },
      {
        value: "looking",
        label: "I haven’t closed yet",
        detail: "Still looking, or waiting on a closing date.",
      },
    ],
  },
  {
    key: "people",
    prompt: "How many people will be there?",
    hint: "Just so we know how much water and how many flashlights.",
    options: [
      {
        value: "couple",
        label: "1–2",
        detail: "One lantern and a couple of water jugs will usually cover you.",
      },
      {
        value: "family",
        label: "3–4",
        detail: "You’ll want a cooler and extra water. Publix sells out of both once a storm is on the map.",
      },
      {
        value: "large",
        label: "5 or more",
        detail: "Figure the power could be out overnight and plan the water around that.",
      },
    ],
  },
  {
    key: "backup",
    prompt: "Do you have anything for backup power?",
    hint: "If the lights go out, Clay Electric is 1-888-434-9844 and FPL is 1-800-4OUTAGE.",
    options: [
      {
        value: "none",
        label: "Nothing yet",
        detail: "A small power station will keep phones and a lamp going for a while.",
      },
      {
        value: "station",
        label: "A power station or a big battery",
        detail: "If you also have a generator, grab a heavy outdoor extension cord.",
      },
      {
        value: "generator",
        label: "A generator",
        detail: "Keep it outside, never in the garage, and put a carbon monoxide detector in the house.",
      },
    ],
  },
  {
    key: "water",
    prompt: "Is the house on city water or a well?",
    hint: "Well pumps need electricity. Even city water can lose pressure if the outage goes on.",
    options: [
      {
        value: "city",
        label: "City of Palatka",
        detail: "I’d still keep drinking water on hand. Pressure can drop on a long outage.",
      },
      {
        value: "well",
        label: "Private well",
        detail: "No power means no pump. If floodwater sat around the well, get it tested before you drink it.",
      },
      {
        value: "unsure",
        label: "I’m not sure",
        detail: "If you don’t know, treat it like a well and buy water.",
      },
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
      body: "Most lots out in East Palatka are on a well, so when Clay Electric or FPL goes down, the pump goes with it. You’ll want drinking water you can actually carry, a flashlight that isn’t your phone, and a radio for when the cell network is slammed. Look up the street for which company you have — a listing that says Palatka doesn’t tell you.",
      points: [
        "Clay Electric Cooperative, outages: 1-888-434-9844. Palatka office: (386) 328-1432.",
        "FPL: 1-800-4OUTAGE.",
        "If the county issues an evacuation, it comes from Putnam County Emergency Management.",
        "If water sat around the wellhead, get the well tested before you drink from the tap.",
      ],
    };
  }
  if (a.house === "collection") {
    return {
      kicker: "In-town new construction",
      headline: "A new house still goes dark when a tree hits the line.",
      body: "The Collection is inside the city, so you’re on municipal services, but a tree on the line still takes the house with it. A new roof helps. You still want drinking water, a radio, and some way to keep phones charged. If the neighborhood has HOA rules, read them before you buy a generator.",
      points: [
        "West-facing rooms get hot once the A/C stops. Window film is cheaper than a hotel night.",
        "Clay Electric or FPL — look up the street. Being in city limits doesn’t pick the utility.",
        "Official notices come from Putnam County Emergency Management.",
      ],
    };
  }
  if (a.house === "old") {
    return {
      kicker: "Older Palatka house",
      headline: "Once the A/C stops, the house gets sticky.",
      body: "Older Palatka houses sweat in the closets pretty quickly when the power’s out. A tarp for the roof or the yard, a dehumidifier, and a fan you can run off a battery are what people actually use. If you’ve got a generator, keep it outside and put a carbon monoxide detector in the house.",
      points: [
        "A tarp and a basic tool kit cover a lot of roof and yard damage.",
        "Boil-water notices come from the city or the county, not from a neighborhood group.",
        "For official storm guidance, use Putnam County Emergency Management.",
      ],
    };
  }
  return {
    kicker: "Still looking",
    headline: "I’d get water and a radio even if you haven’t closed.",
    body: "Storm season here is June through November, so you can close in September and still sit through a hurricane the first month. Water and a radio will travel with you if closing slips, and the stores empty out once something is on the map.",
    points: [
      "Check whether the street is in the city or unincorporated before you assume city water.",
      "Alford Farms is still a county file. Don’t plan a move around a sales date that isn’t public.",
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
      "We’re inland, so it isn’t like the beach towns. If the county does issue an evacuation, it comes from Putnam County Emergency Management. We still lose power, and the river can come up on a heavy rain even when the storm doesn’t make a direct hit.",
  },
  {
    question: "Who do I call when the lights go out?",
    answer:
      "It depends whose lines you’re on. Clay Electric is 1-888-434-9844, and the Palatka office is (386) 328-1432. FPL is 1-800-4OUTAGE. A listing that says Palatka doesn’t tell you which company you have — look up the street.",
  },
  {
    question: "Will a well run if the power is out?",
    answer:
      "No. The pump needs electricity, so keep drinking water in the house. If floodwater sat around the wellhead, get the well tested before you go back to the tap.",
  },
  {
    question: "Is this an official emergency list?",
    answer:
      "No. It’s a shopping list for a Palatka house, and the links go to Amazon. We may earn a commission. For official guidance, use Putnam County Emergency Management and the National Weather Service in Jacksonville.",
  },
];
