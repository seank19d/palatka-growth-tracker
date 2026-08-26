export function amazonTag(): string {
  if (typeof process === "undefined") return "phr0dc-20";
  return (
    process.env.AMAZON_ASSOCIATE_TAG ||
    process.env.VITE_AMAZON_ASSOCIATE_TAG ||
    "phr0dc-20"
  ).trim();
}

export function amazonUrl(opts: { asin?: string | null; query: string; tag?: string }): string {
  const tag = opts.tag ?? amazonTag();
  if (opts.asin) {
    const u = new URL(`https://www.amazon.com/dp/${opts.asin}`);
    if (tag) u.searchParams.set("tag", tag);
    u.searchParams.set("linkCode", "ogi");
    u.searchParams.set("language", "en_US");
    u.searchParams.set("th", "1");
    u.searchParams.set("psc", "1");
    return u.toString();
  }
  const u = new URL("https://www.amazon.com/s");
  u.searchParams.set("k", opts.query);
  if (tag) u.searchParams.set("tag", tag);
  u.searchParams.set("linkCode", "ll2");
  return u.toString();
}

/** Official Associates image endpoint — tagged, no Creators API required. */
export function amazonImageUrl(asin: string, tag = amazonTag()): string {
  const u = new URL("https://ws-na.amazon-adsystem.com/widgets/q");
  u.searchParams.set("_encoding", "UTF8");
  u.searchParams.set("MarketPlace", "US");
  u.searchParams.set("ASIN", asin);
  u.searchParams.set("ServiceVersion", "20070822");
  u.searchParams.set("ID", "AsinImage");
  u.searchParams.set("WS", "1");
  u.searchParams.set("Format", "_SL250_");
  if (tag) u.searchParams.set("tag", tag);
  return u.toString();
}

export function amazonImpressionPixel(asin: string, tag = amazonTag()): string {
  const u = new URL("https://ir-na.amazon-adsystem.com/e/ir");
  if (tag) u.searchParams.set("t", tag);
  u.searchParams.set("language", "en_US");
  u.searchParams.set("l", "li3");
  u.searchParams.set("o", "1");
  u.searchParams.set("a", asin);
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
