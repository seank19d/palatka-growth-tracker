import { createFileRoute, Link } from "@tanstack/react-router";
import { Kicker } from "@/components/brand/kicker";
import { formatDateShort } from "@/lib/format";
import { fetchUpdates } from "@/lib/data/api";

export const Route = createFileRoute("/whats-new")({
  loader: () => fetchUpdates(),
  head: () => ({ meta: [{ title: "What’s new — Palatka Growth Tracker" }] }),
  component: WhatsNew,
});

function WhatsNew() {
  const updates = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <Kicker>The log</Kicker>
      <h1 className="mt-2 font-display text-4xl font-semibold">What’s new</h1>
      <p className="mt-3 text-muted">
        Short entries when something actually happens — a status change, a new document, or a source
        item worth keeping. Not a press-release graveyard. Older summaries stay on each project page.
      </p>
      <ol className="mt-10 space-y-8">
        {updates.map((u) => (
          <li key={u.id} className="border-b border-border pb-8">
            <p className="text-xs uppercase tracking-[0.14em] text-subtle">
              {formatDateShort(u.createdAt)}
              {u.projectName ? ` · ${u.projectName}` : ""}
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold">{u.title}</h2>
            <p className="mt-2 leading-relaxed text-fg">{u.body}</p>
            {u.projectSlug ? (
              <Link
                to="/developments/$slug"
                params={{ slug: u.projectSlug }}
                className="mt-3 inline-flex text-sm text-primary"
              >
                Open project record
              </Link>
            ) : null}
          </li>
        ))}
      </ol>
    </main>
  );
}
