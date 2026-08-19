import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Kicker } from "@/components/brand/kicker";
import { CountyMap } from "@/components/projects/county-map";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { PIPELINE_STATUSES } from "@/lib/constants";
import { fetchProjects } from "@/lib/data/api";
import { ProjectFocusProvider } from "@/lib/project-focus";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/developments/")({
  loader: () => fetchProjects(),
  head: () =>
    seo({
      title: "New subdivisions in Palatka & East Palatka, FL",
      description:
        "Every Palatka and East Palatka housing project we publish: Alford Farms on SR 207, The Collection at Palatka, East River Road, and the Putnam County watch list. Status from public records.",
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
      if (filter === "watch") return p.confidence !== "confirmed";
      return p.area === filter;
    });
  }, [projects, filter]);
  const counts = useMemo(() => {
    const tally: Record<string, number> = {};
    for (const f of FILTERS) {
      tally[f.id] = projects.filter((p) => {
        if (f.id === "all") return true;
        if (f.id === "pipeline") return PIPELINE_STATUSES.includes(p.status);
        if (f.id === "watch") return p.confidence !== "confirmed";
        return p.area === f.id;
      }).length;
    }
    return tally;
  }, [projects]);
  const visibleSlugs = filtered.map((p) => p.slug);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <Kicker>Developments</Kicker>
      <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">Developments</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Every project we currently publish. Pipeline means it is not built-out. Watch-list items are
        reported or unconfirmed. If this page and a sales pitch disagree, use the county PDF.
      </p>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        <strong className="font-medium text-fg">How to read a status:</strong> Concept is an idea.
        Rezoning is a county case. Selling is a contract. Built-out is a finished community.
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
        <div className="mt-8">
          <CountyMap projects={projects} />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </ProjectFocusProvider>
      {filtered.length === 0 ? (
        <p className="mt-10 text-muted">No projects in this filter.</p>
      ) : null}
    </main>
  );
}
