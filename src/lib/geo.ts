export function lngToTile(lng: number, zoom: number): number {
  return ((lng + 180) / 360) * 2 ** zoom;
}

export function latToTile(lat: number, zoom: number): number {
  const rad = (lat * Math.PI) / 180;
  return (
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** zoom
  );
}

export function cartoTileUrl(z: number, x: number, y: number): string {
  const host = ["a", "b", "c", "d"][(x + y) % 4];
  return `https://${host}.basemaps.cartocdn.com/light_all/${z}/${x}/${y}@2x.png`;
}

/** Guest-first frame: Palatka, the river, East Palatka, SR 207. */
export const PALATKA_FRAME = {
  west: -81.685,
  east: -81.525,
  north: 29.705,
  south: 29.618,
} as const;

export type GeoBounds = {
  west: number;
  east: number;
  north: number;
  south: number;
};

export type MapView = GeoBounds & { zoom: number };

const TILE_PX = 256;

function round(n: number, digits = 4): number {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

export function mercatorPx(lng: number, lat: number, zoom: number): { x: number; y: number } {
  const scale = TILE_PX * 2 ** zoom;
  const x = ((lng + 180) / 360) * scale;
  const sin = Math.sin((lat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale;
  return { x, y };
}

export function boundsFromPoints(
  points: Array<{ lat: number; lng: number }>,
  min: GeoBounds = PALATKA_FRAME,
): GeoBounds {
  let { west, east, north, south } = min;
  for (const p of points) {
    west = Math.min(west, p.lng);
    east = Math.max(east, p.lng);
    north = Math.max(north, p.lat);
    south = Math.min(south, p.lat);
  }
  return { west, east, north, south };
}

export function padBounds(b: GeoBounds, fraction = 0.08): GeoBounds {
  const padX = (b.east - b.west) * fraction;
  const padY = (b.north - b.south) * fraction;
  return {
    west: b.west - padX,
    east: b.east + padX,
    north: b.north + padY,
    south: b.south - padY,
  };
}

export function fitMapView(bounds: GeoBounds, targetWidth = 720): MapView {
  const padded = padBounds(bounds, 0.08);
  let zoom = 10;
  for (let z = 14; z >= 10; z -= 1) {
    const nw = mercatorPx(padded.west, padded.north, z);
    const se = mercatorPx(padded.east, padded.south, z);
    if (se.x - nw.x <= targetWidth * 1.6) {
      zoom = z;
      break;
    }
  }
  return { ...padded, zoom };
}

export function viewSize(view: MapView): { width: number; height: number } {
  const nw = mercatorPx(view.west, view.north, view.zoom);
  const se = mercatorPx(view.east, view.south, view.zoom);
  return { width: round(se.x - nw.x, 3), height: round(se.y - nw.y, 3) };
}

export function lngLatToPercent(lng: number, lat: number, view: MapView): { x: number; y: number } {
  const nw = mercatorPx(view.west, view.north, view.zoom);
  const size = viewSize(view);
  const p = mercatorPx(lng, lat, view.zoom);
  return {
    x: round(((p.x - nw.x) / size.width) * 100),
    y: round(((p.y - nw.y) / size.height) * 100),
  };
}

export function scaleBarMiles(view: MapView): { miles: number; widthPct: number } {
  const midLat = (view.north + view.south) / 2;
  const mapMiles = (view.east - view.west) * 69.172 * Math.cos((midLat * Math.PI) / 180);
  const target = mapMiles * 0.2;
  const options = [0.5, 1, 2, 5, 10];
  const miles = options.reduce((best, n) =>
    Math.abs(n - target) < Math.abs(best - target) ? n : best,
  );
  return { miles, widthPct: round((miles / mapMiles) * 100, 2) };
}

export function tilesForView(view: MapView): Array<{
  key: string;
  left: number;
  top: number;
  width: number;
  height: number;
  src: string;
}> {
  const nw = mercatorPx(view.west, view.north, view.zoom);
  const size = viewSize(view);
  const x0 = Math.floor(nw.x / TILE_PX);
  const y0 = Math.floor(nw.y / TILE_PX);
  const x1 = Math.floor((nw.x + size.width - 0.001) / TILE_PX);
  const y1 = Math.floor((nw.y + size.height - 0.001) / TILE_PX);
  const max = 2 ** view.zoom;
  const tiles: Array<{
    key: string;
    left: number;
    top: number;
    width: number;
    height: number;
    src: string;
  }> = [];
  for (let y = y0; y <= y1; y += 1) {
    if (y < 0 || y >= max) continue;
    for (let x = x0; x <= x1; x += 1) {
      const xx = ((x % max) + max) % max;
      tiles.push({
        key: `${view.zoom}-${xx}-${y}`,
        left: round(((x * TILE_PX - nw.x) / size.width) * 100),
        top: round(((y * TILE_PX - nw.y) / size.height) * 100),
        width: round((TILE_PX / size.width) * 100),
        height: round((TILE_PX / size.height) * 100),
        src: cartoTileUrl(view.zoom, xx, y),
      });
    }
  }
  return tiles;
}
