import { createFileRoute } from "@tanstack/react-router";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization") ?? "";
  if (secret && auth === `Bearer ${secret}`) return true;
  // Vercel Cron sets this header on scheduled invocations
  if (request.headers.get("x-vercel-cron") === "1") return true;
  return false;
}

async function handle(request: Request) {
  if (!authorized(request)) {
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
