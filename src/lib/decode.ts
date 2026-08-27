export const ADDRESS_EXAMPLES = [
  { label: "The Collection", query: "508 N 17th St, Palatka, FL" },
  { label: "Downtown Palatka", query: "221 Reid St, Palatka, FL" },
  { label: "Alford Road", query: "Alford Road, East Palatka, FL" },
] as const;

export type Jurisdiction = "palatka-city" | "east-palatka" | "putnam-unincorporated" | "outside";

export type DecodeNearby = {
  slug: string;
  name: string;
  status: string;
  miles: number;
  locationLabel: string;
};

export type DecodeFact = {
  label: string;
  detail: string;
  href?: string;
  hrefLabel?: string;
};

export type DecodeResult = {
  input: string;
  matched: string;
  lat: number;
  lng: number;
  county: string | null;
  place: string | null;
  subdivision: string | null;
  jurisdiction: Jurisdiction;
  jurisdictionLabel: string;
  water: DecodeFact;
  electric: DecodeFact;
  flood: DecodeFact;
  school: DecodeFact;
  nearby: DecodeNearby[];
  sources: string[];
  error?: string;
};

export const ADDRESS_FAQS = [
  {
    question: "Is this Palatka city or East Palatka?",
    answer:
      "The Census Bureau’s geocoder reports incorporated place. Palatka city is a municipality. East Palatka is unincorporated Putnam County. A listing photo that says Palatka is not a legal address.",
  },
  {
    question: "Can you tell me my flood zone?",
    answer:
      "Not as a determination. Neighborhood names and PUD maps are not FEMA maps. This tool geocodes the street, then sends you to FEMA’s Map Service Center for the parcel. Insurance quotes still need an elevation certificate on many river lots.",
  },
  {
    question: "Which electric company serves my street?",
    answer:
      "Clay Electric and FPL both operate in Putnam. Territory is by line, not by city name. East Palatka lots can go either way. Look the street up on both sites before you schedule a connect.",
  },
];
