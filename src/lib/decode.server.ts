import { EXISTING_MARKET_SLUGS } from "@/lib/constants";
import type { DecodeNearby, DecodeResult, Jurisdiction } from "@/lib/decode";
import type { Project } from "@/lib/types";

const UA = "PalatkaHomesReport/1.0 (civic housing report; https://www.palatkahomesreport.com/)";

function normalize(raw: string): string {
  let q = raw.replace(/\s+/g, " ").trim();
  if (!q) return q;
  if (!/\b(FL|Fla\.?|Florida)\b/i.test(q)) q += ", FL";
  return q;
}

function miles(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 3958.8;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const h =
    s1 * s1 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * s2 * s2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

async function getJson(url: string, ms = 8000): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/json", "User-Agent": UA },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

type GeoHit = {
  matched: string;
  lat: number;
  lng: number;
  county: string | null;
  place: string | null;
  subdivision: string | null;
  source: string;
};

function firstName(geos: Record<string, unknown>, key: string): string | null {
  const list = geos[key];
  if (!Array.isArray(list) || !list[0] || typeof list[0] !== "object") return null;
  const name = (list[0] as { NAME?: string }).NAME;
  return name || null;
}

function fromCensusGeos(geos: Record<string, unknown>, matched: string, lat: number, lng: number, source: string): GeoHit {
  return {
    matched,
    lat,
    lng,
    county: firstName(geos, "Counties"),
    place: firstName(geos, "Incorporated Places"),
    subdivision: firstName(geos, "County Subdivisions"),
    source,
  };
}

async function censusAddress(q: string): Promise<GeoHit | null> {
  const params = new URLSearchParams({
    address: q,
    benchmark: "Public_AR_Current",
    vintage: "Current_Current",
    format: "json",
  });
  const data = (await getJson(
    `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?${params}`,
  )) as {
    result?: {
      addressMatches?: Array<{
        matchedAddress?: string;
        coordinates?: { x: number; y: number };
        geographies?: Record<string, unknown>;
      }>;
    };
  };
  const m = data.result?.addressMatches?.[0];
  if (!m?.coordinates) return null;
  return fromCensusGeos(
    m.geographies ?? {},
    m.matchedAddress || q,
    m.coordinates.y,
    m.coordinates.x,
    "U.S. Census Bureau geocoder",
  );
}

async function censusReverse(lat: number, lng: number, matched: string): Promise<GeoHit | null> {
  const params = new URLSearchParams({
    x: String(lng),
    y: String(lat),
    benchmark: "Public_AR_Current",
    vintage: "Current_Current",
    format: "json",
  });
  const data = (await getJson(
    `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?${params}`,
  )) as { result?: { geographies?: Record<string, unknown> } };
  const geos = data.result?.geographies;
  if (!geos) return null;
  return fromCensusGeos(geos, matched, lat, lng, "OpenStreetMap Nominatim + Census reverse");
}

async function nominatim(q: string): Promise<{ lat: number; lng: number; display: string; village?: string } | null> {
  const params = new URLSearchParams({
    q,
    format: "json",
    addressdetails: "1",
    limit: "1",
    countrycodes: "us",
  });
  const data = (await getJson(`https://nominatim.openstreetmap.org/search?${params}`)) as Array<{
    lat?: string;
    lon?: string;
    display_name?: string;
    address?: { village?: string; hamlet?: string; town?: string; city?: string };
  }>;
  const m = data?.[0];
  if (!m?.lat || !m?.lon) return null;
  return {
    lat: Number(m.lat),
    lng: Number(m.lon),
    display: m.display_name || q,
    village: m.address?.village || m.address?.hamlet,
  };
}

async function femaZone(lat: number, lng: number): Promise<string | null> {
  const params = new URLSearchParams({
    geometry: `${lng},${lat}`,
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "FLD_ZONE,ZONE_SUBTY,SFHA_TF",
    returnGeometry: "false",
    f: "json",
  });
  try {
    const data = (await getJson(
      `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query?${params}`,
      4000,
    )) as { features?: Array<{ attributes?: { FLD_ZONE?: string; SFHA_TF?: string; ZONE_SUBTY?: string } }> };
    const a = data.features?.[0]?.attributes;
    if (!a?.FLD_ZONE) return null;
    const bits = [a.FLD_ZONE, a.ZONE_SUBTY, a.SFHA_TF === "T" ? "SFHA" : null].filter(Boolean);
    return bits.join(" · ");
  } catch {
    return null;
  }
}

function jurisdictionOf(hit: GeoHit, village?: string): { id: Jurisdiction; label: string } {
  const county = (hit.county || "").toLowerCase();
  const place = (hit.place || "").toLowerCase();
  const sub = (hit.subdivision || "").toLowerCase();
  const vil = (village || "").toLowerCase();
  if (county && !county.includes("putnam")) {
    return { id: "outside", label: hit.county || "Outside Putnam County" };
  }
  if (place.includes("palatka")) {
    return { id: "palatka-city", label: "City of Palatka" };
  }
  if (sub.includes("east palatka") || vil.includes("east palatka")) {
    return { id: "east-palatka", label: "East Palatka — unincorporated Putnam" };
  }
  if (county.includes("putnam") || !county) {
    return { id: "putnam-unincorporated", label: "Unincorporated Putnam County" };
  }
  return { id: "outside", label: hit.county || "Outside Putnam County" };
}

function nearbyOf(hit: GeoHit, projects: Project[]): DecodeNearby[] {
  return projects
    .filter((p) => p.lat != null && p.lng != null && !EXISTING_MARKET_SLUGS.has(p.slug))
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      status: p.status,
      miles: miles(hit, { lat: p.lat as number, lng: p.lng as number }),
      locationLabel: p.locationLabel,
    }))
    .filter((p) => p.miles <= 20)
    .sort((a, b) => a.miles - b.miles)
    .slice(0, 4);
}

