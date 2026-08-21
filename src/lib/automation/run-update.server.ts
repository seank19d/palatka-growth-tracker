import * as cheerio from "cheerio";
import { getSql } from "@/lib/db";
import { ensureSeeded } from "@/lib/data/ensure-seeded.server";
import { STATUS_RANK, inferStatus } from "@/lib/automation/status-infer";

const UA = "PalatkaHomesReport/1.0 (independent housing report; contact via /about)";

type SourceRow = {
  id: number;
  name: string;
  url: string;
  kind: string;
  enabled: boolean;
};

type ProjectLite = { id: number; slug: string; name: string; status: string };

const MATCHERS: { slug: string; keys: string[] }[] = [
  { slug: "alford-farms", keys: ["alford farms", "alford farm", "pud24-000004", "ordinance 2024-017"] },
  {
    slug: "collection-at-palatka",
    keys: ["collection at palatka", "century complete", "508 n. 17th", "17th street"],
  },
  { slug: "east-river-road", keys: ["east river road", "putnam county blvd", "putnam county boulevard"] },
  { slug: "gilbert-road-tract", keys: ["gilbert road"] },
  { slug: "palatka-riverfront-infill", keys: ["riverfront", "downtown palatka", "palatka cra"] },
  { slug: "american-gardens", keys: ["american gardens"] },
  { slug: "interlachen-lakes", keys: ["interlachen"] },
];

const NEW_PROJECT_HINT =
  /\b(subdivision|pud|rezoning|planned unit|new homes|new construction|plat)\b/i;

async function fetchText(url: string, timeoutMs = 9000): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
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
  return items.slice(0, 12);
}

function parseHtmlHeadlines(html: string, baseUrl: string): { title: string; url: string; snippet: string; publishedAt: string | null }[] {
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

function matchProject(text: string, projects: ProjectLite[]): ProjectLite | null {
  const hay = text.toLowerCase();
  for (const rule of MATCHERS) {
    if (rule.keys.some((k) => hay.includes(k))) {
      return projects.find((p) => p.slug === rule.slug) ?? null;
    }
  }
  for (const p of projects) {
    if (hay.includes(p.name.toLowerCase())) return p;
  }
  return null;
}

async function chatComplete(prompt: string): Promise<string | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
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
            "You write brief public updates for Palatka Homes Report, an independent civic housing site. Voice: service journalism — a local reporter who has read the file. Plain language, specific, dated. No hype, no jokes, no exclamation points, no emojis. Distinguish confirmed public records from news reports. Name dates and case numbers when present. If nothing material changed, say so in two sentences.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return body.choices?.[0]?.message?.content?.trim() || null;
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

export async function runTrackerUpdate(): Promise<{ ok: boolean; summary: string }> {
  await ensureSeeded();
  const sql = await getSql();
  const inserted = await sql<{ id: number }>`
    insert into job_runs (job_name, status) values ('tracker-update', 'running') returning id
  `;
  const jobId = inserted[0]?.id;
  const errors: string[] = [];
  let newItems = 0;
  let summarized = 0;

  try {
    const sources = await sql<SourceRow>`select id, name, url, kind, enabled from sources where enabled = true`;
    const projects = await sql<ProjectLite>`select id, slug, name, status from projects`;
    const idBySlug = new Map(projects.map((p) => [p.slug, p]));

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
        const matched = matchProject(`${item.title} ${item.snippet}`, projects);
        const candidate =
          !matched && NEW_PROJECT_HINT.test(item.title) && /palatka|putnam|east palatka/i.test(item.title);
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
          const inferred = inferStatus(`${item.title} ${item.snippet}`);
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
      await new Promise((r) => setTimeout(r, 400));
    }

    if (newItems > 0 && process.env.XAI_API_KEY) {
      const recent = await sql<{
        title: string;
        snippet: string | null;
        url: string | null;
        slug: string | null;
        name: string | null;
      }>`
        select i.title, i.snippet, i.url, p.slug, p.name
        from source_items i
        left join projects p on p.id = i.matched_project_id
        order by i.created_at desc
        limit 12
      `;
      const bySlug = new Map<string, typeof recent>();
      for (const row of recent) {
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
          const text = await chatComplete(
            `New headlines from Putnam / Palatka sources that did not match a known project:\n${headlines}\n\nWrite a 3-sentence What's New blurb. If a new subdivision name appears, flag it plainly.`,
          );
          if (text) {
            await sql.query(
              `insert into project_updates (project_id, title, body, kind, source_label)
               values (null, $1, $2, 'whats_new', 'Automated digest')`,
              ["Source digest", text],
            );
            summarized += 1;
          }
          continue;
        }
        const project = idBySlug.get(slug);
        if (!project) continue;
        const current = await sql<{ latest_summary: string | null }>`
          select latest_summary from projects where id = ${project.id}
        `;
        const text = await chatComplete(
          `Project: ${project.name} (${slug}). Current summary:\n${current[0]?.latest_summary ?? "(none)"}\n\nNew items:\n${headlines}\n\nWrite an updated latest-summary (120-180 words) for the public project page.`,
        );
        if (text) {
          await sql.query(
            `update projects set latest_summary = $1, latest_summary_at = now(), updated_at = now() where id = $2`,
            [text, project.id],
          );
          await sql.query(
            `insert into project_updates (project_id, title, body, kind, source_label)
             values ($1,$2,$3,'whats_new','Automated digest')`,
            [project.id, `Update: ${project.name}`, text],
          );
          summarized += 1;
        }
      }
    }

    const candidates = await sql<{ id: number; title: string; url: string | null; snippet: string | null }>`
      select id, title, url, snippet from source_items
      where is_new_project_candidate = true
        and matched_project_id is null
        and created_at > now() - interval '14 days'
      order by created_at desc
      limit 8
    `;
    for (const c of candidates) {
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
    const summary = `Fetched ${sources.length} sources, ${newItems} new items, ${summarized} summaries. ${errors.length ? `Errors: ${errors.join("; ")}` : "No source errors."}`;
    if (jobId) {
      await sql.query(
        `update job_runs set finished_at = now(), status = $1, summary = $2, error = $3 where id = $4`,
        [errors.length && newItems === 0 ? "error" : "ok", summary, errors.join("; ") || null, jobId],
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
