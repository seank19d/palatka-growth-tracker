import { cn } from "@/lib/utils";

/** Cartographic St. Johns bend — print plate, not a rendering. */
export function RiverArt({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden border border-border bg-card shadow-[var(--shadow-border)]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">Plate 01</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">Putnam · FL</p>
      </div>
      <svg
        viewBox="0 0 480 360"
        className="block h-full w-full"
        role="img"
        aria-label="St. Johns River between Palatka and East Palatka"
      >
        <defs>
          <pattern id="river-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
            <line x1="0" y1="0" x2="0" y2="7" stroke="var(--color-moss)" strokeWidth="1.1" opacity="0.45" />
          </pattern>
          <pattern id="river-dots" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill="var(--color-primary)" opacity="0.18" />
          </pattern>
        </defs>

        <rect width="480" height="360" fill="var(--color-surface)" />
        <rect width="480" height="360" fill="url(#river-dots)" />

        <g opacity="0.4" stroke="var(--color-border)" strokeWidth="1" fill="none">
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`v${i}`} x1={40 * (i + 1)} y1="0" x2={40 * (i + 1)} y2="360" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={40 * (i + 1)} x2="480" y2={40 * (i + 1)} />
          ))}
        </g>

        {/* Crop marks */}
        <g stroke="var(--color-fg)" strokeWidth="1.2" fill="none">
          <path d="M8 22 V8 H22" />
          <path d="M458 8 H472 V22" />
          <path d="M8 338 V352 H22" />
          <path d="M458 352 H472 V338" />
        </g>

        {/* High ground / East Palatka hatch */}
        <path d="M292 78 L 452 78 L 452 214 L 318 228 L 292 150 Z" fill="url(#river-hatch)" />

        <path
          d="M268 360 C 250 300, 220 268, 198 230 C 176 192, 158 168, 172 128 C 186 88, 230 70, 252 42 C 270 20, 276 8, 280 0"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="48"
          strokeLinecap="round"
          className="river-stroke"
        />
        <path
          d="M268 360 C 250 300, 220 268, 198 230 C 176 192, 158 168, 172 128 C 186 88, 230 70, 252 42 C 270 20, 276 8, 280 0"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* SR 207 */}
        <path
          d="M0 198 C 90 186, 170 176, 250 168 C 330 160, 390 148, 480 132"
          fill="none"
          stroke="var(--color-fg)"
          strokeWidth="1.6"
          strokeDasharray="7 5"
          opacity="0.55"
        />
        <text
          x="388"
          y="122"
          fill="var(--color-fg)"
          fontSize="9"
          letterSpacing="1.6"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          SR 207
        </text>

        <circle cx="78" cy="46" r="16" fill="var(--color-sun)" />
        <circle cx="78" cy="46" r="22" fill="none" stroke="var(--color-sun)" strokeWidth="1" opacity="0.5" />

        {/* Palatka in-town houses */}
        <g fill="var(--color-primary)">
          <rect x="62" y="168" width="20" height="15" rx="1" />
          <rect x="86" y="176" width="15" height="13" rx="1" />
          <rect x="70" y="192" width="17" height="14" rx="1" />
          <rect x="92" y="200" width="13" height="11" rx="1" />
          <rect x="56" y="210" width="22" height="15" rx="1" />
          <rect x="82" y="218" width="16" height="12" rx="1" />
        </g>

        {/* East Palatka PUD lots */}
        <g fill="var(--color-moss)" opacity="0.92">
          <rect x="318" y="108" width="34" height="20" rx="1" />
          <rect x="358" y="118" width="26" height="18" rx="1" />
          <rect x="330" y="138" width="42" height="22" rx="1" />
          <rect x="378" y="148" width="22" height="16" rx="1" />
          <rect x="322" y="168" width="28" height="16" rx="1" />
        </g>

        <g
          fill="var(--color-fg)"
          fontSize="11"
          letterSpacing="1.5"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          <text x="56" y="156">
            PALATKA
          </text>
          <text x="318" y="98">
            EAST PALATKA
          </text>
          <text x="186" y="252" fill="var(--color-primary-fg)" fontSize="10" letterSpacing="2.2">
            ST. JOHNS
          </text>
        </g>

        {/* Compass */}
        <g transform="translate(428 52)">
          <circle r="22" fill="var(--color-card)" stroke="var(--color-fg)" strokeWidth="1.2" />
          <polygon points="0,-16 4.2,2 0,0 -4.2,2" fill="var(--color-primary)" />
          <polygon points="0,16 4.2,-2 0,0 -4.2,-2" fill="var(--color-border)" />
          <text
            y="-26"
            textAnchor="middle"
            fill="var(--color-fg)"
            fontSize="9"
            fontWeight="600"
            letterSpacing="1.4"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            N
          </text>
        </g>

        {/* Scale */}
        <g transform="translate(24 328)">
          <line x1="0" y1="0" x2="90" y2="0" stroke="var(--color-fg)" strokeWidth="1.4" />
          <line x1="0" y1="-4" x2="0" y2="4" stroke="var(--color-fg)" strokeWidth="1.4" />
          <line x1="45" y1="-3" x2="45" y2="3" stroke="var(--color-fg)" strokeWidth="1.2" />
          <line x1="90" y1="-4" x2="90" y2="4" stroke="var(--color-fg)" strokeWidth="1.4" />
          <text
            x="45"
            y="14"
            textAnchor="middle"
            fill="var(--color-muted)"
            fontSize="9"
            letterSpacing="1.2"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            5 MI  ·  NOT TO SURVEY
          </text>
        </g>
      </svg>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2">
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted">River bend · not a sales map</span>
        <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-subtle">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-2.5 bg-primary" />
            In-town
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-2.5 bg-moss" />
            East bank
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
