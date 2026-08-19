import { Link } from "@tanstack/react-router";
import { formatNumber } from "@/lib/format";
import { useProjectFocus } from "@/lib/project-focus";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ConfidenceBadge, StatusBadge } from "./status-badge";

export function ProjectCard({ project }: { project: Project }) {
  const focus = useProjectFocus();
  const active = focus?.slug === project.slug;
  return (
    <Link
      to="/developments/$slug"
      params={{ slug: project.slug }}
      className="group block h-full"
      onMouseEnter={() => focus?.setSlug(project.slug)}
      onMouseLeave={() => focus?.setSlug(null)}
      onFocus={() => focus?.setSlug(project.slug)}
      onBlur={() => focus?.setSlug(null)}
    >
      <article
        className={cn(
          "flex h-full flex-col border bg-card p-5 transition-[border-color,background-color,transform] duration-150 ease-out",
          active ? "border-primary bg-accent/50" : "border-border group-hover:border-primary/40",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-xs tabular-nums text-subtle">
            {project.countyCase ?? project.area}
          </p>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={project.status} />
            <ConfidenceBadge confidence={project.confidence} />
          </div>
        </div>
        <h3
          className={cn(
            "mt-3 font-display text-2xl font-semibold leading-tight transition-colors duration-150",
            active ? "text-primary" : "group-hover:text-primary",
          )}
        >
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-muted">{project.locationLabel}</p>
        <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-muted">
          {project.latestSummary}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-subtle">Lots</dt>
            <dd className="mt-0.5 font-medium tabular-nums">{formatNumber(project.lotsCurrent)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-subtle">Acres</dt>
            <dd className="mt-0.5 font-medium tabular-nums">{formatNumber(project.acres)}</dd>
          </div>
        </dl>
      </article>
    </Link>
  );
}
