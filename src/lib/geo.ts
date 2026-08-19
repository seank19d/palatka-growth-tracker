/** Putnam County, Florida — map frame used by the locator. */
export const PUTNAM = {
  west: -82.12,
  east: -81.36,
  north: 29.92,
  south: 29.26,
} as const;

function densify(ring: Array<[number, number]>, maxStep = 0.04): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let i = 0; i < ring.length - 1; i += 1) {
    const [x0, y0] = ring[i];
    const [x1, y1] = ring[i + 1];
    out.push([x0, y0]);
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const n = Math.max(0, Math.ceil(dist / maxStep) - 1);
    for (let k = 1; k <= n; k += 1) {
      const t = k / (n + 1);
      out.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]);
    }
  }
  out.push(ring[ring.length - 1]);
  return out;
}

/** Census-simplified Putnam County boundary (lon, lat), closed, then densified. */
const PUTNAM_RING: Array<[number, number]> = [
  [-81.52387, 29.63154],
  [-81.52366, 29.62243],
  [-81.5206, 29.50025],
  [-81.47879, 29.39905],
  [-81.43399, 29.39855],
  [-81.45089, 29.37846],
  [-81.50799, 29.36451],
  [-81.52176, 29.36219],
  [-81.54087, 29.35656],
  [-81.56119, 29.35169],
  [-81.6809, 29.32443],
  [-81.74142, 29.37105],
  [-81.77621, 29.48745],
  [-81.84301, 29.521],
  [-82.0559, 29.47123],
  [-82.05503, 29.66961],
  [-82.05029, 29.70973],
  [-82.05563, 29.71823],
  [-82.04924, 29.71867],
  [-81.93943, 29.7475],
  [-81.79722, 29.83665],
  [-81.58121, 29.84018],
  [-81.52523, 29.7595],
  [-81.52387, 29.63154],
];

export const PUTNAM_OUTLINE = densify(PUTNAM_RING, 0.035);

/** St. Johns River centerline through Putnam, south → north (lon, lat). */
export const ST_JOHNS_RIVER: Array<[number, number]> = [
  [-81.705, 29.3],
  [-81.692, 29.36],
  [-81.678, 29.43],
  [-81.671, 29.481],
  [-81.662, 29.54],
  [-81.648, 29.6],
  [-81.637, 29.648],
  [-81.642, 29.69],
  [-81.658, 29.74],
  [-81.675, 29.8],
  [-81.685, 29.9],
];

export const TOWNS = [
  { name: "Palatka", lat: 29.6486, lng: -81.6376, seat: true, dx: -86, dy: 14 },
  { name: "East Palatka", lat: 29.65, lng: -81.598, seat: false, dx: 16, dy: 16 },
  { name: "Interlachen", lat: 29.6227, lng: -81.891, seat: false, dx: 8, dy: -10 },
  { name: "Crescent City", lat: 29.43, lng: -81.511, seat: false, dx: 12, dy: 14 },
  { name: "Welaka", lat: 29.481, lng: -81.672, seat: false, dx: -52, dy: 4 },
] as const;

export const HIGHWAYS = [
  {
    name: "SR 20",
    pts: [
      [-82.08, 29.623],
      [-81.891, 29.623],
      [-81.76, 29.64],
      [-81.637, 29.65],
      [-81.52, 29.652],
    ] as Array<[number, number]>,
    labelAt: [-81.89, 29.623] as [number, number],
    ldx: 6,
    ldy: -8,
  },
  {
    name: "SR 207",
    pts: [
      [-81.637, 29.65],
      [-81.6, 29.656],
      [-81.569, 29.662],
      [-81.5, 29.69],
      [-81.4, 29.73],
    ] as Array<[number, number]>,
    labelAt: [-81.48, 29.7] as [number, number],
    ldx: 6,
    ldy: -6,
  },
  {
    name: "US 17",
    pts: [
      [-81.685, 29.9],
      [-81.66, 29.78],
      [-81.637, 29.65],
      [-81.64, 29.55],
      [-81.655, 29.42],
    ] as Array<[number, number]>,
    labelAt: [-81.66, 29.78] as [number, number],
    ldx: -36,
    ldy: 4,
  },
] as const;

export function project(
  lng: number,
  lat: number,
  width: number,
  height: number,
): { x: number; y: number } {
  return {
    x: ((lng - PUTNAM.west) / (PUTNAM.east - PUTNAM.west)) * width,
    y: ((PUTNAM.north - lat) / (PUTNAM.north - PUTNAM.south)) * height,
  };
}

export function polyline(
  pts: Array<[number, number]>,
  width: number,
  height: number,
  close = false,
): string {
  const d = pts
    .map(([lng, lat], i) => {
      const { x, y } = project(lng, lat, width, height);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
  return close ? `${d} Z` : d;
}

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
