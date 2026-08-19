import { formatDateShort } from "@/lib/format";
import type { Milestone } from "@/lib/types";

export function Timeline({ milestones }: { milestones: Milestone[] }) {
  if (!milestones.length) {
    return <p className="text-sm text-muted">No dated milestones in the public file yet.</p>;
  }
  return (
    <ol>
      {milestones.map((m) => (
        <li
          key={m.id}
          className="grid gap-1 border-t border-border py-4 first:border-t-0 sm:grid-cols-[8.5rem_1fr] sm:gap-6"
        >
          <time className="font-mono text-xs tabular-nums text-muted">{formatDateShort(m.occurredOn)}</time>
          <div>
            <h3 className="font-medium leading-snug">{m.title}</h3>
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
          </div>
        </li>
      ))}
    </ol>
  );
}
