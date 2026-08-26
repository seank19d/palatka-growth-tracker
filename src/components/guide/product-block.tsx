import { ShoppingBag } from "lucide-react";
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
    <aside className="border border-border bg-card p-5 md:p-6">
      <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted">
        <ShoppingBag className="size-3.5 text-primary" strokeWidth={1.75} />
        {heading}
      </p>
      <ul className="mt-4 divide-y divide-border border-t border-border">
        {products.map((p) => (
          <li key={p.id}>
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer sponsored"
              className="flex flex-col py-3 hover:bg-secondary/40 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span>
                <span className="block font-medium">{p.title}</span>
                <span className="mt-1 block text-base leading-relaxed text-muted">{p.blurb}</span>
              </span>
              <span className="mt-2 shrink-0 text-xs text-primary sm:mt-0">Amazon</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-subtle">{DISCLOSURE}</p>
    </aside>
  );
}
