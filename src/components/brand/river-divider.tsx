import { cn } from "@/lib/utils";

export function RiverDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      className={cn("h-3 w-full text-primary", className)}
      aria-hidden
    >
      <path
        d="M0 14 C 80 4, 160 22, 240 12 S 400 4, 480 14 S 640 22, 720 10 S 880 4, 960 16 S 1120 6, 1200 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="river-stroke"
      />
    </svg>
  );
}
