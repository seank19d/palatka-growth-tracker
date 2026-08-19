import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary">Tracker</p>
      <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">Developments</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Every file we currently track. Pipeline means it is not built-out. Watch-list items are
        reported or unconfirmed. Always prefer the county PDF if this page and a sales pitch disagree.
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
        <p className="mt-10 text-muted">Nothing in this filter right now.</p>
      ) : null}
    </main>
  );
}
