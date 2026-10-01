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
import { AMAZON_NOREWRITE_CLASS } from "@/lib/amazon";
import { SHORT_AFFILIATE_DISCLOSURE } from "@/lib/constants";
import type { AffiliateProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

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

export function logClick(id: number) {
  try {
    const body = new Blob([JSON.stringify({ id })], { type: "application/json" });
    if (navigator.sendBeacon?.("/api/affiliate/click", body)) return;
    void fetch("/api/affiliate/click", { method: "POST", body, keepalive: true }).catch(() => {});
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
  heading = "Shop essentials for this guide",
  note,
  grid = false,
}: {
  products: AffiliateProduct[];
  heading?: string;
  note?: string;
  grid?: boolean;
}) {
  if (!products.length) return null;
  return (
    <aside className={cn(AMAZON_NOREWRITE_CLASS, "phr-commerce")}>
      <h2 className="phr-commerce-heading"><ShoppingBag size={20} aria-hidden />{heading}</h2>
      {note && <p className="phr-commerce-note">{note}</p>}
      <p className="phr-commerce-disclosure">{SHORT_AFFILIATE_DISCLOSURE}</p>
      <ul className={cn("phr-product-list", grid && "phr-product-grid")}>
        {products.map((p) => (
          <li key={p.id}>
            <a href={p.url} target="_blank" rel="noopener noreferrer sponsored"
              onClick={() => logClick(p.id)}
              className={cn(AMAZON_NOREWRITE_CLASS, "phr-product-link")}
              aria-label={`${p.title}: see options on Amazon (opens in a new tab)`}>
              <ProductThumb title={p.title} />
              <span className="phr-product-copy">
                <span className="phr-product-title">{p.title}</span>
                <span className="phr-product-benefit">{p.blurb}</span>
                <span className="phr-product-action">See options on Amazon <span aria-hidden>↗</span></span>
                <span className="phr-product-detail">Compare current prices &amp; availability</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="phr-commerce-note">Links open Amazon in a new tab. Choose an option and complete your purchase there. Items are sold separately; prices and availability may change.</p>
    </aside>
  );
}
