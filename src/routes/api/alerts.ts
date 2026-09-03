import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/alerts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, unknown> = {};
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          body = {};
        }
        const { subscribeFileAlert } = await import("@/lib/data/leads.server");
        const result = await subscribeFileAlert({
          email: body.email,
          projectSlug: body.projectSlug,
          sourcePath: body.sourcePath,
          honeypot: body.website,
        });
        const status = result.ok ? 200 : 400;
        return new Response(JSON.stringify(result), {
          status,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
