import { tilesForView, viewSize, type MapView } from "@/lib/geo";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Basemap({
  view,
  className,
  children,
}: {
  view: MapView;
  className?: string;
  children?: ReactNode;
}) {
  const tiles = tilesForView(view);
  const size = viewSize(view);

  return (
    <div
      className={cn("relative overflow-hidden bg-bg-sunken", className)}
      style={{ aspectRatio: `${size.width} / ${size.height}` }}
    >
      <div className="absolute inset-0">
        {tiles.map((t) => (
          <img
            key={t.key}
            src={t.src}
            alt=""
            draggable={false}
            className="absolute max-w-none select-none"
            style={{
              left: `${t.left}%`,
              top: `${t.top}%`,
              width: `${t.width}%`,
              height: `${t.height}%`,
            }}
          />
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{ backgroundColor: "color-mix(in oklab, var(--color-bg) 16%, transparent)" }}
        aria-hidden
      />
      {children}
    </div>
  );
}
