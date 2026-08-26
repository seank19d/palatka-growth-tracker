import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  FileStack,
  Home as HomeIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
import { GuideGlyph } from "@/components/brand/guide-glyph";
import { Kicker } from "@/components/brand/kicker";
import { RiverDivider } from "@/components/brand/river-divider";
import { CountyMap } from "@/components/projects/county-map";
import { ProjectCard } from "@/components/projects/project-card";
import { ConfidenceBadge, StatusBadge } from "@/components/projects/status-badge";
import { ProductBlock } from "@/components/guide/product-block";
import { APP_DESCRIPTION, APP_NAME, EXISTING_MARKET_SLUGS, STATUS_META } from "@/lib/constants";
import { formatDateShort, formatMoney, formatNumber } from "@/lib/format";
import { fetchHome } from "@/lib/data/api";
import { ProjectFocusProvider, useProjectFocus } from "@/lib/project-focus";
import { seo } from "@/lib/seo";
import type { Project } from "@/lib/types";

export const Route = createFileRoute("/")({
  loader: () => fetchHome(),
  head: () =>
    seo({
      title: "New construction in Palatka & East Palatka, FL",
      description:
        "Independent tracker of new construction and subdivisions in Palatka, East Palatka, and Putnam County, Florida. Alford Farms status, The Collection at Palatka, public records, and a moving guide.",
      path: "/",
    }),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  const { featured, projects, updates, guides, market, stats, faqs, products } = data;
  const sellingNow = projects
    .filter((p) => p.status === "selling" && !EXISTING_MARKET_SLUGS.has(p.slug))
    .sort((a, b) => {
      if (a.slug === "collection-at-palatka") return -1;
      if (b.slug === "collection-at-palatka") return 1;
      return a.name.localeCompare(b.name);
    });
  const inCountyFile =
    featured ??
    projects.find((p) => p.slug === "alford-farms") ??
    projects.find((p) => p.status === "permitting" || p.status === "engineering");
  const primarySale = sellingNow[0];
  const others = projects.filter(
    (p) =>
      p.slug !== featured?.slug &&
      !sellingNow.some((s) => s.slug === p.slug) &&
      p.slug !== inCountyFile?.slug,
  );

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
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <Kicker>Palatka · East Palatka · Putnam County</Kicker>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            What’s being built in Palatka and East Palatka.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            County files and water-management permits, not builder renderings. Start with homes you
            can buy this year, or the pipeline that is still sitting in a public file.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              {primarySale ? (
                <Link to="/developments/$slug" params={{ slug: primarySale.slug }}>
                  <HomeIcon className="size-4" />
                  Homes for sale now
                  <ArrowRight className="size-4" />
                </Link>
              ) : (
                <a href="#for-sale-now">
                  <HomeIcon className="size-4" />
                  Homes for sale now
                  <ArrowRight className="size-4" />
                </a>
              )}
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#pipeline">
                <FileStack className="size-4" />
                Pipeline (not selling yet)
              </a>
            </Button>
          </div>
          <p className="mt-4 text-base text-muted">
            Moving here?{" "}
            <Link to="/guide" className="font-medium text-primary underline-offset-4 hover:underline">
              Open the living guide
            </Link>
            .
          </p>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-10 md:px-6">
          <dl className="grid grid-cols-3 gap-6 border-t border-border pt-8">
            <Stat
              label="Projects tracked"
              shortLabel="Projects"
              value={String(stats.projectCount)}
              hint="Published files"
            />
            <Stat
              label="In the pipeline"
              shortLabel="Pipeline"
              value={String(stats.pipelineCount)}
              hint="Not selling yet"
            />
            <Stat
              label="Lots in known plans"
              shortLabel="Lots"
              value={formatNumber(stats.lotsPipeline)}
              hint="Best-known layouts"
            />
          </dl>
        </div>
      </section>

      <ProjectFocusProvider>
      <section className="border-b border-border" id="now-vs-later">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-14">
          <Kicker>Start here</Kicker>
          <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Now vs later</h2>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            Century Complete is taking contracts on 17th Street. Alford Farms is still a Putnam PUD
            file.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div id="for-sale-now">
              <NowLaterCard
                eyebrow="Homes for sale now"
                empty="No project on this site is marked selling right now."
                projects={sellingNow}
              />
            </div>
            {inCountyFile ? (
              <div id="pipeline">
                <NowLaterCard
                  eyebrow="Pipeline — not selling yet"
                  empty=""
                  projects={[inCountyFile]}
                  emphasis="pipeline"
                />
              </div>
            ) : (
              <div id="pipeline" className="border border-border bg-card p-5 md:p-6">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                  Pipeline — not selling yet
                </p>
                <p className="mt-4 text-base text-muted">No pipeline flagship on file.</p>
              </div>
            )}
          </div>
          <p className="mt-6 text-base text-muted">
            <Link to="/developments" className="font-medium text-primary underline-offset-4 hover:underline">
              See every development on file
            </Link>
          </p>
        </div>
      </section>

      <aside className="border-b border-border bg-primary text-primary-fg">
        <RiverDivider className="text-primary-fg/40" />
        <div className="mx-auto max-w-6xl px-4 py-4 md:px-6">
          <p className="max-w-4xl text-base leading-relaxed">
            East Palatka sits on the SR 207 side of the St. Johns — high ground first, which is why
            flood maps and{" "}
            <Link
              to="/guide/$slug"
              params={{ slug: "local-tips" }}
              className="underline decoration-sun/80 underline-offset-4"
            >
              commute traffic
            </Link>{" "}
            show up in every large PUD hearing.
          </p>
        </div>
      </aside>

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Kicker>Developments</Kicker>
            <h2 className="mt-2 font-display text-3xl font-semibold">Other projects on file</h2>
          </div>
          <Link to="/developments" className="hidden items-center gap-1 text-sm text-primary md:inline-flex">
            All developments
            <ArrowRight className="size-3.5" />
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
          <ol className="mt-4">
            {updates.map((u) => (
              <li
                key={u.id}
                className="grid gap-1 border-b border-border py-4 first:pt-0 last:border-0 sm:grid-cols-[7.5rem_1fr] sm:gap-6"
              >
                <p className="font-mono text-xs tabular-nums text-subtle">
                  {formatDateShort(u.createdAt)}
                </p>
                <div>
                  {u.projectSlug ? (
                    <Link
                      to="/developments/$slug"
                      params={{ slug: u.projectSlug }}
                      className="font-medium hover:text-primary"
                    >
                      {u.title}
                    </Link>
                  ) : (
                    <p className="font-medium">{u.title}</p>
                  )}
                  <p className="mt-1 line-clamp-2 text-base text-muted">{u.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link to="/whats-new" className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
            Full log
            <ArrowRight className="size-3.5" />
          </Link>
        </Card>
      </section>
      </ProjectFocusProvider>

      {market ? (
        <section className="border-y border-border bg-bg-sunken">
          <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
            <Kicker>Housing snapshot · {formatDateShort(market.capturedOn)}</Kicker>
            <h2 className="mt-3 font-display text-3xl font-semibold">Putnam County housing prices</h2>
            <dl className="mt-8 grid grid-cols-3 gap-4">
              <div>
                <dt className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-subtle">
                  <TrendingDown className="size-3.5 text-primary" strokeWidth={1.75} />
                  Low typical
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums md:text-4xl">
                  {formatMoney(market.medianSaleLow)}
                </dd>
              </div>
              <div>
                <dt className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-subtle">
                  <TrendingUp className="size-3.5 text-sun-fg" strokeWidth={1.75} />
                  High typical
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums md:text-4xl">
                  {formatMoney(market.medianSaleHigh)}
                </dd>
              </div>
              <div>
                <dt className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-subtle">
                  <CalendarDays className="size-3.5 text-primary" strokeWidth={1.75} />
                  Days on market
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums md:text-4xl">
                  {formatNumber(market.daysOnMarket)}
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex h-1.5">
              <div className="w-2/3 bg-primary" />
              <div className="w-1/3 bg-sun" />
            </div>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">{market.medianNote}</p>
            <p className="mt-3 text-xs text-subtle">{market.sourceNote}</p>
            <Link
              to="/guide/$slug"
              params={{ slug: "cost-of-living" }}
              className="mt-4 inline-flex items-center gap-1 text-sm text-primary"
            >
              Cost of living notes
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <Kicker>Moving here</Kicker>
        <h2 className="mt-2 font-display text-3xl font-semibold">Living in Palatka</h2>
        <p className="mt-3 max-w-2xl text-lg text-muted">
          Utilities, flood maps, schools, and the details a listing will skip.
        </p>
        <div className="mt-6 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {guides.slice(0, 6).map((g, i) => (
            <Link
              key={g.slug}
              to="/guide/$slug"
              params={{ slug: g.slug }}
              className="bg-card p-5 transition-colors hover:bg-secondary/50"
            >
              <GuideGlyph
                slug={g.slug}
                className={
                  i % 2 === 0
                    ? "size-11 rounded-sm bg-accent p-2.5"
                    : "size-11 rounded-sm bg-sun/25 p-2.5 text-sun-fg"
                }
              />
              <h3 className="mt-4 font-display text-xl font-semibold">{g.navLabel}</h3>
              <p className="mt-2 text-base leading-relaxed text-muted">{g.excerpt}</p>
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
            {faqs.map((f, i) => (
              <div key={f.id} className="border-t border-border pt-4">
                <dt className="font-medium">
                  <span className="mr-2 font-mono text-xs text-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {f.question}
                </dt>
                <dd className="mt-2 text-base leading-relaxed text-muted">{f.answer}</dd>
              </div>
            ))}
          </dl>
          <Link to="/faq" className="mt-6 inline-flex items-center gap-1 text-sm text-primary">
            All FAQs
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function NowLaterCard({
  eyebrow,
  projects,
  empty,
  emphasis = "selling",
}: {
  eyebrow: string;
  projects: Project[];
  empty: string;
  emphasis?: "selling" | "pipeline";
}) {
  const focus = useProjectFocus();
  if (!projects.length) {
    return (
      <div className="border border-border bg-card p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{eyebrow}</p>
        <p className="mt-4 text-base text-muted">{empty}</p>
      </div>
    );
  }
  return (
    <div
      className={
        emphasis === "selling"
          ? "relative overflow-hidden border border-primary/25 bg-accent/40 p-5 md:p-6"
          : "relative overflow-hidden border border-border bg-card p-5 md:p-6"
      }
    >
      <span
        className={
          emphasis === "selling"
            ? "absolute inset-y-0 left-0 w-1.5 bg-sun"
            : "absolute inset-y-0 left-0 w-1.5 bg-primary"
        }
        aria-hidden
      />
      <p className="pl-1 text-xs font-medium uppercase tracking-[0.14em] text-muted">{eyebrow}</p>
      <ul className="mt-4 space-y-5">
        {projects.map((p) => (
          <li
            key={p.slug}
            onMouseEnter={() => focus?.setSlug(p.slug)}
            onMouseLeave={() => focus?.setSlug(null)}
          >
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={p.status} />
              <ConfidenceBadge confidence={p.confidence} />
            </div>
            <h3 className="mt-3 font-display text-2xl font-semibold leading-tight">{p.name}</h3>
            <p className="mt-1 text-base text-muted">{p.locationLabel}</p>
            <p className="mt-3 line-clamp-3 text-base leading-relaxed text-fg">{p.latestSummary}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-subtle">Stage</dt>
                <dd className="mt-0.5 font-medium">{STATUS_META[p.status].label}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-subtle">
                  {emphasis === "selling" ? "Builder" : "Lots"}
                </dt>
                <dd className="mt-0.5 font-medium tabular-nums">
                  {emphasis === "selling" ? (p.builder ?? "—") : formatNumber(p.lotsCurrent)}
                </dd>
              </div>
            </dl>
            <Link
              to="/developments/$slug"
              params={{ slug: p.slug }}
              className="mt-4 inline-flex items-center gap-1 text-base font-medium text-primary"
            >
              Full record
              <ArrowRight className="size-3.5" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  shortLabel,
}: {
  label: string;
  value: string;
  hint: string;
  shortLabel: string;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.14em] text-subtle">
        <span className="sm:hidden">{shortLabel}</span>
        <span className="hidden sm:inline">{label}</span>
      </dt>
      <dd className="mt-2 font-display text-2xl font-semibold tabular-nums md:text-4xl">{value}</dd>
      <p className="mt-1 hidden text-xs text-subtle sm:block">{hint}</p>
    </div>
  );
}

