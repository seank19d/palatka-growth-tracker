import { createFileRoute } from "@tanstack/react-router";

/**
 * Read-only affiliate click rollup for Growth / Affiliates agents.
 * Auth: Authorization: Bearer $CRON_SECRET (same gate as /api/cron/update).
 * Not for browsers — robots already Disallow /api/.
 */
function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = request.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}

async function handle(request: Request) {
  if (!authorized(request)) {
    return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();

    const totals = await sql<{ clicks_all: number; clicks_30: number }>`
      select
        count(*)::int as clicks_all,
        count(*) filter (where created_at > now() - interval '30 days')::int as clicks_30
      from affiliate_clicks
    `;

    const byPath = await sql<{
      path: string;
      title: string | null;
      asin: string | null;
      clicks: number;
    }>`
      select
        coalesce(nullif(split_part(c.path, '?', 1), ''), '(no path)') as path,
        p.title,
        p.asin,
        count(*)::int as clicks
      from affiliate_clicks c
      left join affiliate_products p on p.id = c.product_id
      group by 1, 2, 3
      order by clicks desc, path, title
      limit 200
    `;

    const byProduct = await sql<{
      id: number;
      title: string;
      asin: string | null;
      clicks_30: number;
      clicks_all: number;
    }>`
      select
        p.id,
        p.title,
        p.asin,
        coalesce((
          select count(*)::int from affiliate_clicks c
          where c.product_id = p.id and c.created_at > now() - interval '30 days'
        ), 0) as clicks_30,
        coalesce((
          select count(*)::int from affiliate_clicks c where c.product_id = p.id
        ), 0) as clicks_all
      from affiliate_products p
      where exists (select 1 from affiliate_clicks c where c.product_id = p.id)
      order by clicks_all desc, p.sort_order
      limit 100
    `;

    return new Response(
      JSON.stringify({
        ok: true,
        generatedAt: new Date().toISOString(),
        totals: {
          clicksAll: totals[0]?.clicks_all ?? 0,
          clicks30: totals[0]?.clicks_30 ?? 0,
        },
        byPath: byPath.map((r) => ({
          path: r.path,
          title: r.title,
          asin: r.asin,
          clicks: r.clicks,
        })),
        byProduct: byProduct.map((r) => ({
          id: r.id,
          title: r.title,
          asin: r.asin,
          clicks30: r.clicks_30,
          clicksAll: r.clicks_all,
        })),
      }),
      {
        status: 200,
        headers: { "content-type": "application/json", "cache-control": "no-store" },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "stats failed";
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export const Route = createFileRoute("/api/internal/affiliate-stats")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
    },
  },
});
