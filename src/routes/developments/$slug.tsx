import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Kicker } from "@/components/brand/kicker";
import { ProjectAnswerBar } from "@/components/projects/answer-bar";
import { MapEmbed } from "@/components/projects/map-embed";
import { ProductBlock } from "@/components/guide/product-block";
import { OfficialSources } from "@/components/projects/official-sources";
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
            title: "Alford Farms East Palatka: 559 lots, not selling",
            description:
              "Alford Farms on SR 207 is a Putnam PUD (PUD24-000004), not a sales opening. 559-lot layout, D.R. Horton named as agent.",
          }
        : p.slug === "collection-at-palatka"
          ? {
              title: "The Collection at Palatka: new homes for sale",
              description:
                "Century Complete is selling The Collection at Palatka at 508 N. 17th Street. In-town new homes from the low $200,000s — not Alford Farms.",
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
  const { project, milestones, updates, products } = Route.useLoaderData();
  const faqs = PROJECT_FAQS[project.slug] ?? [];
  const facts = [
    { label: "Area", value: project.area },
    { label: "Location", value: project.locationLabel },
    { label: "Acres", value: project.acres != null ? formatNumber(project.acres) : null },
    { label: "Lots (best known)", value: project.lotsCurrent != null ? formatNumber(project.lotsCurrent) : null },
    { label: "Lots at rezoning", value: project.lotsRezoning != null ? formatNumber(project.lotsRezoning) : null },
    {
      label: "Commercial sq ft",
      value: project.commercialSqft ? formatNumber(project.commercialSqft) : null,
    },
    { label: "Builder / agent", value: project.builder },
    { label: "Applicant / developer", value: project.developer },
    { label: "County case", value: project.countyCase },
    { label: "Ordinance", value: project.ordinance },
    { label: "SJRWMD file", value: project.sjrwmdFile },
  ].filter((f) => f.value);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Place",
            name: project.name,
            url: `https://www.palatkahomesreport.com/developments/${project.slug}`,
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
      <Link to="/developments" className="text-base text-muted hover:text-primary">
        ← All developments
      </Link>
      <Kicker className="mt-5">Project file</Kicker>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge status={project.status} />
        <ConfidenceBadge confidence={project.confidence} />
      </div>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{project.name}</h1>
      <p className="mt-2 inline-flex items-center gap-1.5 text-muted">
        <MapPin className="size-4 text-primary" strokeWidth={1.75} />
        {project.locationLabel}
      </p>

      <ProjectAnswerBar project={project} />

      <div className="mt-8">
        <StatusPipeline current={project.status} />
        <p className="mt-2 text-base text-muted">{STATUS_META[project.status].hint}</p>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">File facts</h2>
        <p className="mt-1 text-base text-muted">Numbers from the public file.</p>
        <dl className="mt-4 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="bg-card px-4 py-3">
              <dt className="text-xs uppercase tracking-[0.14em] text-subtle">{f.label}</dt>
              <dd className="mt-1 text-base font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <OfficialSources project={project} />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            Latest summary · {formatDateShort(project.latestSummaryAt)}
          </p>
          <p className="mt-3 max-w-prose text-lg leading-relaxed">{project.latestSummary}</p>
          {project.unitsNote ? (
            <p className="mt-4 max-w-prose text-base leading-relaxed text-muted">{project.unitsNote}</p>
          ) : null}
        </article>
        {project.lat != null && project.lng != null ? (
          <MapEmbed lat={project.lat} lng={project.lng} label={project.name} />
        ) : null}
      </div>

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
              <li className="text-base text-muted">No dated updates beyond the milestone file.</li>
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
                    <p className="mt-1 text-base leading-relaxed text-muted">{u.body}</p>
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
                <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                <AccordionContent className="leading-relaxed">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ) : null}

      {products?.length ? (
        <div className="mt-12">
          <ProductBlock products={products} heading="For the move-in week" />
          {project.slug === "collection-at-palatka" ? (
            <p className="mt-4 text-base text-muted">
              Closing into June–November?{" "}
              <Link to="/storm" className="font-medium text-primary underline-offset-4 hover:underline">
                Storm list
              </Link>
              .
            </p>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}
