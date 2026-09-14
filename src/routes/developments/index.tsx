import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Kicker } from "@/components/brand/kicker";
import { CountyMap } from "@/components/projects/county-map";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PIPELINE_STATUSES } from "@/lib/constants";
import { fetchProjects } from "@/lib/data/api";
import { ProjectFocusProvider } from "@/lib/project-focus";
import { breadcrumbJsonLd, faqJsonLd, seo } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const HUB_FAQS = [
  {
    question: "Is Alford Farms selling?",
    answer:
      "No. Alford Farms is a Putnam County PUD file on SR 207 in East Palatka — rezoning approved, still not a sales opening. See the Alford Farms project page for the public-record status.",
  },
  {
    question: "Which communities are listed as selling?",
    answer:
      "On this hub, Century Complete: Collection and Nobles Crossing. Beverly's Crossing is custom new construction listed separately. Fairway Estates has a recorded plat only — not listed as selling here.",
  },
] as const;

export const Route = createFileRoute("/developments/")({
  loader: () => fetchProjects(),
  head: () =>
    seo({
      title: "Alford Farms & Palatka new construction status",
      description:
        "Alford Farms (East Palatka PUD, not selling) vs Collection and Nobles (listed as selling). Fairway Estates plat recorded. Status from public records — not a brokerage.",
      path: "/developments",
    }),
  component: DevelopmentsPage,
});

const FILTERS = [
  { id: "all", label: "All" },
  { id: "pipeline", label: "Pipeline" },
  { id: "East Palatka", label: "East Palatka" },
  { id: "Palatka", label: "Palatka" },
  { id: "watch", label: "Watch list" },
] as const;

function DevelopmentsPage() {
  const projects = Route.useLoaderData();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (filter === "all") return true;
      if (filter === "pipeline") return PIPELINE_STATUSES.includes(p.status);
      if (filter === "watch") return p.confidence === "watch";
      return p.area === filter;
    });
  }, [projects, filter]);
  const counts = useMemo(() => {
    const tally: Record<string, number> = {};
    for (const f of FILTERS) {
      tally[f.id] = projects.filter((p) => {
        if (f.id === "all") return true;
        if (f.id === "pipeline") return PIPELINE_STATUSES.includes(p.status);
        if (f.id === "watch") return p.confidence === "watch";
        return p.area === f.id;
      }).length;
    }
    return tally;
  }, [projects]);
  const visibleSlugs = filtered.map((p) => p.slug);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Developments", path: "/developments" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Palatka and East Palatka housing developments",
            numberOfItems: projects.length,
            itemListElement: projects.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.name,
              url: `https://www.palatkahomesreport.com/developments/${p.slug}`,
            })),
          },
          faqJsonLd([...HUB_FAQS]),
        ]}
      />
      <Kicker>Developments</Kicker>
      <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
        Alford Farms and Palatka subdivisions
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Looking for{" "}
        <Link
          to="/developments/$slug"
          params={{ slug: "alford-farms" }}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Alford Farms
        </Link>
        ? East Palatka PUD on SR 207 — rezoning approved, still not selling.
      </p>
      <p className="mt-2 max-w-2xl text-lg text-muted">
        Start on that file, then Collection or Nobles if you want homes listed as selling.
      </p>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Every project currently published. Pipeline is still in the county file. Watch-list items
        are unconfirmed. Selling means the builder lists homes for sale.
      </p>
      <p className="mt-3 max-w-2xl text-base text-muted">
        <strong className="font-medium text-fg">How to read a status:</strong> Concept is an idea.
        Rezoning is a county case. Selling means homes are listed for sale. Built-out is a finished
        community.
      </p>
      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter developments">
        {FILTERS.map((f) => (
          <Button
            key={f.id}
            type="button"
            size="sm"
            variant={filter === f.id ? "default" : "outline"}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className="rounded-full"
          >
            {f.label}
            <span className="font-mono text-xs tabular-nums opacity-70">{counts[f.id]}</span>
          </Button>
        ))}
      </div>
      <ProjectFocusProvider visibleSlugs={visibleSlugs}>
        <div className="mt-8 flex flex-col gap-8">
          {filtered.length === 0 ? (
            <p className="text-muted">No projects in this filter.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          )}
          <CountyMap projects={filtered.length ? filtered : projects} />
        </div>
      </ProjectFocusProvider>

      <section className="mt-12 max-w-2xl">
        <h2 className="font-display text-2xl font-semibold">Common questions</h2>
        <Accordion type="single" collapsible className="mt-4">
          {HUB_FAQS.map((f) => (
            <AccordionItem key={f.question} value={f.question}>
              <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                {f.question === "Is Alford Farms selling?" ? (
                  <>
                    No. Alford Farms is a Putnam County PUD file on SR 207 in East Palatka — rezoning
                    approved, still not a sales opening. See the{" "}
                    <Link
                      to="/developments/$slug"
                      params={{ slug: "alford-farms" }}
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Alford Farms project page
                    </Link>{" "}
                    for the public-record status.
                  </>
                ) : (
                  f.answer
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
}
