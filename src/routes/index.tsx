import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
import { Kicker } from "@/components/brand/kicker";
import { GuideGlyph } from "@/components/brand/guide-glyph";
import { CountyMap } from "@/components/projects/county-map";
import { MapEmbed } from "@/components/projects/map-embed";
import { ProjectCard } from "@/components/projects/project-card";
import { ConfidenceBadge, StatusBadge } from "@/components/projects/status-badge";
import { ProductBlock } from "@/components/guide/product-block";
import { APP_DESCRIPTION, APP_NAME, STATUS_META } from "@/lib/constants";
import { formatDateShort, formatNumber } from "@/lib/format";
import { fetchHome } from "@/lib/data/api";

export const Route = createFileRoute("/")({
  loader: () => fetchHome(),
  head: () => ({
    meta: [{ title: "What's being built in Palatka, FL | Palatka Homes Report" }],
  }),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  const { featured, projects, updates, guides, market, stats, faqs, products } = data;
  const others = projects.filter((p) => p.slug !== featured?.slug);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: APP_NAME,
          description: APP_DESCRIPTION,
          about: {
            "@type": "Place",
            name: "Palatka, East Palatka, and Putnam County, Florida",
          },
        }}
      />

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
          <Kicker>Palatka · East Palatka · Putnam County</Kicker>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            What’s being built in Palatka.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Planned and active housing in Palatka and East Palatka, tracked from county
            files, plats, and permits — not builder renderings. Includes a plain-language
            guide for people moving here.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/developments">
                Browse developments
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/guide">Living guide</Link>
            </Button>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-3 border-t border-border pt-8">
            <Stat label="Projects tracked" shortLabel="Projects" value={String(stats.projectCount)} hint="Published files" />
            <Stat label="In the pipeline" shortLabel="Pipeline" value={String(stats.pipelineCount)} hint="Not built-out" />
            <Stat
              label="Lots in known plans"
              shortLabel="Lots"
              value={formatNumber(stats.lotsPipeline)}
              hint="Best-known layouts"
            />
          </dl>
        </div>
      </section>

      <aside className="border-b border-border bg-primary text-primary-fg">
        <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
          <p className="max-w-4xl text-sm leading-relaxed md:text-[0.98rem]">
            Palatka sits on a north-flowing bend of the St. Johns. East Palatka is the other bank.
            Most new subdivisions are proposed on the high ground first, which is why flood maps and{" "}
            <Link to="/guide/$slug" params={{ slug: "local-tips" }} className="underline decoration-sun/80 underline-offset-4">
              SR 207
            </Link>{" "}
            keep coming up in county hearings.
          </p>
        </div>
      </aside>

      {featured ? (
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:px-6 md:py-16">
            <div>
              <Kicker>Featured project</Kicker>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge status={featured.status} />
                <ConfidenceBadge confidence={featured.confidence} />
              </div>
              <h2 className="mt-4 font-display text-4xl font-semibold">{featured.name}</h2>
              <p className="mt-1 text-muted">{featured.locationLabel}</p>
              <p className="mt-4 max-w-prose leading-relaxed text-fg">{featured.latestSummary}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-subtle">County case</dt>
                  <dd className="mt-1 font-medium">{featured.countyCase ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-subtle">Lots (best known)</dt>
                  <dd className="mt-1 font-medium tabular-nums">{formatNumber(featured.lotsCurrent)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-subtle">Stage</dt>
                  <dd className="mt-1 font-medium">{STATUS_META[featured.status].label}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-subtle">Summary date</dt>
                  <dd className="mt-1 font-medium">{formatDateShort(featured.latestSummaryAt)}</dd>
                </div>
              </dl>
              <Button asChild className="mt-8">
                <Link to="/developments/$slug" params={{ slug: featured.slug }}>
                  Full record: {featured.name}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            {featured.lat != null && featured.lng != null ? (
              <MapEmbed lat={featured.lat} lng={featured.lng} label={featured.name} />
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Kicker>Developments</Kicker>
            <h2 className="mt-2 font-display text-3xl font-semibold">Other projects on file</h2>
          </div>
          <Link to="/developments" className="hidden text-sm text-primary md:inline">
            All developments
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {others.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        <div className="mt-10">
          <CountyMap projects={projects} />
        </div>
        <Card className="mt-10 p-5 md:p-6">
            <Kicker>What’s new</Kicker>
            <ul className="mt-4 space-y-4">
              {updates.map((u) => (
                <li key={u.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <p className="text-xs text-subtle">{formatDateShort(u.createdAt)}</p>
                  <p className="mt-1 font-medium">{u.title}</p>
                  <p className="mt-1 line-clamp-3 text-sm text-muted">{u.body}</p>
                </li>
              ))}
            </ul>
            <Link to="/whats-new" className="mt-4 inline-flex text-sm text-primary">
              Full log
            </Link>
          </Card>
      </section>

      {market ? (
        <section className="border-y border-border bg-bg-sunken">
          <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
            <Kicker>Housing snapshot · {formatDateShort(market.capturedOn)}</Kicker>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Putnam County housing prices
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted">{market.medianNote}</p>
            <p className="mt-3 text-xs text-subtle">{market.sourceNote}</p>
            <Link
              to="/guide/$slug"
              params={{ slug: "cost-of-living" }}
              className="mt-4 inline-flex text-sm text-primary"
            >
              Cost of living notes
            </Link>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <Kicker>Moving here</Kicker>
        <h2 className="mt-2 font-display text-3xl font-semibold">Living in Palatka</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Utilities, flood maps, schools, and the details a listing will skip.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.slice(0, 6).map((g) => (
            <Link
              key={g.slug}
              to="/guide/$slug"
              params={{ slug: g.slug }}
              className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/35"
            >
              <GuideGlyph slug={g.slug} />
              <h3 className="mt-3 font-display text-xl font-semibold">{g.navLabel}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{g.excerpt}</p>
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <ProductBlock products={products} heading="First-week moving kit" />
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <Kicker>FAQ</Kicker>
          <h2 className="mt-2 font-display text-3xl font-semibold">Common questions</h2>
          <dl className="mt-6 grid gap-6 md:grid-cols-2">
            {faqs.map((f) => (
              <div key={f.id}>
                <dt className="font-medium">{f.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{f.answer}</dd>
              </div>
            ))}
          </dl>
          <Link to="/faq" className="mt-6 inline-flex text-sm text-primary">
            All FAQs
          </Link>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value, hint, shortLabel }: { label: string; value: string; hint: string; shortLabel: string }) {
  return (
    <div className="rounded-xl bg-card px-3 py-4 shadow-[var(--shadow-border)] md:px-5">
      <dt className="text-[11px] uppercase tracking-[0.14em] text-subtle">
        <span className="sm:hidden">{shortLabel}</span>
        <span className="hidden sm:inline">{label}</span>
      </dt>
      <dd className="mt-1 font-display text-2xl font-semibold tabular-nums md:text-4xl">{value}</dd>
      <p className="mt-1 hidden text-xs text-subtle sm:block">{hint}</p>
    </div>
  );
}
