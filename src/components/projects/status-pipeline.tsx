import { STATUS_ORDER, STATUS_META } from "@/lib/constants";
import type { ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusPipeline({ current }: { current: ProjectStatus }) {
  const step = STATUS_META[current].step;
  return (
    <ol className="flex flex-wrap gap-2">
      {STATUS_ORDER.map((id) => {
        const active = STATUS_META[id].step <= step;
        const here = id === current;
        return (
          <li
            key={id}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              here
                ? "bg-primary text-primary-fg"
                : active
                  ? "bg-accent text-primary"
                  : "bg-secondary text-subtle",
            )}
          >
            {STATUS_META[id].label}
          </li>
        );
      })}
    </ol>
  );
}
