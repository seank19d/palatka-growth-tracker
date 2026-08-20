import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted",
        className,
      )}
    >
      <span className="inline-block size-1.5 shrink-0 bg-primary" aria-hidden />
      {children}
    </p>
  );
}
