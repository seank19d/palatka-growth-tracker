import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/affiliate/click")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let id = 0;
        try {
          const body = (await request.json()) as { id?: unknown };
          id = Number(body?.id);
        } catch {
          id = 0;
        }
        if (!Number.isInteger(id) || id <= 0) {
          return new Response(JSON.stringify({ ok: false }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
        const { getSql } = await import("@/lib/db");
        const sql = await getSql();
        const found = await sql<{ id: number }>`select id from affiliate_products where id = ${id} limit 1`;
        if (!found[0]) {
          return new Response(JSON.stringify({ ok: false }), {
            status: 404,
            headers: { "content-type": "application/json" },
          });
        }
        const path = request.headers.get("referer")?.replace(/^https?:\/\/[^/]+/, "") ?? null;
        await sql.query(`insert into affiliate_clicks (product_id, path) values ($1, $2)`, [
          id,
          path?.slice(0, 240) ?? null,
        ]);
        return new Response(JSON.stringify({ ok: true }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
