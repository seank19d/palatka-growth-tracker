export function amazonTag(): string {
  if (typeof process === "undefined") return "";
  return (process.env.AMAZON_ASSOCIATE_TAG || process.env.VITE_AMAZON_ASSOCIATE_TAG || "").trim();
}

export function amazonUrl(opts: { asin?: string | null; query: string; tag?: string }): string {
  const tag = opts.tag ?? amazonTag();
  if (opts.asin) {
    const u = new URL(`https://www.amazon.com/dp/${opts.asin}`);
    if (tag) u.searchParams.set("tag", tag);
    return u.toString();
  }
  const u = new URL("https://www.amazon.com/s");
  u.searchParams.set("k", opts.query);
  if (tag) u.searchParams.set("tag", tag);
  return u.toString();
}
