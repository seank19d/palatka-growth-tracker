import { Badge } from "@/components/ui/badge";
import { STATUS_META } from "@/lib/constants";
import type { Confidence, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const meta = STATUS_META[status];
  const built = status === "built_out";
  const live = status === "under_construction" || status === "selling" || status === "permitting";
  return (
    <Badge variant={live ? "default" : built ? "muted" : "river"} className="capitalize">
      {meta.label}
    </Badge>
  );
}

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "uppercase tracking-[0.12em] text-[10px]",
        confidence === "confirmed" && "border-primary/30 text-primary",
      )}
    >
      {confidence === "confirmed" ? "Public record" : confidence === "reported" ? "Reported" : "Watch"}
    </Badge>
  );
}