export async function decodeStreet(raw: string, projects: Project[]): Promise<DecodeResult> {
  const input = raw.trim();
  const q = normalize(input);
  let hit: GeoHit | null = null;
  let village: string | undefined;
  const sources: string[] = [];

  try {
    hit = await censusAddress(q);
  } catch {
    hit = null;
  }

  if (!hit) {
    try {
      const nom = await nominatim(q);
      if (nom) {
        village = nom.village;
        hit = await censusReverse(nom.lat, nom.lng, nom.display);
        if (!hit) {
          hit = {
            matched: nom.display,
            lat: nom.lat,
            lng: nom.lng,
            county: "Putnam County",
            place: null,
            subdivision: village || null,
            source: "OpenStreetMap Nominatim",
          };
        }
      }
    } catch {
      /* fall through */
    }
  }

  if (!hit) {
    return {
      input,
      matched: "",
      lat: 0,
      lng: 0,
      county: null,
      place: null,
      subdivision: null,
      jurisdiction: "outside",
      jurisdictionLabel: "No match",
      water: { label: "—", detail: "" },
      electric: { label: "—", detail: "" },
      flood: { label: "—", detail: "" },
      school: { label: "—", detail: "" },
      nearby: [],
      sources: [],
      error:
        "The Census geocoder could not match that. Use a house number and street, then Palatka or East Palatka, FL.",
    };
  }

  sources.push(hit.source);
  const jur = jurisdictionOf(hit, village);
  const zone = await femaZone(hit.lat, hit.lng);
  if (zone) sources.push("FEMA National Flood Hazard Layer");

  const femaUrl = `https://msc.fema.gov/portal/search?AddressQuery=${encodeURIComponent(hit.matched)}`;
  const city = jur.id === "palatka-city";

  const water = city
    ? {
        label: "City water / sewer is the default",
        detail:
          "Inside Palatka city limits, expect municipal water and sewer. Confirm the tap with city utilities before you assume a connection on a vacant lot.",
        href: "https://www.palatka-fl.gov/",
        hrefLabel: "City of Palatka",
      }
    : {
        label: "Well and septic until proven otherwise",
        detail:
          "Unincorporated East Palatka and most of Putnam still run on private wells and septic, especially older lots. New PUDs may propose central systems — that is engineering, not a tap today.",
        href: "https://www.putnam-fl.gov/",
        hrefLabel: "Putnam County",
      };

  const electric = {
    label: "Clay Electric or FPL — look up the street",
    detail: city
      ? "Both serve Putnam. Territory is by power line, not by the word Palatka. Call Clay (386) 328-1432 or FPL 1-800-226-3545 with the matched address."
      : "East Palatka lots go either way. Clay Electric’s Palatka office is 300 N. State Road 19. FPL has an address lookup. Do not guess from the listing.",
    href: "https://www.clayelectric.com/",
    hrefLabel: "Clay Electric",
  };

  const flood = zone
    ? {
        label: `FEMA layer: ${zone}`,
        detail:
          "That is a map layer, not a flood-insurance determination. Pull the Map Service Center for the exact parcel, then get a Florida quote.",
        href: femaUrl,
        hrefLabel: "FEMA Map Service Center",
      }
    : {
        label: "Pull the FEMA map for this parcel",
        detail:
          "You are on a major Florida river. Neighborhood names and PUD boards are not a flood zone. Open FEMA’s Map Service Center with the matched address.",
        href: femaUrl,
        hrefLabel: "FEMA Map Service Center",
      };

  const school = {
    label: "Putnam County School District locator",
    detail: city
      ? "Palatka Jr.-Sr. High is the main secondary campus. Elementary follows the street, not the marketing name. Run the district locator."
      : "East Palatka is still Putnam Schools. Assignment is by street address. Do not trust a Facebook group or a builder map.",
    href: "https://www.putnamschools.org/",
    hrefLabel: "putnamschools.org",
  };

  return {
    input,
    matched: hit.matched,
    lat: hit.lat,
    lng: hit.lng,
    county: hit.county,
    place: hit.place,
    subdivision: hit.subdivision,
    jurisdiction: jur.id,
    jurisdictionLabel: jur.label,
    water,
    electric,
    flood,
    school,
    nearby: nearbyOf(hit, projects),
    sources,
  };
}
