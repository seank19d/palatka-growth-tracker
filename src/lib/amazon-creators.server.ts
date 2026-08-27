import { amazonTag } from "./amazon";

type TokenCache = { token: string; exp: number; header: string };
let tokenCache: TokenCache | null = null;

function creds() {
  return {
    id: (process.env.AMAZON_CREDENTIAL_ID ?? "").trim(),
    secret: (process.env.AMAZON_CREDENTIAL_SECRET ?? "").trim(),
    version: (process.env.AMAZON_CREDENTIAL_VERSION ?? "3.1").trim(),
    tag: amazonTag(),
  };
}

export function creatorsReady(): boolean {
  const c = creds();
  return Boolean(c.id && c.secret && c.tag);
}

function tokenEndpoint(version: string): { url: string; scope: string; basic: boolean; versionOnBearer: boolean } {
  if (version.startsWith("2.1")) {
    return {
      url: "https://creatorsapi.auth.us-east-1.amazoncognito.com/oauth2/token",
      scope: "creatorsapi/default",
      basic: true,
      versionOnBearer: true,
    };
  }
  if (version.startsWith("2.2")) {
    return {
      url: "https://creatorsapi.auth.eu-south-2.amazoncognito.com/oauth2/token",
      scope: "creatorsapi/default",
      basic: true,
      versionOnBearer: true,
    };
  }
  if (version.startsWith("2.")) {
    return {
      url: "https://creatorsapi.auth.us-west-2.amazoncognito.com/oauth2/token",
      scope: "creatorsapi/default",
      basic: true,
      versionOnBearer: true,
    };
  }
  return {
    url: "https://api.amazon.com/auth/o2/token",
    scope: "creatorsapi::default",
    basic: false,
    versionOnBearer: false,
  };
}

async function accessToken(): Promise<{ token: string; header: string }> {
  const now = Date.now();
  if (tokenCache && tokenCache.exp > now + 30_000) {
    return { token: tokenCache.token, header: tokenCache.header };
  }
  const c = creds();
  if (!c.id || !c.secret) throw new Error("Amazon Creators API credentials are not set.");
  const ep = tokenEndpoint(c.version);
  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const body = new URLSearchParams({ grant_type: "client_credentials", scope: ep.scope });
  if (ep.basic) {
    headers.Authorization = `Basic ${Buffer.from(`${c.id}:${c.secret}`).toString("base64")}`;
  } else {
    body.set("client_id", c.id);
    body.set("client_secret", c.secret);
  }
  const res = await fetch(ep.url, { method: "POST", headers, body });
  const json = (await res.json()) as { access_token?: string; expires_in?: number; error?: string };
  if (!res.ok || !json.access_token) {
    throw new Error(json.error || `Amazon token HTTP ${res.status}`);
  }
  const header = ep.versionOnBearer
    ? `Bearer ${json.access_token}, Version ${c.version}`
    : `Bearer ${json.access_token}`;
  tokenCache = {
    token: json.access_token,
    header,
    exp: now + Math.max(60, Number(json.expires_in ?? 3600)) * 1000,
  };
  return { token: json.access_token, header };
}

export type AmazonItem = {
  asin: string;
  title: string | null;
  imageUrl: string | null;
  priceLabel: string | null;
};

export async function getAmazonItems(asins: string[]): Promise<AmazonItem[]> {
  const ids = asins.filter(Boolean).slice(0, 10);
  if (!ids.length) return [];
  const { header } = await accessToken();
  const tag = amazonTag();
  const res = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", {
    method: "POST",
    headers: {
      Authorization: header,
      "Content-Type": "application/json",
      "x-marketplace": "www.amazon.com",
    },
    body: JSON.stringify({
      itemIds: ids,
      itemIdType: "ASIN",
      marketplace: "www.amazon.com",
      partnerTag: tag,
      resources: [
        "itemInfo.title",
        "images.primary.large",
        "images.primary.medium",
        "offersV2.listings.price",
      ],
    }),
  });
  const json = (await res.json()) as {
    itemsResult?: {
      items?: Array<{
        asin?: string;
        itemInfo?: { title?: { displayValue?: string } };
        images?: { primary?: { large?: { url?: string }; medium?: { url?: string } } };
        offersV2?: { listings?: Array<{ price?: { displayAmount?: string } }> };
      }>;
    };
    message?: string;
    errors?: Array<{ message?: string }>;
  };
  if (!res.ok) {
    throw new Error(json.message || json.errors?.[0]?.message || `Amazon GetItems HTTP ${res.status}`);
  }
  return (json.itemsResult?.items ?? []).map((item) => ({
    asin: item.asin ?? "",
    title: item.itemInfo?.title?.displayValue ?? null,
    imageUrl: item.images?.primary?.large?.url ?? item.images?.primary?.medium?.url ?? null,
    priceLabel: item.offersV2?.listings?.[0]?.price?.displayAmount ?? null,
  }));
}

export async function refreshCatalogFromAmazon(): Promise<{ ok: boolean; updated: number; error?: string }> {
  if (!creatorsReady()) {
    return { ok: false, updated: 0, error: "Creators API credentials are not set." };
  }
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<{ id: number; asin: string | null }>`
    select id, asin from affiliate_products where asin is not null and asin <> ''
  `;
  const asins = rows.map((r) => r.asin).filter((a): a is string => Boolean(a));
  if (!asins.length) return { ok: true, updated: 0 };
  try {
    const items = await getAmazonItems(asins);
    const byAsin = new Map(items.map((i) => [i.asin, i]));
    let updated = 0;
    for (const row of rows) {
      if (!row.asin) continue;
      const item = byAsin.get(row.asin);
      if (!item) continue;
      await sql.query(
        `update affiliate_products
         set price_label = coalesce($2, price_label),
             last_synced_at = now()
         where id = $1`,
        [row.id, item.priceLabel],
      );
      updated += 1;
    }
    return { ok: true, updated };
  } catch (err) {
    return { ok: false, updated: 0, error: err instanceof Error ? err.message : "Amazon refresh failed" };
  }
}
