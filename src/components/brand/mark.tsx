import { cn } from "@/lib/utils";

export function BrandMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("shrink-0", className)}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect width="40" height="40" rx="11" fill="#1e4a46" />
      <circle cx="28.5" cy="11.5" r="5.2" fill="#e0a04a" />
      <ellipse cx="16" cy="16.5" rx="9.2" ry="7.2" fill="#cfe3dc" />
      <ellipse cx="22" cy="15.2" rx="5.4" ry="4.4" fill="#e7f2ec" />
      <path d="M16 16.5v12.2" stroke="#f3eee4" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M5.5 30.5c5.5-3.2 9.5 2.2 14.8.1 5.4-2.1 8.6-2.6 14.2.6"
        fill="none"
        stroke="#8ec5c0"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
