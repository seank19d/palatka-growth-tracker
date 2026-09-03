import type { LucideIcon } from "lucide-react";
import {
  Bandage,
  BatteryCharging,
  BedDouble,
  Bug,
  Cable,
  Droplets,
  Fan,
  Flame,
  FlaskConical,
  Grid2x2,
  Lamp,
  Package,
  Radio,
  Refrigerator,
  Shield,
  ShoppingBag,
  SunMedium,
  Wifi,
  Wrench,
} from "lucide-react";
import { DISCLOSURE } from "@/lib/constants";
import type { AffiliateProduct } from "@/lib/types";

const THUMBS: Record<string, LucideIcon> = {
  "Heavy-duty moving boxes": Package,
  "Packing tape (multi-pack)": Package,
  "Moving blankets": Package,
  "Stretch wrap": Package,
  "First-aid kit": Bandage,
  "Basic home tool kit": Wrench,
  "Mattress protector (waterproof)": BedDouble,
  Dehumidifier: Droplets,
  "Box fan / air circulator": Fan,
  "Outdoor all-weather rug": Grid2x2,
  "Gas or charcoal grill": Flame,
  "Garden hose and nozzle": Droplets,
  "Hurricane supply kit": Radio,
  "LED flashlights and lanterns": Lamp,
  "Mosquito treatment for yards": Bug,
  "Window solar film": SunMedium,
  "Portable power station": BatteryCharging,
  "Drinking water containers": Droplets,
  "Carbon monoxide detector": Shield,
  "Heavy-duty extension cord": Cable,
  "Well water test kit": FlaskConical,
  "AA batteries (bulk)": BatteryCharging,
  Cooler: Refrigerator,
  "Heavy-duty tarp": Package,
  "Closet moisture absorbers": Droplets,
  "Indoor humidity meter": Droplets,
  "Whole-house sediment filter": FlaskConical,
  "Under-sink water filter": Droplets,
  "Mesh Wi-Fi system": Wifi,
  "UPS battery backup for modem": BatteryCharging,
  "Cat 6 ethernet cable": Cable,
  "LED desk lamp": Lamp,
  "Patio mosquito repeller": Bug,
  "Caulk and caulk gun": Wrench,
  "Outlet tester": Wrench,
  "Painter's tape": Package,
  "Step stool": Package,
};

function logClick(id: number) {
  try {
    const body = new Blob([JSON.stringify({ id })], { type: "application/json" });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/affiliate/click", body);
    else void fetch("/api/affiliate/click", { method: "POST", body, keepalive: true });
  } catch {
    /* click still goes to Amazon */
  }
}

function ProductThumb({ title }: { title: string }) {
  const Icon = THUMBS[title] ?? ShoppingBag;
  return (
    <span
      className="flex size-[72px] shrink-0 items-center justify-center rounded-sm border border-border bg-secondary text-primary"
      aria-hidden
    >
      <Icon className="size-8" strokeWidth={1.5} />
    </span>
  );
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
              <ProductThumb title={p.title} />
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
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-subtle">{DISCLOSURE}</p>
    </aside>
  );
}
