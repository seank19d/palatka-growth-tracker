import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import type { Project } from "@/lib/types";
import { ConfidenceBadge, StatusBadge } from "./status-badge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to="/developments/$slug" params={{ slug: project.slug }} className="group block h-full">
      <Card className="flex h-full flex-col p-5 transition-shadow duration-200 hover:shadow-[0_0_0_1px_rgba(30,74,70,0.18),0_8px_24px_-12px_rgba(28,25,21,0.18)]">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={project.status} />
          <ConfidenceBadge confidence={project.confidence} />
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold leading-tight group-hover:text-primary">
          {project.name}
        </h3>
        <p className="mt-1 flex items-start gap-1.5 text-sm text-muted">
          <MapPin className="mt-0.5 size-3.5 shrink-0" />
          {project.locationLabel}
        </p>
        <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-muted">
          {project.latestSummary}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-3 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-subtle">Best-known lots</p>
            <p className="font-medium tabular-nums">{formatNumber(project.lotsCurrent)}</p>
          </div>
          <span className="inline-flex items-center gap-1 text-primary">
            Record
            <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
