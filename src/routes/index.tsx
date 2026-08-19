import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
import { Kicker } from "@/components/brand/kicker";
import { RiverDivider } from "@/components/brand/river-divider";
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
    meta: [{ title: `${APP_NAME} — Palatka & East Palatka housing` }],
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

      <section className="overflow-x-clip border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <Kicker>St. Johns River town · Putnam County</Kicker>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
                Palatka is growing.{" "}
                <em className="font-medium not-italic text-primary md:italic">Here’s the paper trail.</em>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
                An independent tracker of plats, permits, and pipeline housing in Palatka, East
                Palatka, and Putnam County — plus a field guide for people who actually have to live
                here. No renderings-as-promises.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/developments">
                    See what’s on the board
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/guide">Field guide</Link>
                </Button>
              </div>
            </div>
            <figure className="relative">
              <div className="absolute -right-3 -top-3 size-16 rounded-full bg-sun/80 blur-[1px] md:size-20" aria-hidden />
              <img
                src="/hero.jpg"
                alt="Illustrated view of Palatka: live oaks and downtown on the St. Johns, new houses on the far bank."
                width={1600}
                height={520}
                className="relative w-full rounded-[1.4rem] border border-border object-cover shadow-[var(--shadow-border)]"
              />
              <figcaption className="mt-3 text-sm leading-relaxed text-muted">
                Palatka looking across a wide bend of the St. Johns. The pretty part is the river.
                The useful part is the ordinance number.
              </figcaption>
            </figure>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-3">
            <Stat label="On the board" shortLabel="Board" value={String(stats.projectCount)} hint="Files we keep" />
            <Stat label="Still in the pipeline" shortLabel="Pipeline" value={String(stats.pipelineCount)} hint="Not built-out" />
            <Stat
              label="Lots on the books"
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
            New subdivisions tend to show up on the high ground first — which is why we keep a{" "}
            <Link to="/guide/$slug" params={{ slug: "local-tips" }} className="underline decoration-sun/80 underline-offset-4">
              flood-and-road page
            </Link>{" "}
            and a lot of PDFs.
          </p>
        </div>
      </aside>

      {featured ? (
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:px-6 md:py-16">
            <div>
              <Kicker>The one people keep asking about</Kicker>
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
                  Open the Alford Farms file
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
            <Kicker>Tracker</Kicker>
            <h2 className="mt-2 font-display text-3xl font-semibold">The pile of plans</h2>
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
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <CountyMap projects={projects} />
          <Card className="p-5 md:p-6">
            <Kicker>The log</Kicker>
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
        </div>
      </section>

      {market ? (
        <section className="border-y border-border bg-bg-sunken">
          <RiverDivider className="opacity-70" />
          <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
            <Kicker>Housing snapshot · {formatDateShort(market.capturedOn)}</Kicker>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Putnam prices sit in a band, not a slogan.
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted">{market.medianNote}</p>
            <p className="mt-3 font-display text-lg italic text-primary">
              Please do not ask if Palatka is “the next” anywhere. It is Palatka.
            </p>
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
        <Kicker>If the U-Haul is pointed this way</Kicker>
        <h2 className="mt-2 font-display text-3xl font-semibold">A field guide, not a listing</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Utilities, flood maps, schools, and the small stuff a builder brochure will never mention.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.slice(0, 6).map((g) => (
            <Link
              key={g.slug}
              to="/guide/$slug"
              params={{ slug: g.slug }}
              className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(30,74,70,0.18)]"
            >
              <GuideGlyph slug={g.slug} />
              <h3 className="mt-3 font-display text-xl font-semibold">{g.navLabel}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{g.excerpt}</p>
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <ProductBlock products={products} heading="First-week kit (the unglamorous stuff)" />
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <Kicker>FAQ</Kicker>
          <h2 className="mt-2 font-display text-3xl font-semibold">Questions people actually ask</h2>
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
