import { cartoTileUrl, latToTile, lngToTile } from "@/lib/geo";

const ZOOM = 14;
const COLS = 3;
const ROWS = 3;

export function MapEmbed({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const xf = lngToTile(lng, ZOOM);
  const yf = latToTile(lat, ZOOM);
  const x0 = Math.floor(xf) - 1;
  const y0 = Math.floor(yf) - 1;
  const leftPct = ((xf - x0) / COLS) * 100;
  const topPct = ((yf - y0) / ROWS) * 100;
  const n = Math.abs(lat).toFixed(5);
  const w = Math.abs(lng).toFixed(5);

  const tiles: Array<{ key: string; src: string }> = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const x = x0 + col;
      const y = y0 + row;
      tiles.push({ key: `${x}-${y}`, src: cartoTileUrl(ZOOM, x, y) });
    }
  }

  return (
    <figure className="overflow-hidden rounded-md bg-card shadow-[var(--shadow-border)]">
      <div className="flex items-baseline justify-between gap-3 border-b border-border px-3 py-2">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Site location</p>
        <p className="font-mono text-xs tabular-nums text-subtle">
          {n}°N {w}°W
        </p>
      </div>
      <div className="relative aspect-square overflow-hidden bg-bg-sunken md:aspect-[4/3]">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {tiles.map((t) => (
            <img
              key={t.key}
              src={t.src}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          ))}
        </div>
        <div
          className="pointer-events-none absolute z-10"
          style={{ left: `${leftPct}%`, top: `${topPct}%`, transform: "translate(-50%, -100%)" }}
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
      </div>
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
