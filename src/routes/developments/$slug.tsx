import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Kicker } from "@/components/brand/kicker";
import { MapEmbed } from "@/components/projects/map-embed";
import { StatusPipeline } from "@/components/projects/status-pipeline";
import { Timeline } from "@/components/projects/timeline";
import { ConfidenceBadge, StatusBadge } from "@/components/projects/status-badge";
import { JsonLd } from "@/components/json-ld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { STATUS_META } from "@/lib/constants";
import { PROJECT_FAQS } from "@/lib/data/project-faqs";
import { formatDateShort, formatNumber } from "@/lib/format";
import { fetchProjectPage } from "@/lib/data/api";
import { breadcrumbJsonLd, faqJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/developments/$slug")({
  loader: async ({ params }) => {
    const page = await fetchProjectPage({ data: params.slug });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) return seo({ title: "Development", path: "/developments" });
    const custom =
      p.slug === "alford-farms"
        ? {
            title: "Alford Farms East Palatka, FL: status, 559 lots, D.R. Horton",
            description:
              "Alford Farms is a planned subdivision on SR 207 in East Palatka. Putnam County approved PUD24-000004 in August 2024. Public records show permitting, not home sales. Why documents say 700 homes and 559 lots.",
          }
        : p.slug === "collection-at-palatka"
          ? {
              title: "The Collection at Palatka: new construction homes for sale",
              description:
                "The Collection at Palatka by Century Complete is selling in-town new construction at 508 N. 17th Street. Advertised from the low $200,000s. Separate from Alford Farms in East Palatka.",
            }
          : {
              title: `${p.name} in ${p.area}, FL — status and public record`,
              description: (p.latestSummary ?? `${p.name} in ${p.area}, Putnam County, Florida.`).slice(
                0,
                160,
              ),
            };
    return seo({ ...custom, path: `/developments/${p.slug}` });
  },
  component: ProjectPage,
});

function ProjectPage() {
  const { project, milestones, updates } = Route.useLoaderData();
  const faqs = PROJECT_FAQS[project.slug] ?? [];
  const facts = [
    { label: "Area", value: project.area },
    { label: "Location", value: project.locationLabel },
    { label: "Acres", value: project.acres != null ? formatNumber(project.acres) : "—" },
    { label: "Lots (best known)", value: formatNumber(project.lotsCurrent) },
    { label: "Lots at rezoning", value: formatNumber(project.lotsRezoning) },
    {
      label: "Commercial sq ft",
      value: project.commercialSqft ? formatNumber(project.commercialSqft) : "—",
    },
    { label: "Builder / agent", value: project.builder ?? "—" },
    { label: "Applicant / developer", value: project.developer ?? "—" },
    { label: "County case", value: project.countyCase ?? "—" },
    { label: "Ordinance", value: project.ordinance ?? "—" },
    { label: "SJRWMD file", value: project.sjrwmdFile ?? "—" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Place",
            name: project.name,
            description: project.latestSummary,
            address: {
              "@type": "PostalAddress",
              addressLocality: project.area,
              addressRegion: "FL",
              addressCountry: "US",
            },
            geo:
              project.lat != null && project.lng != null
                ? { "@type": "GeoCoordinates", latitude: project.lat, longitude: project.lng }
                : undefined,
          },
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Developments", path: "/developments" },
            { name: project.name, path: `/developments/${project.slug}` },
          ]),
          ...(faqs.length ? [faqJsonLd(faqs)] : []),
        ]}
      />
      <Link to="/developments" className="text-sm text-muted hover:text-primary">
        ← All developments
      </Link>
      <Kicker className="mt-5">Project file</Kicker>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge status={project.status} />
        <ConfidenceBadge confidence={project.confidence} />
      </div>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{project.name}</h1>
      <p className="mt-2 text-muted">{project.locationLabel}</p>
      <div className="mt-6">
        <StatusPipeline current={project.status} />
        <p className="mt-2 text-sm text-muted">{STATUS_META[project.status].hint}</p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            Latest summary · {formatDateShort(project.latestSummaryAt)}
          </p>
          <p className="mt-3 max-w-prose text-[1.05rem] leading-relaxed">{project.latestSummary}</p>
          {project.unitsNote ? (
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted">{project.unitsNote}</p>
          ) : null}
        </article>
        {project.lat != null && project.lng != null ? (
          <MapEmbed lat={project.lat} lng={project.lng} label={project.name} />
        ) : null}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">File facts</h2>
        <p className="mt-1 text-sm text-muted">Numbers from the public file.</p>
        <dl className="mt-4 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="bg-card px-4 py-3">
              <dt className="text-xs uppercase tracking-[0.14em] text-subtle">{f.label}</dt>
              <dd className="mt-1 text-sm font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold">Timeline</h2>
          <div className="mt-6">
            <Timeline milestones={milestones} />
          </div>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold">Updates</h2>
          <ul className="mt-6 space-y-0">
            {updates.length === 0 ? (
              <li className="text-sm text-muted">No dated updates beyond the milestone file.</li>
            ) : (
              updates.map((u) => (
                <li
                  key={u.id}
                  className="grid gap-1 border-t border-border py-4 first:border-t-0 sm:grid-cols-[7.5rem_1fr] sm:gap-6"
                >
                  <p className="font-mono text-xs tabular-nums text-subtle">
                    {formatDateShort(u.createdAt)}
                  </p>
                  <div>
                    <p className="font-medium">{u.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{u.body}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {faqs.length ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Common questions</h2>
          <Accordion type="single" collapsible className="mt-4">
            {faqs.map((f) => (
              <AccordionItem key={f.question} value={f.question}>
                <AccordionTrigger className="text-left text-base">{f.question}</AccordionTrigger>
                <AccordionContent className="leading-relaxed">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ) : null}

      {project.officialLinks.length ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Official links</h2>
          <ul className="mt-4 divide-y divide-border border border-border">
            {project.officialLinks.map((l) => (
              <li key={l.url}>
                <a
                  href={l.url}
                  className="flex items-baseline justify-between gap-4 bg-card px-4 py-3 text-sm hover:bg-secondary/50"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="font-medium text-fg">{l.label}</span>
                  <span className="shrink-0 font-mono text-xs text-subtle">Source</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
