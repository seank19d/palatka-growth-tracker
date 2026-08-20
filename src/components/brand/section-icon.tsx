import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionIcon({
  icon: Icon,
  className,
  tone = "river",
  size = "md",
}: {
  icon: LucideIcon;
  className?: string;
  tone?: "river" | "sun" | "paper" | "moss";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-sm",
        size === "sm" && "size-7",
        size === "md" && "size-10",
        size === "lg" && "size-12",
        tone === "river" && "bg-accent text-primary",
        tone === "sun" && "bg-sun text-sun-fg",
        tone === "paper" && "border border-border bg-card text-primary",
        tone === "moss" && "bg-moss text-primary-fg",
        className,
      )}
      aria-hidden
    >
      <Icon className={size === "lg" ? "size-5" : "size-4"} strokeWidth={1.75} />
    </span>
  );
}
