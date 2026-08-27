import { getSql } from "@/lib/db";
import { amazonImageUrl, amazonTag, amazonUrl, cleanAsin } from "@/lib/amazon";
import { parseJson } from "@/lib/format";
import { PIPELINE_STATUSES } from "@/lib/constants";
import type {
  AffiliateProduct,
  Confidence,
  Faq,
  GuidePage,
  GuideSection,
  JobRun,
  MarketSnapshot,
  Milestone,
  OfficialLink,
  Project,
  ProjectStatus,
  ProjectUpdate,
  SourceItem,
  SourceRow,
} from "@/lib/types";
import { ensureSeeded } from "./ensure-seeded.server";

type ProjectRow = {
  id: number;
  slug: string;
  name: string;
  location_label: string;
  area: string;
  lat: number | null;
  lng: number | null;
  status: string;
  acres: string | number | null;
  lots_current: number | null;
  lots_rezoning: number | null;
  units_note: string | null;
  commercial_sqft: number | null;
  builder: string | null;
  developer: string | null;
  county_case: string | null;
  ordinance: string | null;
  sjrwmd_file: string | null;
  official_links: string;
  latest_summary: string | null;
  latest_summary_at: string | null;
  confidence: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

function num(v: string | number | null | undefined): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    locationLabel: row.location_label,
    area: row.area,
    lat: row.lat,
    lng: row.lng,
    status: row.status as ProjectStatus,
    acres: num(row.acres),
    lotsCurrent: row.lots_current,
    lotsRezoning: row.lots_rezoning,
    unitsNote: row.units_note,
    commercialSqft: row.commercial_sqft,
    builder: row.builder,
    developer: row.developer,
    countyCase: row.county_case,
    ordinance: row.ordinance,
    sjrwmdFile: row.sjrwmd_file,
    officialLinks: parseJson<OfficialLink[]>(row.official_links, []),
    latestSummary: row.latest_summary,
    latestSummaryAt: row.latest_summary_at,
    confidence: row.confidence as Confidence,
    published: Boolean(row.published),
    featured: Boolean(row.featured),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function listPublishedProjects(): Promise<Project[]> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<ProjectRow>`
    select * from projects
    where published = true
    order by featured desc,
      case status
        when 'permitting' then 0
        when 'engineering' then 1
        when 'rezoning' then 2
        when 'under_construction' then 3
        when 'selling' then 4
        when 'plat_recorded' then 5
        when 'concept' then 6
        else 7
      end,
      name asc
  `;
  return rows.map(mapProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<ProjectRow>`
    select * from projects where slug = ${slug} and published = true limit 1
  `;
  return rows[0] ? mapProject(rows[0]) : null;
}

export async function getMilestones(projectId: number): Promise<Milestone[]> {
  const sql = await getSql();
  const rows = await sql<{
    id: number;
    project_id: number;
    occurred_on: string;
    title: string;
    body: string | null;
    source_url: string | null;
    source_label: string | null;
    sort_order: number;
  }>`
    select * from project_milestones
    where project_id = ${projectId}
    order by occurred_on asc, sort_order asc
  `;
  return rows.map((r) => ({
    id: r.id,
    projectId: r.project_id,
    occurredOn: String(r.occurred_on).slice(0, 10),
    title: r.title,
    body: r.body,
    sourceUrl: r.source_url,
    sourceLabel: r.source_label,
    sortOrder: r.sort_order,
  }));
}

export async function getUpdates(limit = 12, projectId?: number): Promise<ProjectUpdate[]> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = projectId
    ? await sql<{
        id: number;
        project_id: number | null;
        title: string;
        body: string;
        kind: string;
        source_label: string | null;
        created_at: string;
        project_name: string | null;
        project_slug: string | null;
      }>`
        select u.*, p.name as project_name, p.slug as project_slug
        from project_updates u
        left join projects p on p.id = u.project_id
        where u.project_id = ${projectId}
        order by u.created_at desc
        limit ${limit}
      `
    : await sql<{
        id: number;
        project_id: number | null;
        title: string;
        body: string;
        kind: string;
        source_label: string | null;
        created_at: string;
        project_name: string | null;
        project_slug: string | null;
      }>`
        select u.*, p.name as project_name, p.slug as project_slug
        from project_updates u
        left join projects p on p.id = u.project_id
        order by u.created_at desc
        limit ${limit}
      `;
  return rows.map((r) => ({
    id: r.id,
    projectId: r.project_id,
    projectName: r.project_name,
    projectSlug: r.project_slug,
    title: r.title,
    body: r.body,
    kind: r.kind,
    sourceLabel: r.source_label,
    createdAt: String(r.created_at),
  }));
}

