import { STATUS_META } from "@/lib/constants";
import { formatDateShort, formatNumber } from "@/lib/format";
import type { Project } from "@/lib/types";

function sellingAnswer(status: Project["status"]): { label: string; detail: string } {
  if (status === "selling") return { label: "Yes", detail: "Taking contracts or listed for sale" };
  if (status === "built_out") return { label: "Built-out", detail: "Community largely complete" };
  if (status === "under_construction")
    return { label: "Not yet", detail: "Dirt or buildings moving; not confirmed open sales" };
  return { label: "No", detail: "No confirmed home sales in the public file" };
}

export function ProjectAnswerBar({ project }: { project: Project }) {
  const selling = sellingAnswer(project.status);
  const lots = project.lotsCurrent ?? project.lotsRezoning;
  const cells = [
    {
      label: "Status",
      value: STATUS_META[project.status].label,
      hint: STATUS_META[project.status].hint,
    },
    {
      label: "Selling homes?",
      value: selling.label,
      hint: selling.detail,
    },
    {
      label: "Builder",
      value: project.builder ?? "—",
      hint:
        project.developer && project.developer !== project.builder ? project.developer : undefined,
    },
    {
      label: "Lots",
      value: formatNumber(lots),
      hint:
        project.lotsRezoning != null &&
        project.lotsCurrent != null &&
        project.lotsRezoning !== project.lotsCurrent
          ? `Rezoning materials cited ${formatNumber(project.lotsRezoning)}`
          : undefined,
    },
    {
      label: "County case",
      value: project.countyCase ?? "—",
      hint: project.ordinance ? `Ordinance ${project.ordinance}` : undefined,
    },
    {
      label: "Last checked",
      value: formatDateShort(project.latestSummaryAt ?? project.updatedAt),
      hint: "From latest public-file summary on this site",
    },
  ];

  return (
    <section aria-label="Quick facts" className="mt-6 overflow-hidden border border-border bg-card">
      <div className="border-b border-border bg-secondary/40 px-4 py-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          Answer in five seconds
        </p>
      </div>
      <dl className="grid sm:grid-cols-2 lg:grid-cols-3">
        {cells.map((c) => (
          <div
            key={c.label}
            className="border-b border-border px-4 py-3 last:border-b-0 sm:border-r sm:odd:border-r lg:[&:nth-child(3n)]:border-r-0"
          >
            <dt className="text-[11px] uppercase tracking-[0.12em] text-subtle">{c.label}</dt>
            <dd className="mt-1 text-base font-semibold leading-snug text-fg">{c.value}</dd>
            {c.hint ? <p className="mt-1 text-xs leading-snug text-muted">{c.hint}</p> : null}
          </div>
        ))}
      </dl>
    </section>
  );
}
