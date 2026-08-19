import { formatDateShort } from "@/lib/format";
import type { Milestone } from "@/lib/types";

export function Timeline({ milestones }: { milestones: Milestone[] }) {
  if (!milestones.length) {
    return <p className="text-sm text-muted">No dated milestones in the public file yet.</p>;
  }
  return (
    <ol className="relative ml-2 border-l border-border pl-6">
      {milestones.map((m) => (
        <li key={m.id} className="relative pb-8 last:pb-0">
          <span className="absolute -left-[29px] top-1.5 size-2.5 rounded-full bg-primary" />
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            {formatDateShort(m.occurredOn)}
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold">{m.title}</h3>
          {m.body ? <p className="mt-1 text-sm leading-relaxed text-muted">{m.body}</p> : null}
          {m.sourceLabel ? (
            <p className="mt-2 text-xs text-subtle">
              Source:{" "}
              {m.sourceUrl ? (
                <a
                  href={m.sourceUrl}
                  className="underline underline-offset-2 hover:text-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  {m.sourceLabel}
                </a>
              ) : (
                m.sourceLabel
              )}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
