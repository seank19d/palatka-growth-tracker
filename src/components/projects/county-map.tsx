import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import {
  boundsFromPoints,
  clampPercent,
  fitMapView,
  lngLatToPercent,
  scaleBarMiles,
  viewSize,
} from "@/lib/geo";
import { useProjectFocus } from "@/lib/project-focus";
import { STATUS_META } from "@/lib/constants";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Basemap } from "./basemap";

type Mark = {
  slug: string;
  name: string;
  n: number;
  x: number;
  y: number;
  ox: number;
  oy: number;
  built: boolean;
  off: boolean;
};

function spreadMarks(marks: Mark[], aspect: number, minPct = 7): Mark[] {
  const out = marks.map((m) => ({ ...m }));
  for (let i = 0; i < out.length; i += 1) {
    for (let step = 0; step < 14; step += 1) {
      let pushed = false;
      for (let j = 0; j < i; j += 1) {
        const dx = (out[i].ox - out[j].ox) * aspect;
        const dy = out[i].oy - out[j].oy;
        const dist = Math.hypot(dx, dy);
        if (dist >= minPct || dist === 0) {
          if (dist === 0) {
            out[i].oy -= minPct;
            pushed = true;
          }
          continue;
        }
        const ang = Math.atan2(dy, dx || 0.001);
        const need = minPct - dist + 0.35;
        out[i].ox += (Math.cos(ang) * need) / aspect;
        out[i].oy += Math.sin(ang) * need;
        pushed = true;
      }
      if (!pushed) break;
    }
  }
  return out;
}

