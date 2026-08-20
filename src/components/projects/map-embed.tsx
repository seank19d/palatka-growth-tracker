import { fitMapView, lngLatToPercent } from "@/lib/geo";
import { Basemap } from "./basemap";

export function MapEmbed({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const view = fitMapView(
    {
      west: lng - 0.016,
      east: lng + 0.016,
      north: lat + 0.011,
      south: lat - 0.011,
    },
    640,
  );
  const pin = lngLatToPercent(lng, lat, view);
  const n = Math.abs(lat).toFixed(5);
  const w = Math.abs(lng).toFixed(5);

  return (
    <figure className="overflow-hidden rounded-md bg-card shadow-[var(--shadow-border)]">
      <div className="flex items-baseline justify-between gap-3 border-b border-border px-3 py-2">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Site location</p>
        <p className="font-mono text-xs tabular-nums text-subtle">
          {n}°N {w}°W
        </p>
      </div>
      <Basemap view={view}>
        <div
          className="pointer-events-none absolute z-10"
          style={{
            left: `${pin.x}%`,
            top: `${pin.y}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <svg width="28" height="36" viewBox="0 0 28 36" aria-hidden>
            <path
              d="M14 1.5c6.4 0 11.5 5.1 11.5 11.4 0 8.4-11.5 21-11.5 21S2.5 21.3 2.5 12.9C2.5 6.6 7.6 1.5 14 1.5z"
              className="fill-primary stroke-primary-fg"
              strokeWidth="1.4"
            />
            <circle cx="14" cy="13" r="3.4" className="fill-primary-fg" />
          </svg>
        </div>
      </Basemap>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-xs text-muted">
        <span>{label}</span>
        <a
          className="underline underline-offset-2 hover:text-primary"
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`}
          target="_blank"
          rel="noreferrer"
        >
          OpenStreetMap
        </a>
      </figcaption>
    </figure>
  );
}
