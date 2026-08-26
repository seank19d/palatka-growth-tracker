import { getSql } from "@/lib/db";
import { SEED_GUIDES } from "./guides-catalog";
import {
  SEED_FAQS,
  SEED_MARKET,
  SEED_PRODUCTS,
  SEED_PROJECTS,
  SEED_SOURCES,
  SEED_UPDATES,
} from "./projects-catalog";

const globalRef = globalThis as typeof globalThis & {
  __pgtSeedPromise__?: Promise<void>;
};

export function ensureSeeded(): Promise<void> {
  globalRef.__pgtSeedPromise__ ??= seed().catch((err) => {
    globalRef.__pgtSeedPromise__ = undefined;
    throw err;
  });
  return globalRef.__pgtSeedPromise__;
}

async function seed(): Promise<void> {
  const sql = await getSql();
  const existing = await sql<{ n: number }>`select count(*)::int as n from projects`;
  if ((existing[0]?.n ?? 0) > 0) {
    await syncMissingCatalog(sql);
    return;
  }

  for (const p of SEED_PROJECTS) {
    await sql.query(
      `insert into projects (
        slug, name, location_label, area, lat, lng, status, acres,
        lots_current, lots_rezoning, units_note, commercial_sqft, builder, developer,
        county_case, ordinance, sjrwmd_file, official_links, latest_summary, latest_summary_at,
        confidence, published, featured
      ) values (
        $1,$2,$3,$4,$5,$6,$7,$8,
        $9,$10,$11,$12,$13,$14,
        $15,$16,$17,$18,$19,$20,
        $21,$22,$23
      )`,
      [
        p.slug,
        p.name,
        p.locationLabel,
        p.area,
        p.lat,
        p.lng,
        p.status,
        p.acres,
        p.lotsCurrent,
        p.lotsRezoning,
        p.unitsNote,
        p.commercialSqft,
        p.builder,
        p.developer,
        p.countyCase,
        p.ordinance,
        p.sjrwmdFile,
        JSON.stringify(p.officialLinks),
        p.latestSummary,
        p.latestSummaryAt,
        p.confidence,
        p.published,
        p.featured,
      ],
    );
  }

  const idRows = await sql<{ id: number; slug: string }>`select id, slug from projects`;
  const idBySlug = new Map(idRows.map((r) => [r.slug, r.id]));

  for (const p of SEED_PROJECTS) {
    const projectId = idBySlug.get(p.slug);
    if (!projectId) continue;
    p.milestones.forEach((m, i) => {
      void i;
    });
    for (let i = 0; i < p.milestones.length; i++) {
      const m = p.milestones[i];
      await sql.query(
        `insert into project_milestones (
          project_id, occurred_on, title, body, source_url, source_label, sort_order
        ) values ($1,$2,$3,$4,$5,$6,$7)`,
        [projectId, m.occurredOn, m.title, m.body, m.sourceUrl ?? null, m.sourceLabel ?? null, i],
      );
    }
  }

  for (const u of SEED_UPDATES) {
    const projectId = u.projectSlug ? (idBySlug.get(u.projectSlug) ?? null) : null;
    await sql.query(
      `insert into project_updates (project_id, title, body, kind, source_label, created_at)
       values ($1,$2,$3,$4,$5,$6)`,
      [projectId, u.title, u.body, u.kind, u.sourceLabel, u.createdAt],
    );
  }

  for (const s of SEED_SOURCES) {
    await sql.query(`insert into sources (name, url, kind) values ($1,$2,$3)`, [
      s.name,
      s.url,
      s.kind,
    ]);
  }

  for (const g of SEED_GUIDES) {
    await sql.query(
      `insert into guide_pages (
        slug, title, nav_label, excerpt, body, sort_order, last_refreshed_at, affiliate_category
      ) values ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        g.slug,
        g.title,
        g.navLabel,
        g.excerpt,
        JSON.stringify(g.sections),
        g.sortOrder,
        "2026-08-01T12:00:00.000Z",
        g.affiliateCategory,
      ],
    );
  }

  for (const f of SEED_FAQS) {
    await sql.query(
      `insert into faqs (question, answer, sort_order, generated) values ($1,$2,$3,false)`,
      [f.question, f.answer, f.sortOrder],
    );
  }

  for (const p of SEED_PRODUCTS) {
    await sql.query(
      `insert into affiliate_products (asin, title, category, blurb, search_query, sort_order)
       values ($1,$2,$3,$4,$5,$6)`,
      [p.asin, p.title, p.category, p.blurb, p.searchQuery, p.sortOrder],
    );
  }

  await sql.query(
    `insert into market_snapshots (
      captured_on, median_sale_low, median_sale_high, median_note, days_on_market, source_note
    ) values ($1,$2,$3,$4,$5,$6)`,
    [
      SEED_MARKET.capturedOn,
      SEED_MARKET.medianSaleLow,
      SEED_MARKET.medianSaleHigh,
      SEED_MARKET.medianNote,
      SEED_MARKET.daysOnMarket,
      SEED_MARKET.sourceNote,
    ],
  );

  await sql.query(`insert into site_settings (key, value) values ($1,$2)`, [
    "last_public_update",
    "2026-08-20T12:00:00.000Z",
  ]);

  await sql.query(
    `insert into job_runs (job_name, started_at, finished_at, status, summary)
     values ($1,$2,$3,$4,$5)`,
    [
      "seed",
      "2026-08-01T12:00:00.000Z",
      "2026-08-01T12:00:00.000Z",
      "ok",
      "Initial public-record seed: Alford Farms, The Collection at Palatka, the resident guide, and a market snapshot.",
    ],
  );
}

async function syncMissingCatalog(sql: Awaited<ReturnType<typeof getSql>>) {
  const have = await sql<{ slug: string }>`select slug from projects`;
  const slugs = new Set(have.map((r) => r.slug));
  for (const p of SEED_PROJECTS) {
    if (slugs.has(p.slug)) continue;
    await sql.query(
      `insert into projects (
        slug, name, location_label, area, lat, lng, status, acres,
        lots_current, lots_rezoning, units_note, commercial_sqft, builder, developer,
        county_case, ordinance, sjrwmd_file, official_links, latest_summary, latest_summary_at,
        confidence, published, featured
      ) values (
        $1,$2,$3,$4,$5,$6,$7,$8,
        $9,$10,$11,$12,$13,$14,
        $15,$16,$17,$18,$19,$20,
        $21,$22,$23
      )`,
      [
        p.slug,
        p.name,
        p.locationLabel,
        p.area,
        p.lat,
        p.lng,
        p.status,
        p.acres,
        p.lotsCurrent,
        p.lotsRezoning,
        p.unitsNote,
        p.commercialSqft,
        p.builder,
        p.developer,
        p.countyCase,
        p.ordinance,
        p.sjrwmdFile,
        JSON.stringify(p.officialLinks),
        p.latestSummary,
        p.latestSummaryAt,
        p.confidence,
        p.published,
        p.featured,
      ],
    );
    const idRows = await sql<{ id: number }>`select id from projects where slug = ${p.slug}`;
    const projectId = idRows[0]?.id;
    if (!projectId) continue;
    for (let i = 0; i < p.milestones.length; i++) {
      const m = p.milestones[i];
      await sql.query(
        `insert into project_milestones (
          project_id, occurred_on, title, body, source_url, source_label, sort_order
        ) values ($1,$2,$3,$4,$5,$6,$7)`,
        [projectId, m.occurredOn, m.title, m.body, m.sourceUrl ?? null, m.sourceLabel ?? null, i],
      );
    }
  }

  const idRows = await sql<{ id: number; slug: string }>`select id, slug from projects`;
  const idBySlug = new Map(idRows.map((r) => [r.slug, r.id]));

  const updateRows = await sql<{ title: string }>`select title from project_updates`;
  const titles = new Set(updateRows.map((r) => r.title));
  for (const u of SEED_UPDATES) {
    if (titles.has(u.title)) continue;
    const projectId = u.projectSlug ? (idBySlug.get(u.projectSlug) ?? null) : null;
    await sql.query(
      `insert into project_updates (project_id, title, body, kind, source_label, created_at)
       values ($1,$2,$3,$4,$5,$6)`,
      [projectId, u.title, u.body, u.kind, u.sourceLabel, u.createdAt],
    );
  }

  const faqRows = await sql<{ question: string }>`select question from faqs`;
  const questions = new Set(faqRows.map((r) => r.question));
  for (const f of SEED_FAQS) {
    if (questions.has(f.question)) {
      await sql.query(`update faqs set answer = $2, sort_order = $3 where question = $1`, [
        f.question,
        f.answer,
        f.sortOrder,
      ]);
      continue;
    }
    await sql.query(
      `insert into faqs (question, answer, sort_order, generated) values ($1,$2,$3,false)`,
      [f.question, f.answer, f.sortOrder],
    );
  }

  // Keep guide copy current (callouts, plain-language fixes).
  for (const g of SEED_GUIDES) {
    await sql.query(
      `update guide_pages
       set title = $2, nav_label = $3, excerpt = $4, body = $5, sort_order = $6,
           affiliate_category = $7, last_refreshed_at = $8
       where slug = $1`,
      [
        g.slug,
        g.title,
        g.navLabel,
        g.excerpt,
        JSON.stringify(g.sections),
        g.sortOrder,
        g.affiliateCategory,
        new Date().toISOString(),
      ],
    );
  }

  await sql.query(
    `update projects
     set latest_summary = replace(latest_summary, 'this tracker', 'this report'),
         units_note = replace(units_note, 'this tracker', 'this report')
     where coalesce(latest_summary, '') like '%this tracker%'
        or coalesce(units_note, '') like '%this tracker%'`,
  );
  await sql.query(
    `update project_updates
     set body = replace(body, 'this tracker', 'this report')
     where body like '%this tracker%'`,
  );

  await syncSources(sql);
}

async function syncSources(sql: Awaited<ReturnType<typeof getSql>>) {
  const have = await sql<{ id: number; name: string; url: string; kind: string; enabled: boolean }>`
    select id, name, url, kind, enabled from sources
  `;
  const byName = new Map(have.map((r) => [r.name, r]));
  for (const s of SEED_SOURCES) {
    const row = byName.get(s.name);
    if (!row) {
      await sql.query(`insert into sources (name, url, kind, enabled) values ($1,$2,$3,true)`, [
        s.name,
        s.url,
        s.kind,
      ]);
      continue;
    }
    if (row.url !== s.url || row.kind !== s.kind || !row.enabled) {
      await sql.query(
        `update sources set url = $2, kind = $3, last_error = null, enabled = true where id = $1`,
        [row.id, s.url, s.kind],
      );
    }
  }
}
