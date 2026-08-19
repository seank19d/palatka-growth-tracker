import { createFileRoute, Link } from "@tanstack/react-router";
import { Kicker } from "@/components/brand/kicker";
import { formatDateShort } from "@/lib/format";
import { fetchUpdates } from "@/lib/data/api";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/whats-new")({
  loader: () => fetchUpdates(),
  head: () =>
    seo({
      title: "Palatka housing updates",
      description:
        "Dated notes when Palatka and East Palatka subdivision status changes: Alford Farms permits, county filings, and new construction that is actually selling.",
      path: "/whats-new",
    }),
  component: WhatsNew,
});

function WhatsNew() {
  const updates = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <Kicker>Updates</Kicker>
      <h1 className="mt-2 font-display text-4xl font-semibold">What’s new</h1>
      <p className="mt-3 text-muted">
        Short entries when a status changes, a document lands, or a source item is worth keeping.
        Older summaries stay on each project page.
      </p>
      <ol className="mt-10">
        {updates.map((u) => (
          <li
            key={u.id}
            className="grid gap-2 border-t border-border py-8 first:border-t-0 sm:grid-cols-[8.5rem_1fr] sm:gap-8"
          >
            <p className="font-mono text-xs tabular-nums text-subtle">
              {formatDateShort(u.createdAt)}
              {u.projectName ? (
                <span className="mt-1 block normal-case tracking-normal">{u.projectName}</span>
              ) : null}
            </p>
            <div>
              <h2 className="font-display text-2xl font-semibold">{u.title}</h2>
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
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
