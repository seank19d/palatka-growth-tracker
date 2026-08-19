import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  HIGHWAYS,
  PUTNAM,
  PUTNAM_OUTLINE,
  ST_JOHNS_RIVER,
  TOWNS,
  polyline,
  project,
} from "@/lib/geo";
import { STATUS_META } from "@/lib/constants";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const VW = 720;
const VH = 520;

export function CountyMap({ projects }: { projects: Project[] }) {
  const [hover, setHover] = useState<string | null>(null);
  const located = projects
    .filter((p) => p.lat != null && p.lng != null)
    .slice()
    .sort((a, b) => (a.lng ?? 0) - (b.lng ?? 0));

  const milesPerPx = ((PUTNAM.north - PUTNAM.south) * 69.0) / VH;
  const barMiles = 10;
  const barPx = barMiles / milesPerPx;
  const land = polyline(PUTNAM_OUTLINE, VW, VH, true);

  return (
    <div className="overflow-hidden rounded-md bg-card shadow-[var(--shadow-border)]">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-4 py-3 md:px-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            Putnam County locator
          </p>
          <p className="mt-0.5 max-w-xl text-sm text-muted">
            Numbered sites from public coordinates. County outline from the U.S. Census.
            Not a survey plat.
          </p>
        </div>
        <p className="font-mono text-xs tabular-nums text-subtle">FL · 12107</p>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_0.8fr]">
        <div className="bg-secondary/40 px-1 py-1 md:px-2 md:py-2">
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            className="w-full"
            role="img"
            aria-label="Map of Putnam County, Florida with tracked housing sites"
          >
            <defs>
              <clipPath id="putnam-land">
                <path d={land} />
              </clipPath>
            </defs>
            <rect width={VW} height={VH} className="fill-bg-sunken" />

            {[29.4, 29.5, 29.6, 29.7, 29.8].map((lat) => {
              const { y } = project(PUTNAM.west, lat, VW, VH);
              return (
                <line
                  key={lat}
                  x1={0}
                  x2={VW}
                  y1={y}
                  y2={y}
                  className="stroke-border"
                  strokeWidth={0.5}
                />
              );
            })}

            <path d={land} className="fill-card stroke-primary" strokeWidth={1.8} />

            <g clipPath="url(#putnam-land)">
              {(() => {
                const c = project(-81.515, 29.445, VW, VH);
                return (
                  <ellipse
                    cx={c.x}
                    cy={c.y}
                    rx={22}
                    ry={14}
                    className="fill-accent stroke-primary/25"
                    strokeWidth={0.7}
                  />
                );
              })()}
              <path
                d={polyline(ST_JOHNS_RIVER, VW, VH)}
                fill="none"
                className="stroke-primary"
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.2}
              />
              <path
                d={polyline(ST_JOHNS_RIVER, VW, VH)}
                fill="none"
                className="stroke-primary"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {HIGHWAYS.map((hw) => (
                <path
                  key={hw.name}
                  d={polyline(hw.pts, VW, VH)}
                  fill="none"
                  className="stroke-fg/40"
                  strokeWidth={1.3}
                  strokeLinejoin="round"
                />
              ))}
            </g>

            {HIGHWAYS.map((hw) => {
              const p = project(hw.labelAt[0], hw.labelAt[1], VW, VH);
              return (
                <text
                  key={`${hw.name}-label`}
                  x={p.x + hw.ldx}
                  y={p.y + hw.ldy}
                  className="fill-muted"
                  fontSize={9}
                  fontFamily="Source Sans 3, sans-serif"
                >
                  {hw.name}
                </text>
              );
            })}

            {(() => {
              const t = project(-81.71, 29.81, VW, VH);
              return (
                <text x={t.x} y={t.y} className="fill-primary" fontSize={10} fontFamily="Source Sans 3, sans-serif">
                  St. Johns River
                </text>
              );
            })()}
            {(() => {
              const t = project(-81.515, 29.445, VW, VH);
              return (
                <text
                  x={t.x}
                  y={t.y + 18}
                  textAnchor="middle"
                  className="fill-primary"
                  fontSize={8}
                  fontFamily="Source Sans 3, sans-serif"
                >
                  Crescent Lake
                </text>
              );
            })()}

            {TOWNS.map((town) => {
              const p = project(town.lng, town.lat, VW, VH);
              return (
                <g key={town.name}>
                  <rect
                    x={p.x - (town.seat ? 3 : 2)}
                    y={p.y - (town.seat ? 3 : 2)}
                    width={town.seat ? 6 : 4}
                    height={town.seat ? 6 : 4}
                    className="fill-fg"
                  />
                  <text
                    x={p.x + town.dx}
                    y={p.y + town.dy}
                    className="fill-fg"
                    fontSize={town.seat ? 12 : 10}
                    fontWeight={town.seat ? 600 : 400}
                    fontFamily="Source Sans 3, sans-serif"
                  >
                    {town.name}
                    {town.seat ? " (seat)" : ""}
                  </text>
                </g>
              );
            })}

            {located.map((proj, i) => {
              const p = project(proj.lng as number, proj.lat as number, VW, VH);
              const n = i + 1;
              const active = hover === proj.slug;
              const built = proj.status === "built_out";
              return (
                <a
                  key={proj.slug}
                  href={`/developments/${proj.slug}`}
                  onMouseEnter={() => setHover(proj.slug)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(proj.slug)}
                  onBlur={() => setHover(null)}
                >
                  <title>{proj.name}</title>
                  {active ? (
                    <circle cx={p.x} cy={p.y} r={16} className="fill-primary/20" />
                  ) : null}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={active ? 11 : 10}
                    className={built ? "fill-muted" : "fill-primary"}
                  />
                  <text
                    x={p.x}
                    y={p.y + 4}
                    textAnchor="middle"
                    className="fill-primary-fg"
                    fontSize={11}
                    fontWeight={600}
                    fontFamily="Source Sans 3, sans-serif"
                  >
                    {n}
                  </text>
                </a>
              );
            })}

            <g transform={`translate(18 ${VH - 64})`}>
              <line x1={8} y1={26} x2={8} y2={4} className="stroke-fg" strokeWidth={1.3} />
              <polygon points="8,0 5.4,8 10.6,8" className="fill-fg" />
              <text x={8} y={40} textAnchor="middle" className="fill-fg" fontSize={10} fontWeight={600}>
                N
              </text>
            </g>
            <g transform={`translate(${VW - barPx - 28} ${VH - 28})`}>
              <line x1={0} y1={0} x2={barPx} y2={0} className="stroke-fg" strokeWidth={1.5} />
              <line x1={0} y1={-3.5} x2={0} y2={3.5} className="stroke-fg" strokeWidth={1.5} />
              <line x1={barPx} y1={-3.5} x2={barPx} y2={3.5} className="stroke-fg" strokeWidth={1.5} />
              <text x={barPx / 2} y={14} textAnchor="middle" className="fill-fg" fontSize={10}>
                {barMiles} mi
              </text>
            </g>
          </svg>
        </div>

        <ol className="divide-y divide-border border-t border-border lg:border-l lg:border-t-0">
          {located.map((proj, i) => {
            const active = hover === proj.slug;
            return (
              <li key={proj.slug}>
                <Link
                  to="/developments/$slug"
                  params={{ slug: proj.slug }}
                  onMouseEnter={() => setHover(proj.slug)}
                  onMouseLeave={() => setHover(null)}
                  className={cn(
                    "flex gap-3 px-4 py-3 transition-colors",
                    active ? "bg-accent" : "hover:bg-secondary/60",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      proj.status === "built_out"
                        ? "bg-muted text-primary-fg"
                        : "bg-primary text-primary-fg",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium leading-tight">{proj.name}</span>
                    <span className="mt-0.5 block text-xs text-muted">{proj.area}</span>
                    <span className="mt-0.5 block font-mono text-xs tabular-nums text-subtle">
                      {proj.lat != null && proj.lng != null
                        ? `${proj.lat.toFixed(4)}°N  ${Math.abs(proj.lng).toFixed(4)}°W`
                        : null}{" "}
                      · {STATUS_META[proj.status].label}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
