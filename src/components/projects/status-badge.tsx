import {
  BadgeCheck,
  CircleDashed,
  DraftingCompass,
  Eye,
  FileCheck,
  Hammer,
  Home,
  Landmark,
  Map,
  Newspaper,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STATUS_META } from "@/lib/constants";
import type { Confidence, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_ICON = {
  concept: CircleDashed,
  rezoning: Landmark,
  engineering: DraftingCompass,
  permitting: FileCheck,
  plat_recorded: Map,
  under_construction: Hammer,
  selling: Home,
  built_out: BadgeCheck,
} as const;

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const meta = STATUS_META[status];
  const built = status === "built_out";
  const live = status === "under_construction" || status === "selling" || status === "permitting";
  const Icon = STATUS_ICON[status];
  return (
    <Badge variant={live ? "default" : built ? "muted" : "river"} className="gap-1 capitalize">
      <Icon className="size-3" strokeWidth={2} />
      {meta.label}
    </Badge>
  );
}

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const Icon = confidence === "confirmed" ? BadgeCheck : confidence === "reported" ? Newspaper : Eye;
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 uppercase tracking-[0.12em] text-[10px]",
        confidence === "confirmed" && "border-primary/30 text-primary",
      )}
    >
      <Icon className="size-3" strokeWidth={2} />
      {confidence === "confirmed" ? "Public record" : confidence === "reported" ? "Reported" : "Watch"}
    </Badge>
  );
}
