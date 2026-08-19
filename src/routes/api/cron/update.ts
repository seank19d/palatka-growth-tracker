import { createFileRoute } from "@tanstack/react-router";

async function handle(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return new Response(JSON.stringify({ ok: false, error: "CRON_SECRET is not configured" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  const auth = request.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${secret}`) {
    return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  const { runTrackerUpdate } = await import("@/lib/automation/run-update.server");
  const result = await runTrackerUpdate();
  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 500,
    headers: { "content-type": "application/json" },
  });
}

export const Route = createFileRoute("/api/cron/update")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
});
