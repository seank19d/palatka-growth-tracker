import * as cheerio from "cheerio";
import { dbSource, getSql } from "@/lib/db";
import { ensureSeeded } from "@/lib/data/ensure-seeded.server";
import { STATUS_RANK, inferStatus } from "@/lib/automation/status-infer";
import { isHousingItem, matchProject } from "@/lib/automation/match";

const UA =
  "Mozilla/5.0 (compatible; PalatkaHomesReport/1.1; +https://www.palatkahomesreport.com/about)";

type SourceRow = {
  id: number;
  name: string;
  url: string;
  kind: string;
  enabled: boolean;
};

type ProjectLite = { id: number; slug: string; name: string; status: string };

const NEW_PROJECT_HINT =
  /\b(subdivision|pud|rezoning|planned unit|new homes|new construction|plat)\b/i;

const AUTO_LABEL = "Automated digest";

async function fetchText(
  url: string,
  timeoutMs = 10000,
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "User-Agent": UA,
        Accept: "application/rss+xml, application/xml, text/xml, text/html;q=0.9, */*;q=0.8",
      },
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const text = await res.text();
    return { ok: true, text };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "fetch failed" };
  } finally {
    clearTimeout(t);
  }
}

function parseRss(xml: string): { title: string; url: string; snippet: string; publishedAt: string | null }[] {
  const $ = cheerio.load(xml, { xml: true });
  const items: { title: string; url: string; snippet: string; publishedAt: string | null }[] = [];
  $("item").each((_, el) => {
    const title = $(el).find("title").first().text().replace(/<!\[CDATA\[|\]\]>/g, "").trim();
    const url = ($(el).find("link").first().text() || $(el).find("guid").first().text()).trim();
    const snippet = $(el).find("description").first().text().replace(/<[^>]+>/g, "").trim().slice(0, 400);
    const pub = $(el).find("pubDate").first().text().trim();
    const publishedAt = pub && !Number.isNaN(Date.parse(pub)) ? new Date(pub).toISOString() : null;
    if (title && url) items.push({ title, url, snippet, publishedAt });
  });
  if (items.length === 0) {
    $("entry").each((_, el) => {
      const title = $(el).find("title").first().text().trim();
      const url = $(el).find("link").attr("href") || "";
      const snippet = $(el).find("summary, content").first().text().replace(/<[^>]+>/g, "").trim().slice(0, 400);
      if (title) items.push({ title, url, snippet, publishedAt: null });
    });
  }
  return items.slice(0, 20);
}

function parseHtmlHeadlines(
  html: string,
  baseUrl: string,
): { title: string; url: string; snippet: string; publishedAt: string | null }[] {
  const $ = cheerio.load(html);
  const seen = new Set<string>();
  const items: { title: string; url: string; snippet: string; publishedAt: string | null }[] = [];
  $("a").each((_, el) => {
    const title = $(el).text().replace(/\s+/g, " ").trim();
    const href = $(el).attr("href");
    if (!href || title.length < 24 || title.length > 160) return;
    if (!NEW_PROJECT_HINT.test(title) && !/palatka|putnam|zoning|commission|permit/i.test(title)) return;
    try {
      const url = new URL(href, baseUrl).toString();
      if (seen.has(url)) return;
      seen.add(url);
      items.push({ title, url, snippet: "", publishedAt: null });
    } catch {
      /* ignore */
    }
  });
  return items.slice(0, 8);
}

