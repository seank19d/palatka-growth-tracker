import type { Project } from "@/lib/types";

type Pin = { slug: string; label: string; x: number; y: number };

const PINS: Pin[] = [
  { slug: "interlachen-lakes", label: "Interlachen", x: 18, y: 46 },
  { slug: "palatka-riverfront-infill", label: "Palatka", x: 62, y: 42 },
  { slug: "american-gardens", label: "E. Palatka", x: 74, y: 40 },
  { slug: "alford-farms", label: "Alford Farms", x: 82, y: 36 },
  { slug: "east-river-road", label: "E. River Rd", x: 70, y: 34 },
  { slug: "gilbert-road-tract", label: "Gilbert Rd", x: 86, y: 48 },
];

export function CountyMap({ projects }: { projects: Project[] }) {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  return (
    <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] md:p-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
        Putnam County locator
      </p>
      <p className="mt-1 max-w-md text-sm text-muted">
        Schematic — not a survey. River on the east, Interlachen west, Crescent City south.
      </p>
      <svg viewBox="0 0 100 78" className="mt-4 w-full" role="img" aria-label="Locator map of Putnam County">
        <rect width="100" height="78" className="fill-bg" />
        <path
          d="M8 18 C18 8, 40 10, 58 16 C70 20, 82 18, 90 28 C94 36, 93 52, 86 62 C74 72, 48 74, 28 68 C14 64, 6 48, 8 32 Z"
          className="fill-bg-sunken stroke-primary"
          strokeWidth="0.6"
        />
        <path
          d="M64 10 C66 22, 62 34, 66 46 C70 58, 68 70, 72 78"
          fill="none"
          className="stroke-primary"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <text x="68" y="14" fontSize="3.2" className="fill-muted" fontFamily="Source Sans 3, sans-serif">
          St. Johns River
        </text>
        <text x="12" y="70" fontSize="3" className="fill-subtle" fontFamily="Source Sans 3, sans-serif">
          Crescent City
        </text>
        {PINS.map((pin) => {
          const p = bySlug.get(pin.slug);
          if (!p) return null;
          return (
            <a key={pin.slug} href={`/developments/${pin.slug}`}>
              <circle cx={pin.x} cy={pin.y} r="2.2" className="fill-primary" />
              <circle cx={pin.x} cy={pin.y} r="4" fill="none" className="stroke-primary" strokeWidth="0.4" />
              <text
                x={pin.x + 3.2}
                y={pin.y + 1.1}
                fontSize="3.1"
                className="fill-fg"
                fontFamily="Source Sans 3, sans-serif"
              >
                {pin.label}
              </text>
            </a>
          );
        })}
      </svg>
    </div>
  );
}
