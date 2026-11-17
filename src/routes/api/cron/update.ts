import { createFileRoute } from "@tanstack/react-router";
import { isCronAuthorized } from "@/lib/automation/http-fetch.mjs";

async function handle(request: Request) {
  if (!isCronAuthorized(request)) {
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
