import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand/mark";
import { DISCLOSURE } from "@/lib/constants";
import { formatDateShort } from "@/lib/format";

export function SiteFooter({ lastUpdated }: { lastUpdated?: string | null }) {
  return (
    <footer className="mt-auto border-t border-border bg-bg-sunken">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark className="size-9" />
            <div>
              <p className="font-display text-xl font-semibold leading-none">Palatka</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Sections</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/developments" className="hover:text-primary">
                Developments
              </Link>
            </li>
            <li>
              <Link to="/guide" className="hover:text-primary">
                Living guide
              </Link>
            </li>
            <li>
              <Link to="/whats-new" className="hover:text-primary">
                What's new
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary">
                Sources & method
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Last public update
          </p>
          <p className="mt-3 text-fg">{formatDateShort(lastUpdated)}</p>
          <p className="mt-4 text-xs leading-relaxed text-subtle">{DISCLOSURE}</p>
        </div>
      </div>
    </footer>
  );
}
