import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Kicker } from "@/components/brand/kicker";
import { CountyMap } from "@/components/projects/county-map";
import { ProjectCard } from "@/components/projects/project-card";
import { PIPELINE_STATUSES } from "@/lib/constants";
import { fetchProjects } from "@/lib/data/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/developments/")({
  loader: () => fetchProjects(),
  head: () => ({ meta: [{ title: "Developments — Palatka Growth Tracker" }] }),
  component: DevelopmentsPage,
});

const FILTERS = [
  { id: "all", label: "All of it" },
  { id: "pipeline", label: "Still in the pipeline" },
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <Kicker>Tracker</Kicker>
      <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">The pile of plans</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Every file we currently keep. Pipeline means the dirt has not finished the job. Watch-list
        means we heard it, and we have not yet seen the ordinance. If this page and a sales pitch
        disagree, trust the PDF.
      </p>
      <p className="mt-3 max-w-2xl font-display text-lg italic text-primary">
        Concept is talk. Selling is a contract. Built-out is the HOA newsletter.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "h-11 rounded-full border px-4 text-sm",
              filter === f.id
                ? "border-primary bg-primary text-primary-fg"
                : "border-border bg-surface text-fg hover:bg-secondary",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="mt-8">
        <CountyMap projects={projects} />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="mt-10 text-muted">Nothing in this filter. The county has not invented it yet.</p>
      ) : null}
    </main>
  );
}
