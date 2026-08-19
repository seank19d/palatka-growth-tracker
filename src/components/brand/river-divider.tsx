import { cn } from "@/lib/utils";

export function RiverDivider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-border", className)} aria-hidden />;
}
