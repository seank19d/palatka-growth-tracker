const ASIN_RE = /^[A-Z0-9]{10}$/;

export function amazonTag(): string {
  if (typeof process === "undefined") return "phr0dc-20";
  return (
    process.env.AMAZON_ASSOCIATE_TAG ||
    process.env.VITE_AMAZON_ASSOCIATE_TAG ||
    "phr0dc-20"
  ).trim();
}

export function cleanAsin(asin?: string | null): string | null {
  if (!asin) return null;
  const a = asin.trim().toUpperCase();
  return ASIN_RE.test(a) ? a : null;
}

/** Tagged search — never 404s, still pays the associate tag. */
export function amazonSearchUrl(query: string, tag = amazonTag()): string {
  const u = new URL("https://www.amazon.com/s");
  u.searchParams.set("k", query.trim() || "home setup Palatka");
  if (tag) u.searchParams.set("tag", tag);
  u.searchParams.set("linkCode", "ll2");
  u.searchParams.set("language", "en_US");
  u.searchParams.set("ref", "as_li_tl");
  return u.toString();
}

/** Clean product URL. No th/psc — those 404 when Amazon drops the variation. */
export function amazonProductUrl(asin: string, tag = amazonTag()): string {
  const a = cleanAsin(asin);
  if (!a) return amazonSearchUrl(asin, tag);
  const u = new URL(`https://www.amazon.com/dp/${a}`);
  if (tag) u.searchParams.set("tag", tag);
  u.searchParams.set("linkCode", "ll1");
  u.searchParams.set("language", "en_US");
  return u.toString();
}

export function amazonUrl(opts: { asin?: string | null; query: string; tag?: string }): string {
  const tag = opts.tag ?? amazonTag();
  // Keyword search only. Prefixing a stale ASIN (we have had an SSD and a mixer
  // on this list) sends guests to the wrong item. Search never 404s.
  return amazonSearchUrl(opts.query.trim() || "home setup Palatka", tag);
}

/** Official Associates image endpoint — tagged, no Creators API required. */
export function amazonImageUrl(asin: string, tag = amazonTag()): string {
  const a = cleanAsin(asin);
  if (!a) return "";
  const u = new URL("https://ws-na.amazon-adsystem.com/widgets/q");
  u.searchParams.set("_encoding", "UTF8");
  u.searchParams.set("MarketPlace", "US");
  u.searchParams.set("ASIN", a);
  u.searchParams.set("ServiceVersion", "20070822");
  u.searchParams.set("ID", "AsinImage");
  u.searchParams.set("WS", "1");
  u.searchParams.set("Format", "_SL250_");
  if (tag) u.searchParams.set("tag", tag);
  return u.toString();
}

export function amazonImpressionPixel(asin: string, tag = amazonTag()): string {
  const a = cleanAsin(asin);
  if (!a) return "";
  const u = new URL("https://ir-na.amazon-adsystem.com/e/ir");
  if (tag) u.searchParams.set("t", tag);
  u.searchParams.set("language", "en_US");
  u.searchParams.set("l", "li3");
  u.searchParams.set("o", "1");
  u.searchParams.set("a", a);
  return u.toString();
}

export function creatorsCredentialsConfigured(): boolean {
  if (typeof process === "undefined") return false;
  return Boolean(
    process.env.AMAZON_CREDENTIAL_ID &&
      process.env.AMAZON_CREDENTIAL_SECRET &&
      amazonTag(),
  );
}
