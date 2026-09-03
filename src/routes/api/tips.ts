import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/tips")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, unknown> = {};
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          body = {};
        }
        const kind = body.kind === "resource" ? "resource" : "tip";
        const { submitSiteMessage } = await import("@/lib/data/leads.server");
        const result = await submitSiteMessage({
          kind,
          email: body.email,
          name: body.name,
          body: body.body,
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
