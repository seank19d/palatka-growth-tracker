import { ShoppingBag } from "lucide-react";
import { DISCLOSURE } from "@/lib/constants";
import { amazonImpressionPixel } from "@/lib/amazon";
import type { AffiliateProduct } from "@/lib/types";

function logClick(id: number) {
  try {
    const body = new Blob([JSON.stringify({ id })], { type: "application/json" });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/affiliate/click", body);
    else void fetch("/api/affiliate/click", { method: "POST", body, keepalive: true });
  } catch {
    /* click still goes to Amazon */
  }
}

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
      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        <ShoppingBag className="size-3.5 text-primary" strokeWidth={1.75} />
        {heading}
      </p>
      <ul className="mt-4 divide-y divide-border border-t border-border">
        {products.map((p) => (
          <li key={p.id}>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => logClick(p.id)}
              className="flex gap-4 py-3 hover:bg-secondary/40 sm:items-center"
            >
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt=""
                  width={72}
                  height={72}
                  className="size-[72px] shrink-0 rounded-sm border border-border bg-secondary object-contain p-1"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : null}
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{p.title}</span>
                <span className="mt-1 block text-base leading-relaxed text-muted">{p.blurb}</span>
                {p.priceLabel ? (
                  <span className="mt-1 block text-sm tabular-nums text-fg">{p.priceLabel}</span>
                ) : null}
              </span>
              <span className="mt-1 shrink-0 self-start text-sm font-medium text-primary sm:mt-0">
                Amazon
              </span>
            </a>
            {p.asin ? (
              <img src={amazonImpressionPixel(p.asin)} alt="" width={1} height={1} className="sr-only" />
            ) : null}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-subtle">{DISCLOSURE}</p>
    </aside>
  );
}
