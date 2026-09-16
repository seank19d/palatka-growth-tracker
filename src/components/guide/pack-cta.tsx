import { ExternalLink } from "lucide-react";
import { DISCLOSURE } from "@/lib/constants";
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

export type PackCtaCopy = {
  heading: string;
  note: string;
};

/** End-of-page pack with three individual Amazon product links (no multi-cart). */
export function PackCta({
  heading,
  note,
  products,
}: PackCtaCopy & { products: AffiliateProduct[] }) {
  if (!products.length) return null;
  return (
    <aside className="border border-border bg-card p-5 md:p-6">
      <h2 className="font-display text-2xl font-semibold leading-tight">{heading}</h2>
      <p className="mt-2 text-base leading-relaxed text-muted">{note}</p>
      <h3
        id="pack-amazon-picks"
        className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-primary px-5 text-base font-medium text-primary-fg"
      >
        Open Amazon picks
      </h3>
      <ul
        className="mt-4 divide-y divide-border border-t border-border"
        aria-labelledby="pack-amazon-picks"
      >
        {products.map((p) => (
          <li key={p.id}>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => logClick(p.id)}
              className="flex items-center justify-between gap-3 py-3 hover:bg-secondary/40"
            >
              <span className="min-w-0">
                <span className="block font-medium">{p.title}</span>
                <span className="mt-0.5 block text-sm text-muted">Open on Amazon</span>
              </span>
              <ExternalLink className="size-4 shrink-0 text-primary" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-subtle">{DISCLOSURE}</p>
    </aside>
  );
}
