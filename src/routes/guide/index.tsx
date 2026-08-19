import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchGuideHub } from "@/lib/data/api";

export const Route = createFileRoute("/guide/")({
  loader: () => fetchGuideHub(),
  head: () => ({ meta: [{ title: "Living guide — Palatka Growth Tracker" }] }),
  component: GuideHub,
});

function GuideHub() {
  const { guides, pipeline } = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
        Moving here
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
        A practical guide to Palatka & East Palatka
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
        Written for people who have already decided to look here — not to sell you a lot. New
        construction communities below are pulled from the tracker, so this page ages with the dirt.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">Current pipeline communities</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {pipeline.map((p) => (
            <li key={p.slug}>
              <Link
                to="/developments/$slug"
                params={{ slug: p.slug }}
                className="block rounded-xl bg-card p-4 shadow-[var(--shadow-border)]"
              >
                <span className="font-medium">{p.name}</span>
                <span className="mt-1 block text-sm text-muted">
                  {p.locationLabel} · {p.status.replace("_", " ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <Link
            key={g.slug}
            to="/guide/$slug"
            params={{ slug: g.slug }}
            className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]"
          >
            <h2 className="font-display text-xl font-semibold">{g.navLabel}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{g.excerpt}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
