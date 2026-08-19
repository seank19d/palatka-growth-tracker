import {
  CircleDollarSign,
  Coffee,
  HeartPulse,
  GraduationCap,
  Home,
  ShoppingBag,
  Trees,
  Truck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GLYPHS = {
  "moving-checklist": Truck,
  utilities: Zap,
  "home-setup": Home,
  schools: GraduationCap,
  healthcare: HeartPulse,
  shopping: ShoppingBag,
  outdoors: Trees,
  "cost-of-living": CircleDollarSign,
  "local-tips": Coffee,
} as const;

export function GuideGlyph({ slug, className }: { slug: string; className?: string }) {
  const Icon = GLYPHS[slug as keyof typeof GLYPHS] ?? Home;
  return (
    <span
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-2xl bg-accent text-primary",
        className,
      )}
      aria-hidden
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </span>
  );
}
