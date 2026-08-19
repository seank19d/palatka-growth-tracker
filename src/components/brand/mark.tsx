import { cn } from "@/lib/utils";

/** Print colophon: a square ink block with a cut-out P. No sun, oaks, or waves. */
export function BrandMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("shrink-0 text-primary", className)}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect width="32" height="32" fill="currentColor" />
      <path
        fill="var(--color-bg)"
        d="M9.2 6.8h8.1c4.55 0 7.5 2.55 7.5 6.55s-2.95 6.55-7.5 6.55h-4.9V25.2H9.2V6.8Zm3.15 2.85v7.4h4.85c2.55 0 4.2-1.45 4.2-3.7 0-2.25-1.65-3.7-4.2-3.7H12.35Z"
      />
    </svg>
  );
}
