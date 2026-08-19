export function MapEmbed({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const delta = 0.035;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-bg-sunken">
      <iframe
        title={`Map of ${label}`}
        src={src}
        className="h-64 w-full border-0 md:h-80"
        loading="lazy"
      />
      <figcaption className="px-3 py-2 text-xs text-muted">
        {label}.{" "}
        <a
          className="underline underline-offset-2 hover:text-primary"
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=13/${lat}/${lng}`}
          target="_blank"
          rel="noreferrer"
        >
          Open in OpenStreetMap
        </a>
      </figcaption>
    </figure>
  );
}
