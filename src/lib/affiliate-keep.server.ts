import { SEED_PRODUCTS } from "@/lib/data/seed-extras";
import { amazonTag, amazonUrl, cleanAsin } from "@/lib/amazon";
import { getSql, type Sql } from "@/lib/db";
import { ensureSeeded, syncAffiliateProducts } from "@/lib/data/ensure-seeded.server";

export async function ensureAffiliateKeepSchema(sql: Sql) {
  await sql.query(`alter table affiliate_products add column if not exists status text not null default 'ok'`);
  await sql.query(`alter table affiliate_products add column if not exists last_checked_at timestamptz`);
  await sql.query(`alter table affiliate_products add column if not exists check_note text`);
}

export type AffiliateKeepResult = {
  ok: boolean;
  checked: number;
  okCount: number;
  issues: string[];
  amazon: string;
  summary: string;
};

function queryOk(q: string): boolean {
  return q.trim().split(/\s+/).filter(Boolean).length >= 3;
}

function linkOk(url: string, tag: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === "www.amazon.com" && u.pathname === "/s" && u.searchParams.get("tag") === tag;
  } catch {
    return false;
  }
}

export async function keepAffiliateCatalog(): Promise<AffiliateKeepResult> {
  await ensureSeeded();
  await syncAffiliateProducts();
  const sql = await getSql();
  await ensureAffiliateKeepSchema(sql);
  const tag = amazonTag();
  const rows = await sql<{
    id: number;
    asin: string | null;
    title: string;
    search_query: string;
  }>`select id, asin, title, search_query from affiliate_products order by sort_order`;

  const have = new Set(rows.map((r) => r.title));
  const issues: string[] = [];

  for (const seed of SEED_PRODUCTS) {
    if (!have.has(seed.title)) issues.push(`Missing kit item: ${seed.title}`);
  }

  let okCount = 0;
  for (const r of rows) {
    const notes: string[] = [];
    const url = amazonUrl({ asin: r.asin, query: r.search_query });
    if (!queryOk(r.search_query)) notes.push("search query too thin");
    if (!linkOk(url, tag)) notes.push("tagged search URL failed");
    if (r.asin && !cleanAsin(r.asin)) notes.push("ASIN is not a 10-character code");
    if (!SEED_PRODUCTS.some((s) => s.title === r.title)) notes.push("not in the seed catalog");

    const status = notes.length ? "watch" : "ok";
    if (status === "ok") okCount += 1;
    else issues.push(`${r.title}: ${notes.join("; ")}`);

    await sql.query(
      `update affiliate_products
       set status = $2, last_checked_at = now(), check_note = $3
       where id = $1`,
      [r.id, status, notes.join("; ") || null],
    );
  }

  let amazon = "Creators API not connected — prices stay as last known";
  try {
    const { creatorsReady, refreshCatalogFromAmazon } = await import("@/lib/amazon-creators.server");
    if (creatorsReady()) {
      const r = await refreshCatalogFromAmazon();
      amazon = r.ok ? `Amazon prices refreshed (${r.updated})` : `Amazon: ${r.error}`;
    }
  } catch (err) {
    amazon = err instanceof Error ? err.message : "Amazon refresh failed";
  }

  const ok = issues.length === 0;
  const summary = `Kit ${rows.length} items, ${okCount} healthy, ${issues.length} issue${issues.length === 1 ? "" : "s"}. Tag ${tag}. ${amazon}.`;

  await sql.query(
    `insert into job_runs (job_name, started_at, finished_at, status, summary, error)
     values ('affiliate-keep', now(), now(), $1, $2, $3)`,
    [ok ? "ok" : "ok", summary, issues.length ? issues.slice(0, 8).join(" · ") : null],
  );
  await sql.query(
    `insert into site_settings (key, value) values ('affiliate_last_keep', now()::text)
     on conflict (key) do update set value = excluded.value`,
  );
  await sql.query(
    `insert into site_settings (key, value) values ('affiliate_keep_summary', $1)
     on conflict (key) do update set value = excluded.value`,
    [summary],
  );

  return { ok, checked: rows.length, okCount, issues, amazon, summary };
}