export function CountyMap({ projects }: { projects: Project[] }) {
  const focus = useProjectFocus();
  const [local, setLocal] = useState<string | null>(null);
  const hover = focus?.slug ?? local;
  const setHover = (slug: string | null) => {
    if (focus) focus.setSlug(slug);
    else setLocal(slug);
  };
  const located = useMemo(
    () =>
      projects
        .filter((p) => p.lat != null && p.lng != null)
        .slice()
        .sort((a, b) => (a.lng ?? 0) - (b.lng ?? 0)),
    [projects],
  );

  const view = useMemo(() => {
    const bounds = boundsFromPoints(
      located.map((p) => ({ lat: p.lat as number, lng: p.lng as number })),
    );
    return fitMapView(bounds);
  }, [located]);

  const size = viewSize(view);
  const aspect = size.width / size.height;
  const scale = scaleBarMiles(view);
  const marks = useMemo(() => {
    let n = 0;
    const raw: Mark[] = located.map((proj) => {
      const p = lngLatToPercent(proj.lng as number, proj.lat as number, view);
      const clamped = clampPercent(p);
      const off = clamped.off;
      return {
        slug: proj.slug,
        name: proj.name,
        n: off ? 0 : ++n,
        x: p.x,
        y: p.y,
        ox: clamped.x,
        oy: clamped.y,
        built: proj.status === "built_out",
        off,
      };
    });
    return spreadMarks(
      raw.filter((m) => !m.off),
      aspect,
    );
  }, [located, view, aspect]);
  const markBySlug = useMemo(() => new Map(marks.map((m) => [m.slug, m])), [marks]);

  const isDim = (slug: string) => Boolean(focus?.visible && !focus.visible.has(slug));

  return (
    <div
      className="overflow-hidden rounded-md bg-card shadow-[var(--shadow-border)]"
      data-map="locator"
      aria-label="Map of Palatka and East Palatka with numbered housing sites"
    >
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-4 py-3 md:px-5">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 inline-flex size-9 items-center justify-center rounded-sm bg-accent text-primary"
            aria-hidden
          >
            <Compass className="size-4" strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
              Palatka & East Palatka locator
            </p>
            <p className="mt-0.5 max-w-xl text-base text-muted">
              Numbered sites on an OpenStreetMap basemap, zoomed to the Palatka bend. Sites west of
              this frame are listed, not pinned.
            </p>
          </div>
        </div>
        <p className="font-mono text-xs tabular-nums text-subtle">FL · 12107</p>
      </div>

      <div className="grid lg:grid-cols-[1.55fr_0.8fr]">
        <Basemap view={view}>
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            {marks.map((m) => {
              if (m.off) return null;
              if (Math.abs(m.ox - m.x) < 0.2 && Math.abs(m.oy - m.y) < 0.2) return null;
              return (
                <line
                  key={`lead-${m.slug}`}
                  x1={`${m.x}%`}
                  y1={`${m.y}%`}
                  x2={`${m.ox}%`}
                  y2={`${m.oy}%`}
                  className="stroke-primary"
                  strokeWidth={1.25}
                />
              );
            })}
            {marks.map((m) =>
              m.off ? null : (
                <circle
                  key={`dot-${m.slug}`}
                  cx={`${m.x}%`}
                  cy={`${m.y}%`}
                  r={2.4}
                  className="fill-primary"
                />
              ),
            )}
          </svg>

          <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-sm bg-card/90 px-2 py-1.5 shadow-[var(--shadow-border)]">
            <p className="text-center font-mono text-[10px] font-semibold tracking-[0.2em] text-fg">
              N
            </p>
            <span className="mx-auto mt-0.5 block h-3 w-px bg-fg" />
          </div>
          <div
            className="pointer-events-none absolute bottom-8 left-3 z-10 h-0.5 bg-fg"
            style={{ width: `${scale.widthPct}%` }}
          />
          <div
            className="pointer-events-none absolute bottom-8 left-3 z-10 h-1.5 w-px bg-fg"
          />
          <div
            className="pointer-events-none absolute bottom-8 z-10 h-1.5 w-px bg-fg"
            style={{ left: `calc(0.75rem + ${scale.widthPct}%)` }}
          />
          <p className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-sm bg-card/95 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-fg shadow-[var(--shadow-border)]">
            {scale.miles} mi
          </p>

          {marks.map((m) => {
            const active = hover === m.slug;
            const dim = isDim(m.slug) && !active;
            return (
              <Link
                key={m.slug}
                to="/developments/$slug"
                params={{ slug: m.slug }}
                title={m.name}
                onMouseEnter={() => setHover(m.slug)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(m.slug)}
                onBlur={() => setHover(null)}
                style={{ left: `${m.ox}%`, top: `${m.oy}%` }}
                className={cn(
                  "absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center outline-none",
                  active ? "z-30" : "z-20",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-7 items-center justify-center rounded-full border-2 text-xs font-semibold shadow-sm transition-[transform,background-color,opacity] duration-150",
                    m.built
                      ? "border-card bg-muted text-primary-fg"
                      : "border-card bg-primary text-primary-fg",
                    active && "scale-110 ring-2 ring-sun",
                    dim && "opacity-40",
                  )}
                >
                  {m.n}
                </span>
              </Link>
            );
          })}
        </Basemap>

        <ol className="divide-y divide-border border-t border-border lg:border-l lg:border-t-0">
          {located.map((proj) => {
            const mark = markBySlug.get(proj.slug);
            const off = !mark;
            const active = hover === proj.slug;
            const dim = isDim(proj.slug) && !active;
            return (
              <li key={proj.slug}>
                <Link
                  to="/developments/$slug"
                  params={{ slug: proj.slug }}
                  onMouseEnter={() => setHover(proj.slug)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(proj.slug)}
                  onBlur={() => setHover(null)}
                  className={cn(
                    "flex min-h-11 gap-3 px-4 py-3 transition-colors duration-150",
                    active ? "bg-accent" : "hover:bg-secondary/60",
                    dim && "opacity-40",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      off
                        ? "bg-secondary text-muted"
                        : proj.status === "built_out"
                          ? "bg-muted text-primary-fg"
                          : "bg-primary text-primary-fg",
                    )}
                  >
                    {off ? "—" : mark.n}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium leading-tight">{proj.name}</span>
                    <span className="mt-0.5 block text-xs text-muted">{proj.area}</span>
                    <span className="mt-0.5 block font-mono text-xs tabular-nums text-subtle">
                      {proj.lat != null && proj.lng != null
                        ? `${proj.lat.toFixed(4)}°N  ${Math.abs(proj.lng).toFixed(4)}°W`
                        : null}{" "}
                      · {STATUS_META[proj.status].label}
                      {off ? " · west of this frame" : ""}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2 text-xs uppercase tracking-[0.12em] text-subtle">
        <span>Basemap © OpenStreetMap contributors · CARTO</span>
        <a
          className="underline underline-offset-2 hover:text-primary"
          href="https://www.openstreetmap.org/#map=13/29.656/-81.605"
          target="_blank"
          rel="noreferrer"
        >
          OpenStreetMap
        </a>
      </p>
    </div>
  );
}