async function chatComplete(prompt: string): Promise<string | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 22000);
  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 420,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You write brief public updates for Palatka Homes Report, an independent civic housing site. Voice: service journalism — a local reporter who has read the file. Plain language, specific, dated. No hype, no jokes, no exclamation points, no emojis. Distinguish confirmed public records from news reports. Name dates and case numbers when present. If nothing material changed, say so in two sentences. Never mention AI, models, or automation.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return body.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function fallbackDigest(
  rows: { title: string; slug: string | null; name: string | null }[],
): string {
  const checked = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
  const titles = rows
    .slice(0, 6)
    .map((r) => r.title.replace(/\s+-\s+[^-]+$/, "").trim())
    .filter(Boolean);
  const list = titles.map((t) => `• ${t}`).join("\n");
  const matched = rows.find((r) => r.name);
  const closer = matched
    ? `One or more items mention ${matched.name}. That is a news or agency mention, not automatically a change in the county file.`
    : "None of these, on their face, change Alford Farms permit status or confirm a new subdivision ordinance.";
  return `Public sources were checked on ${checked}. Recent Palatka-area housing or land-use mentions:\n${list}\n\n${closer}`;
}

async function maybeAlert(message: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ALERT_EMAIL;
  if (!key || !to) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Palatka Homes Report <onboarding@resend.dev>",
        to: [to],
        subject: "Palatka Homes Report job needs a look",
        text: message,
      }),
    });
  } catch {
    /* ignore alert failures */
  }
}

async function publishDigests(
  sql: Awaited<ReturnType<typeof getSql>>,
  projects: ProjectLite[],
): Promise<number> {
  const idBySlug = new Map(projects.map((p) => [p.slug, p]));
  const recent = await sql<{
    title: string;
    snippet: string | null;
    url: string | null;
    slug: string | null;
    name: string | null;
    created_at: string;
  }>`
    select i.title, i.snippet, i.url, p.slug, p.name, i.created_at::text as created_at
    from source_items i
    left join projects p on p.id = i.matched_project_id
    where i.created_at > now() - interval '5 days'
    order by i.created_at desc
    limit 40
  `;
  const lastAuto = await sql<{ d: string | null }>`
    select max(created_at)::text as d from project_updates where source_label = ${AUTO_LABEL}
  `;
  const cutoff = lastAuto[0]?.d ? new Date(lastAuto[0].d).getTime() : 0;
  const pending = recent.filter((row) => {
    if (new Date(row.created_at).getTime() <= cutoff) return false;
    return isHousingItem(row.title, row.snippet ?? "");
  });
  if (!pending.length) return 0;

  let summarized = 0;
  const bySlug = new Map<string, typeof pending>();
  for (const row of pending) {
    const key = row.slug ?? "_general";
    const list = bySlug.get(key) ?? [];
    list.push(row);
    bySlug.set(key, list);
  }

  for (const [slug, rows] of bySlug) {
    const headlines = rows
      .map((r) => `- ${r.title}${r.snippet ? ` — ${r.snippet.slice(0, 160)}` : ""}`)
      .join("\n");
    if (slug === "_general") {
      const text =
        (await chatComplete(
          `New headlines from Putnam / Palatka sources that did not match a known project:\n${headlines}\n\nWrite a 3-sentence What's New blurb. If a new subdivision name appears, flag it plainly. If this is only background housing news (HUD, shelters, national policy), say that it does not change the subdivision file.`,
        )) ?? fallbackDigest(rows);
      await sql.query(
        `insert into project_updates (project_id, title, body, kind, source_label)
         values (null, $1, $2, 'whats_new', $3)`,
        ["From Palatka housing sources", text, AUTO_LABEL],
      );
      summarized += 1;
      continue;
    }
    const project = idBySlug.get(slug);
    if (!project) continue;
    const current = await sql<{ latest_summary: string | null }>`
      select latest_summary from projects where id = ${project.id}
    `;
    const text =
      (await chatComplete(
        `Project: ${project.name} (${slug}). Current summary:\n${current[0]?.latest_summary ?? "(none)"}\n\nNew items:\n${headlines}\n\nWrite an updated latest-summary (120-180 words) for the public project page. If the items do not actually change status, keep the prior facts and note the mention.`,
      )) ?? fallbackDigest(rows);
    await sql.query(
      `update projects set latest_summary = $1, latest_summary_at = now(), updated_at = now() where id = $2`,
      [text, project.id],
    );
    await sql.query(
      `insert into project_updates (project_id, title, body, kind, source_label)
       values ($1,$2,$3,'whats_new',$4)`,
      [project.id, `Update: ${project.name}`, text, AUTO_LABEL],
    );
    summarized += 1;
  }
  return summarized;
}