export async function listGuides(): Promise<
  Pick<GuidePage, "slug" | "title" | "navLabel" | "excerpt" | "sortOrder" | "affiliateCategory">[]
> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<{
    slug: string;
    title: string;
    nav_label: string;
    excerpt: string;
    sort_order: number;
    affiliate_category: string | null;
  }>`select slug, title, nav_label, excerpt, sort_order, affiliate_category from guide_pages order by sort_order`;
  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    navLabel: r.nav_label,
    excerpt: r.excerpt,
    sortOrder: r.sort_order,
    affiliateCategory: r.affiliate_category,
  }));
}

export async function getGuide(slug: string): Promise<GuidePage | null> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<{
    slug: string;
    title: string;
    nav_label: string;
    excerpt: string;
    body: string;
    sort_order: number;
    last_refreshed_at: string | null;
    affiliate_category: string | null;
  }>`select * from guide_pages where slug = ${slug} limit 1`;
  const r = rows[0];
  if (!r) return null;
  return {
    slug: r.slug,
    title: r.title,
    navLabel: r.nav_label,
    excerpt: r.excerpt,
    sortOrder: r.sort_order,
    lastRefreshedAt: r.last_refreshed_at ? String(r.last_refreshed_at) : null,
    affiliateCategory: r.affiliate_category,
    sections: parseJson<GuideSection[]>(r.body, []),
  };
}

export async function listFaqs(): Promise<Faq[]> {
  await ensureSeeded();
  const sql = await getSql();
  const raw = await sql<{
    id: number;
    question: string;
    answer: string;
    sort_order: number;
    generated: boolean;
  }>`select id, question, answer, sort_order, generated from faqs order by sort_order`;
  return raw.map((r) => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
    sortOrder: r.sort_order,
    generated: Boolean(r.generated),
  }));
}

export async function getProducts(category?: string | null): Promise<AffiliateProduct[]> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = category
    ? await sql<{
        id: number;
        asin: string | null;
        title: string;
        category: string;
        blurb: string;
        search_query: string;
        image_url: string | null;
        price_label: string | null;
        sort_order: number;
      }>`select id, asin, title, category, blurb, search_query, image_url, price_label, sort_order from affiliate_products where category = ${category} order by sort_order`
    : await sql<{
        id: number;
        asin: string | null;
        title: string;
        category: string;
        blurb: string;
        search_query: string;
        image_url: string | null;
        price_label: string | null;
        sort_order: number;
      }>`select id, asin, title, category, blurb, search_query, image_url, price_label, sort_order from affiliate_products order by sort_order`;
  return rows.map((r) => {
    const asin = cleanAsin(r.asin);
    return {
      id: r.id,
      asin: r.asin,
      title: r.title,
      category: r.category,
      blurb: r.blurb,
      searchQuery: r.search_query,
      url: amazonUrl({ asin, query: r.search_query }),
      imageUrl: r.image_url || (asin ? amazonImageUrl(asin) : null),
      priceLabel: r.price_label,
      sortOrder: r.sort_order,
    };
  });
}

export async function latestMarket(): Promise<MarketSnapshot | null> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<{
    id: number;
    captured_on: string;
    median_sale_low: number | null;
    median_sale_high: number | null;
    median_note: string;
    days_on_market: number | null;
    source_note: string;
  }>`select * from market_snapshots order by captured_on desc limit 1`;
  const r = rows[0];
  if (!r) return null;
  return {
    id: r.id,
    capturedOn: String(r.captured_on).slice(0, 10),
    medianSaleLow: r.median_sale_low,
    medianSaleHigh: r.median_sale_high,
    medianNote: r.median_note,
    daysOnMarket: r.days_on_market,
    sourceNote: r.source_note,
  };
}

