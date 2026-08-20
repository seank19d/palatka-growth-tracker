import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, FileStack } from "lucide-react";
import { GuideGlyph } from "@/components/brand/guide-glyph";
import { Kicker } from "@/components/brand/kicker";
import { SectionIcon } from "@/components/brand/section-icon";
import { StatusBadge } from "@/components/projects/status-badge";
import { fetchGuideHub } from "@/lib/data/api";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/guide/")({
  loader: () => fetchGuideHub(),
  head: () =>
    seo({
      title: "Moving to Palatka, FL: living guide",
      description:
        "Practical guide to living in Palatka and East Palatka: utilities, flood maps, schools, cost of living, and what pipeline communities like Alford Farms actually mean for a move date.",
      path: "/guide",
    }),
  component: GuideHub,
});

function GuideHub() {
  const { guides, pipeline } = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <div className="flex items-center gap-3">
        <SectionIcon icon={BookOpen} tone="sun" />
        <Kicker className="mt-0">Moving here</Kicker>
      </div>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
        A practical guide to Palatka & East Palatka
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
        Written for people who are already looking here — not to sell a lot. Pipeline communities
        below come from this report, so this page stays current with the dirt.
      </p>

      <section className="mt-10">
        <div className="flex items-center gap-2">
          <SectionIcon icon={FileStack} tone="river" size="sm" />
          <h2 className="font-display text-2xl font-semibold">Current pipeline communities</h2>
        </div>
        <ul className="mt-4 divide-y divide-border border border-border">
          {pipeline.map((p) => (
            <li key={p.slug}>
              <Link
                to="/developments/$slug"
                params={{ slug: p.slug }}
                className="flex flex-wrap items-center justify-between gap-3 bg-card px-4 py-3 hover:bg-secondary/50"
              >
                <span>
                  <span className="block font-medium">{p.name}</span>
                  <span className="mt-0.5 block text-sm text-muted">{p.locationLabel}</span>
                </span>
                <StatusBadge status={p.status} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g, i) => (
          <Link
            key={g.slug}
            to="/guide/$slug"
            params={{ slug: g.slug }}
            className="bg-card p-5 hover:bg-secondary/50"
          >
            <div className="flex items-center justify-between gap-3">
              <GuideGlyph
                slug={g.slug}
                className={
                  i % 3 === 0
                    ? "size-11 rounded-sm bg-accent p-2.5"
                    : i % 3 === 1
                      ? "size-11 rounded-sm bg-sun/25 p-2.5 text-sun-fg"
                      : "size-11 rounded-sm bg-moss/15 p-2.5 text-moss"
                }
              />
              <p className="font-mono text-xs tabular-nums text-subtle">
                {String(i + 1).padStart(2, "0")}
              </p>
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold">{g.navLabel}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{g.excerpt}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
