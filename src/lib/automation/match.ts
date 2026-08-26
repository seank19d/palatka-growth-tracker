type Rule = {
  slug: string;
  keys: string[];
  /** Builder / generic phrases that must also mention Palatka or Putnam. */
  requirePlace?: boolean;
};

const PLACE = /\bpalatka\b|\bputnam\b|east palatka/;

export const MATCHERS: Rule[] = [
  { slug: "alford-farms", keys: ["alford farms", "alford farm", "pud24-000004", "ordinance 2024-017"] },
  {
    slug: "collection-at-palatka",
    keys: ["collection at palatka", "the collection at palatka"],
  },
  {
    slug: "collection-at-palatka",
    keys: ["century complete", "mattamy"],
    requirePlace: true,
  },
  { slug: "east-river-road", keys: ["east river road", "putnam county blvd", "putnam county boulevard"] },
  { slug: "gilbert-road-tract", keys: ["gilbert road"] },
  { slug: "gilbert-road-tract", keys: ["1,300-acre", "1300-acre", "1300 acre"], requirePlace: true },
  { slug: "gilbert-road-tract", keys: ["data center"], requirePlace: true },
  { slug: "palatka-riverfront-infill", keys: ["palatka cra", "downtown palatka"] },
  { slug: "american-gardens", keys: ["american gardens"] },
  { slug: "interlachen-lakes", keys: ["interlachen lakes"] },
];

const HOUSING_SIGNAL =
  /\b(subdivision|planned unit|\bpud\b|rezoning|new construction|new homes|homebuilder|home builder|mattamy|alford farms|collection at palatka|century complete|site plan|final plat|model home|single-family|single family|built-to-rent|build to rent|data center|stormwater|sjrwmd|plat recorded|lot sales)\b/;

export function isHousingItem(title: string, snippet = ""): boolean {
  const hay = `${title} ${snippet}`.toLowerCase();
  if (!PLACE.test(hay)) return false;
  return HOUSING_SIGNAL.test(hay);
}

export function matchProject<T extends { slug: string; name: string }>(
  text: string,
  projects: T[],
): T | null {
  const hay = text.toLowerCase();
  for (const rule of MATCHERS) {
    if (!rule.keys.some((k) => hay.includes(k))) continue;
    if (rule.requirePlace && !PLACE.test(hay)) continue;
    return projects.find((p) => p.slug === rule.slug) ?? null;
  }
  for (const p of projects) {
    const name = p.name.toLowerCase();
    if (name.length >= 8 && hay.includes(name)) return p;
  }
  return null;
}
