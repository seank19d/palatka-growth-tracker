import { STATUS_ORDER, STATUS_META } from "@/lib/constants";
import type { ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusPipeline({ current }: { current: ProjectStatus }) {
  const step = STATUS_META[current].step;
  const total = STATUS_ORDER.length;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
        Stage {step + 1} of {total} · {STATUS_META[current].label}
      </p>

      <div className="mt-3 h-1 bg-secondary md:hidden">
        <div
          className="h-full bg-primary"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>

      <ol className="mt-4 hidden md:grid" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
        {STATUS_ORDER.map((id, i) => {
          const here = id === current;
          const passed = STATUS_META[id].step <= step;
          return (
            <li key={id} className="relative flex flex-col items-center px-1 text-center">
              {i > 0 ? (
                <span
                  className={cn(
                    "absolute left-0 right-1/2 top-[5px] h-px",
                    STATUS_META[id].step <= step ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}
              {i < total - 1 ? (
                <span
                  className={cn(
                    "absolute left-1/2 right-0 top-[5px] h-px",
                    STATUS_META[id].step < step ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 size-2.5 rounded-full",
                  here ? "bg-primary ring-4 ring-accent" : passed ? "bg-primary" : "bg-border",
                )}
              />
              <span
                className={cn(
                  "mt-2 text-xs leading-tight",
                  here ? "font-semibold text-fg" : passed ? "text-fg" : "text-subtle",
                )}
              >
                {STATUS_META[id].label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
