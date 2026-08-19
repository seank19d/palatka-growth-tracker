import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Kicker } from "@/components/brand/kicker";
import { MapEmbed } from "@/components/projects/map-embed";
import { StatusPipeline } from "@/components/projects/status-pipeline";
import { Timeline } from "@/components/projects/timeline";
import { ConfidenceBadge, StatusBadge } from "@/components/projects/status-badge";
import { JsonLd } from "@/components/json-ld";
import { STATUS_META } from "@/lib/constants";
import { formatDateShort, formatNumber } from "@/lib/format";
import { fetchProjectPage } from "@/lib/data/api";

export const Route = createFileRoute("/developments/$slug")({
  loader: async ({ params }) => {
    const page = await fetchProjectPage({ data: params.slug });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.project.name} — Palatka Growth Tracker`
          : "Development — Palatka Growth Tracker",
      },
      {
        name: "description",
        content: loaderData?.project.latestSummary?.slice(0, 160) ?? "",
      },
    ],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const { project, milestones, updates } = Route.useLoaderData();
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
        data={{
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
        }}
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
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
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
        <dl className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {facts.map((f) => (
            <div key={f.label} className="bg-card px-4 py-3">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-subtle">{f.label}</dt>
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
          <ul className="mt-6 space-y-5">
            {updates.length === 0 ? (
              <li className="text-sm text-muted">No dated updates beyond the milestone file.</li>
            ) : (
              updates.map((u) => (
                <li key={u.id} className="border-b border-border pb-4">
                  <p className="text-xs text-subtle">{formatDateShort(u.createdAt)}</p>
                  <p className="mt-1 font-medium">{u.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{u.body}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {project.officialLinks.length ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Official links</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {project.officialLinks.map((l) => (
              <li key={l.url}>
                <a
                  href={l.url}
                  className="text-primary underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
