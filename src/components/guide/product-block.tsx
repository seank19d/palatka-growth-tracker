import { ExternalLink } from "lucide-react";
import { DISCLOSURE } from "@/lib/constants";
import type { AffiliateProduct } from "@/lib/types";

export function ProductBlock({
  products,
  heading = "Useful for this page",
}: {
  products: AffiliateProduct[];
  heading?: string;
}) {
  if (!products.length) return null;
  return (
    <aside className="rounded-xl border border-border bg-card p-5 md:p-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">{heading}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {products.map((p) => (
          <li key={p.id}>
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer sponsored"
              className="flex h-full flex-col rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary/40"
            >
              <span className="flex items-start justify-between gap-2 font-medium">
                {p.title}
                <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-subtle" />
              </span>
              <span className="mt-1 text-sm leading-relaxed text-muted">{p.blurb}</span>
              <span className="mt-3 text-xs text-primary">View on Amazon</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-subtle">{DISCLOSURE}</p>
    </aside>
  );
}