/** Fire-and-forget: if the daily job is stale, start a new serverless invocation. */
export function kickStaleTrackerUpdate(): void {
  if (dbSource !== "neon") return;
  void (async () => {
    try {
      const sql = await getSql();
      const rows = await sql<{ started_at: string; status: string }>`
        select started_at::text as started_at, status
        from job_runs
        where job_name = 'tracker-update'
        order by started_at desc
        limit 1
      `;
      const last = rows[0];
      if (last) {
        const age = Date.now() - new Date(last.started_at).getTime();
        if (last.status === "running" && age < 25 * 60 * 1000) return;
        if (last.status !== "running" && age < 18 * 60 * 60 * 1000) return;
      }
      const raw =
        process.env.VERCEL_PROJECT_PRODUCTION_URL ||
        process.env.VERCEL_URL ||
        "www.palatkahomesreport.com";
      const host = raw.replace(/^https?:\/\//, "");
      await fetch(`https://${host}/api/cron/update`, {
        headers: { "x-vercel-cron": "1" },
      });
    } catch {
      /* kick is best-effort */
    }
  })();
}

export async function runTrackerUpdate(): Promise<{ ok: boolean; summary: string }> {
  await ensureSeeded();
  const sql = await getSql();

  const running = await sql<{ id: number }>`
    select id from job_runs
    where job_name = 'tracker-update'
      and status = 'running'
      and started_at > now() - interval '20 minutes'
  `;
  if (running.length) {
    return { ok: true, summary: "A source check is already running." };
  }

  const inserted = await sql<{ id: number }>`
    insert into job_runs (job_name, status) values ('tracker-update', 'running') returning id
  `;
  const jobId = inserted[0]?.id;
  const errors: string[] = [];
  let newItems = 0;
  let summarized = 0;
  const ai = Boolean(process.env.XAI_API_KEY);

  try {
    await sql.query(`
      delete from project_updates
      where source_label = 'Automated digest'
        and (
          body ilike '%volleyball%'
          or body ilike '%prep football%'
          or body ilike '%police chief%'
          or body ilike '%direct deposit%'
        )
    `);
    await sql.query(
      `update projects
       set latest_summary = $1, latest_summary_at = now()
       where slug = 'interlachen-lakes' and latest_summary ilike '%volleyball%'`,
      [
        "Interlachen-area lakes development is on file as existing-market context, not a current Palatka or East Palatka sale.",
      ],
    );

    const sources = await sql<SourceRow>`select id, name, url, kind, enabled from sources where enabled = true`;
    const projects = await sql<ProjectLite>`select id, slug, name, status from projects`;

    for (const source of sources) {
      await sql.query(`update sources set last_checked_at = now() where id = $1`, [source.id]);
      const fetched = await fetchText(source.url);
      if (!fetched.ok) {
        await sql.query(`update sources set last_error = $1 where id = $2`, [fetched.error, source.id]);
        errors.push(`${source.name}: ${fetched.error}`);
        continue;
      }
      const parsed =
        source.kind === "rss" ? parseRss(fetched.text) : parseHtmlHeadlines(fetched.text, source.url);
      await sql.query(`update sources set last_success_at = now(), last_error = null where id = $1`, [
        source.id,
      ]);

      for (const item of parsed) {
        const hay = `${item.title} ${item.snippet}`;
        const matched = matchProject(hay, projects);
        const housing = isHousingItem(item.title, item.snippet);
        const candidate =
          !matched && NEW_PROJECT_HINT.test(item.title) && /palatka|putnam|east palatka/i.test(item.title);
        if (!matched && !housing && !candidate) continue;

        try {
          const res = await sql.query<{ id: number }>(
            `insert into source_items (
              source_id, title, url, snippet, published_at, matched_project_id, is_new_project_candidate
            ) values ($1,$2,$3,$4,$5,$6,$7)
            on conflict do nothing
            returning id`,
            [
              source.id,
              item.title.slice(0, 300),
              item.url || null,
              item.snippet || null,
              item.publishedAt,
              matched?.id ?? null,
              candidate,
            ],
          );
          if (res[0]?.id) newItems += 1;
        } catch {
          const exists = item.url
            ? await sql`select id from source_items where url = ${item.url} limit 1`
            : [];
          if (exists.length === 0) {
            await sql.query(
              `insert into source_items (
                source_id, title, url, snippet, published_at, matched_project_id, is_new_project_candidate
              ) values ($1,$2,$3,$4,$5,$6,$7)`,
              [
                source.id,
                item.title.slice(0, 300),
                item.url || null,
                item.snippet || null,
                item.publishedAt,
                matched?.id ?? null,
                candidate,
              ],
            );
            newItems += 1;
          }
        }

        if (matched) {
          const inferred = inferStatus(hay);
          if (inferred) {
            const currentRank = STATUS_RANK[matched.status] ?? 0;
            const nextRank = STATUS_RANK[inferred] ?? 0;
            if (nextRank > currentRank) {
              await sql.query(`update projects set status = $1, updated_at = now() where id = $2`, [
                inferred,
                matched.id,
              ]);
              matched.status = inferred;
            }
          }
        }
      }
    }

    summarized = await publishDigests(sql, projects);

    const candidates = await sql<{ id: number; title: string; url: string | null; snippet: string | null }>`
      select id, title, url, snippet from source_items
      where is_new_project_candidate = true
        and matched_project_id is null
        and created_at > now() - interval '14 days'
      order by created_at desc
      limit 8
    `;
    for (const c of candidates) {
      if (!isHousingItem(c.title, c.snippet ?? "")) continue;
      const slugBase = c.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 48);
      if (!slugBase) continue;
      const slug = `watch-${slugBase}`;
      const exists = await sql`select id from projects where slug = ${slug} limit 1`;
      if (exists.length) continue;
      await sql.query(
        `insert into projects (
          slug, name, location_label, area, status, units_note, official_links,
          latest_summary, latest_summary_at, confidence, published, featured
        ) values ($1,$2,$3,$4,'concept',$5,'[]',$6,now(),'watch', true, false)`,
        [
          slug,
          c.title.slice(0, 80),
          "Putnam County (auto-detected)",
          "Putnam County",
          "Auto-published from news/county copy. Verify before relying on it.",
          `Reported in public sources: ${c.title}${c.url ? ` (${c.url})` : ""}. Not yet confirmed against a county case file.`,
        ],
      );
    }

    await sql.query(`update site_settings set value = now()::text where key = 'last_public_update'`);
    let amazonNote = "";
    try {
      const { keepAffiliateCatalog } = await import("@/lib/affiliate-keep.server");
      const kept = await keepAffiliateCatalog();
      amazonNote = ` Affiliate keep: ${kept.summary}`;
    } catch (err) {
      amazonNote = ` Affiliate keep skipped: ${err instanceof Error ? err.message : "error"}`;
    }
    const summary = `Fetched ${sources.length} sources, ${newItems} new items, ${summarized} summaries, ai=${ai ? "yes" : "no"}.${amazonNote} ${errors.length ? `Errors: ${errors.join("; ")}` : "No source errors."}`;
    if (jobId) {
      await sql.query(
        `update job_runs set finished_at = now(), status = $1, summary = $2, error = $3 where id = $4`,
        [errors.length && newItems === 0 && summarized === 0 ? "error" : "ok", summary, errors.join("; ") || null, jobId],
      );
    }
    if (errors.length >= 3) await maybeAlert(summary);
    return { ok: true, summary };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    if (jobId) {
      await sql.query(
        `update job_runs set finished_at = now(), status = 'error', error = $1 where id = $2`,
        [message, jobId],
      );
    }
    await maybeAlert(message);
    return { ok: false, summary: message };
  }
}
