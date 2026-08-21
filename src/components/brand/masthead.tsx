import { FileCheck, MapPinned, Stamp } from "lucide-react";

export function Masthead() {
  return (
    <div className="border-b border-border bg-primary text-primary-fg">
      <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-4 py-1.5 md:px-6">
        <p className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em]">
          <Stamp className="size-3" strokeWidth={2} />
          Independent report
        </p>
        <span className="hidden h-3 w-px bg-primary-fg/25 sm:block" />
        <p className="inline-flex shrink-0 items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-primary-fg/85">
          <MapPinned className="size-3" strokeWidth={2} />
          Palatka · East Palatka
        </p>
        <span className="hidden h-3 w-px bg-primary-fg/25 md:block" />
        <p className="hidden shrink-0 items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-primary-fg/85 md:inline-flex">
          <FileCheck className="size-3" strokeWidth={2} />
          County files, not renderings
        </p>
      </div>
    </div>
  );
}
