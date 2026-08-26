import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand/mark";
import { RiverDivider } from "@/components/brand/river-divider";
import { DISCLOSURE } from "@/lib/constants";
import { formatDateShort } from "@/lib/format";

const LINKS = [
  { to: "/developments" as const, label: "Developments" },
  { to: "/guide" as const, label: "Living guide" },
  { to: "/whats-new" as const, label: "What's new" },
  { to: "/about" as const, label: "Sources & method" },
];

export function SiteFooter({ lastUpdated }: { lastUpdated?: string | null }) {
  return (
    <footer className="mt-auto border-t border-border bg-bg-sunken">
      <RiverDivider className="text-primary/50" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-2.5">
            <BrandMark className="size-8" />
            <div>
              <p className="font-display text-xl font-semibold leading-none">Palatka</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-muted">
                Homes Report
              </p>
            </div>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Independent coverage of housing in Palatka, East Palatka, and Putnam County. Not the
            county, not a builder, not a brokerage.
          </p>
        </div>
        <div className="text-sm">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Sections</p>
          <ul className="mt-3 space-y-2">
            {LINKS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-sm">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            Last checked
          </p>
          <p className="mt-3 font-display text-2xl font-semibold tabular-nums text-fg">
            {formatDateShort(lastUpdated)}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-subtle">{DISCLOSURE}</p>
        </div>
      </div>
      <div className="flex h-1.5">
        <div className="w-16 bg-sun" />
        <div className="flex-1 bg-primary" />
      </div>
    </footer>
  );
}
