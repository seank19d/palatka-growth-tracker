import { ExternalLink } from "lucide-react";
import type { OfficialLink, Project } from "@/lib/types";

const SHARED: OfficialLink[] = [
  {
    label: "Putnam County Property Appraiser",
    url: "https://pa.putnam-fl.com/",
  },
  {
    label: "Putnam County School District locator",
    url: "https://www.putnamschools.org/",
  },
];

function dedupe(links: OfficialLink[]): OfficialLink[] {
  const seen = new Set<string>();
  const out: OfficialLink[] = [];
  for (const l of links) {
    const key = l.url.replace(/\/$/, "").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(l);
  }
  return out;
}

export function OfficialSources({ project }: { project: Project }) {
  const links = dedupe([...project.officialLinks, ...SHARED]);
  if (!links.length) return null;

  return (
    <section className="mt-8" aria-label="Official sources">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-2xl font-semibold">Verify yourself</h2>
          <p className="mt-1 text-base text-muted">
            County and agency pages win if anything here disagrees.
          </p>
        </div>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.url}>
            <a
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 border border-border bg-card px-4 py-3 text-base font-medium text-fg transition-colors hover:border-primary/40 hover:bg-secondary/50"
            >
              <span>{l.label}</span>
              <ExternalLink className="size-3.5 shrink-0 text-subtle" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
