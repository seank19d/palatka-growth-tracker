import { cn } from "@/lib/utils";

export function RiverDivider({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden text-primary/35", className)} aria-hidden>
      <svg viewBox="0 0 1200 36" className="block w-full" preserveAspectRatio="none">
        <path
          d="M0 22 C 80 8, 160 30, 240 18 C 320 6, 400 28, 480 16 C 560 4, 640 26, 720 14 C 800 4, 880 28, 960 16 C 1040 6, 1120 26, 1200 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M0 28 C 90 16, 170 34, 260 24 C 350 14, 430 34, 520 22 C 610 12, 690 32, 780 20 C 870 10, 950 32, 1040 22 C 1120 14, 1160 28, 1200 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.55"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