export async function getSetting(key: string): Promise<string | null> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<{ value: string }>`select value from site_settings where key = ${key}`;
  return rows[0]?.value ?? null;
}

export async function getLastPublicUpdate(): Promise<string | null> {
  await ensureSeeded();
  const sql = await getSql();
  const [setting, updates, summaries] = await Promise.all([
    sql<{ value: string }>`select value from site_settings where key = 'last_public_update'`,
    sql<{ d: string | null }>`select max(created_at)::text as d from project_updates`,
    sql<{ d: string | null }>`select max(latest_summary_at)::text as d from projects where published = true`,
  ]);
  const dates = [setting[0]?.value, updates[0]?.d, summaries[0]?.d].filter(
    (v): v is string => Boolean(v),
  );
  if (!dates.length) return null;
  dates.sort();
  return dates[dates.length - 1];
}

const HOME_FAQ_QUESTIONS = [
  "Are there new construction homes for sale in Palatka right now?",
  "Is Alford Farms selling homes yet?",
  "Where is East Palatka relative to Palatka?",
  "Will I have city water and sewer?",
];

export async function getHomeData() {
  const [projects, updates, guides, market, lastUpdated, faqs, products] = await Promise.all([
    listPublishedProjects(),
    getUpdates(6),
    listGuides(),
    latestMarket(),
    getLastPublicUpdate(),
    listFaqs(),
    getProducts(),
  ]);
  const featured = projects.find((p) => p.featured) ?? projects[0] ?? null;
  const pipeline = projects.filter((p) => PIPELINE_STATUSES.includes(p.status));
  const lots = pipeline.reduce((sum, p) => sum + (p.lotsCurrent ?? 0), 0);
  const homeFaqs = HOME_FAQ_QUESTIONS.map((q) => faqs.find((f) => f.question === q)).filter(
    (f): f is Faq => Boolean(f),
  );
  const faqFill = faqs.filter((f) => !homeFaqs.some((h) => h.id === f.id));
  return {
    projects,
    featured,
    updates,
    guides,
    market,
    lastUpdated,
    faqs: [...homeFaqs, ...faqFill].slice(0, 4),
    products: products.filter((p) => p.sortOrder <= 5).slice(0, 5),
    stats: {
      projectCount: projects.length,
      pipelineCount: pipeline.length,
      lotsPipeline: lots,
    },
  };
}

export async function getAdminData() {
  await ensureSeeded();
  const sql = await getSql();
  const projects = await sql<ProjectRow>`select * from projects order by name`;
  const sources = await sql<{
    id: number;
    name: string;
    url: string;
    kind: string;
    enabled: boolean;
    last_checked_at: string | null;
    last_success_at: string | null;
    last_error: string | null;
  }>`select * from sources order by id`;
  const jobs = await sql<{
    id: number;
    job_name: string;
    started_at: string;
    finished_at: string | null;
    status: string;
    summary: string | null;
    error: string | null;
  }>`select * from job_runs order by started_at desc limit 20`;
  const items = await sql<{
    id: number;
    title: string;
    url: string | null;
    snippet: string | null;
    published_at: string | null;
    is_new_project_candidate: boolean;
    created_at: string;
    source_name: string | null;
    matched_name: string | null;
  }>`
    select i.id, i.title, i.url, i.snippet, i.published_at, i.is_new_project_candidate,
           i.created_at, s.name as source_name, p.name as matched_name
    from source_items i
    left join sources s on s.id = i.source_id
    left join projects p on p.id = i.matched_project_id
    order by i.created_at desc
    limit 30
  `;
  return {
    projects: projects.map(mapProject),
    sources: sources.map(
      (s): SourceRow => ({
        id: s.id,
        name: s.name,
        url: s.url,
        kind: s.kind,
        enabled: Boolean(s.enabled),
        lastCheckedAt: s.last_checked_at ? String(s.last_checked_at) : null,
        lastSuccessAt: s.last_success_at ? String(s.last_success_at) : null,
        lastError: s.last_error,
      }),
    ),
    jobs: jobs.map(
      (j): JobRun => ({
        id: j.id,
        jobName: j.job_name,
        startedAt: String(j.started_at),
        finishedAt: j.finished_at ? String(j.finished_at) : null,
        status: j.status,
        summary: j.summary,
        error: j.error,
      }),
    ),
    items: items.map(
      (i): SourceItem => ({
        id: i.id,
        sourceName: i.source_name,
        title: i.title,
        url: i.url,
        snippet: i.snippet,
        publishedAt: i.published_at ? String(i.published_at) : null,
        matchedProjectName: i.matched_name,
        isNewProjectCandidate: Boolean(i.is_new_project_candidate),
        createdAt: String(i.created_at),
      }),
    ),
    aiAvailable: Boolean(process.env.XAI_API_KEY),
    amazonTag: amazonTag(),
    amazonApi: Boolean(process.env.AMAZON_CREDENTIAL_ID && process.env.AMAZON_CREDENTIAL_SECRET),
    affiliate: await getAffiliateDesk(sql),
  };
}

async function getAffiliateDesk(sql: Awaited<ReturnType<typeof getSql>>) {
  const products = await sql<{
    id: number;
    asin: string | null;
    title: string;
    category: string;
    last_synced_at: string | null;
    clicks_30: number;
    clicks_all: number;
  }>`
    select p.id, p.asin, p.title, p.category, p.last_synced_at,
           coalesce((select count(*)::int from affiliate_clicks c where c.product_id = p.id and c.created_at > now() - interval '30 days'), 0) as clicks_30,
           coalesce((select count(*)::int from affiliate_clicks c where c.product_id = p.id), 0) as clicks_all
    from affiliate_products p
    order by p.sort_order
  `;
  const orders = await sql<{
    id: number;
    ordered_on: string;
    items: number;
    commission_cents: number | null;
    note: string | null;
    title: string | null;
  }>`
    select o.id, o.ordered_on, o.items, o.commission_cents, o.note, p.title
    from affiliate_orders o
    left join affiliate_products p on p.id = o.product_id
    order by o.ordered_on desc, o.id desc
    limit 20
  `;
  const clickTotal = await sql<{ n: number }>`
    select count(*)::int as n from affiliate_clicks where created_at > now() - interval '30 days'
  `;
  const commission = await sql<{ n: number | null }>`
    select coalesce(sum(commission_cents), 0)::int as n from affiliate_orders
  `;
  return {
    products: products.map((p) => ({
      id: p.id,
      asin: p.asin,
      title: p.title,
      category: p.category,
      lastSyncedAt: p.last_synced_at ? String(p.last_synced_at) : null,
      clicks30: p.clicks_30,
      clicksAll: p.clicks_all,
    })),
    orders: orders.map((o) => ({
      id: o.id,
      orderedOn: String(o.ordered_on).slice(0, 10),
      items: o.items,
      commissionCents: o.commission_cents,
      note: o.note,
      title: o.title,
    })),
    clicks30: clickTotal[0]?.n ?? 0,
    commissionCents: commission[0]?.n ?? 0,
  };
}

export async function getSitemapEntries(): Promise<{
  lastPublic: string | null;
  projects: { slug: string; updatedAt: string | null }[];
  guides: { slug: string; updatedAt: string | null }[];
}> {
  await ensureSeeded();
  const sql = await getSql();
  const [lastPublic, projects, guides] = await Promise.all([
    getLastPublicUpdate(),
    sql<{ slug: string; updated_at: string | null }>`
      select slug, coalesce(updated_at, latest_summary_at)::text as updated_at
      from projects where published = true
    `,
    sql<{ slug: string; last_refreshed_at: string | null }>`
      select slug, last_refreshed_at::text as last_refreshed_at from guide_pages
    `,
  ]);
  return {
    lastPublic,
    projects: projects.map((p) => ({ slug: p.slug, updatedAt: p.updated_at })),
    guides: guides.map((g) => ({ slug: g.slug, updatedAt: g.last_refreshed_at })),
  };
}

export async function listAllProjectSlugs(): Promise<string[]> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<{ slug: string }>`select slug from projects where published = true`;
  return rows.map((r) => r.slug);
}
