import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand/mark";
import { SignedIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/developments", label: "Developments" },
  { to: "/guide", label: "Living guide" },
  { to: "/whats-new", label: "What's new" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "About" },
] as const;

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending || !user) return null;
  return (
    <div className="flex items-center gap-3">
      <Link to="/admin" className="text-sm text-muted hover:text-primary">
        Admin
      </Link>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b border-border bg-bg">
      <div className="river-ribbon w-full" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <BrandMark className="size-10" title="Palatka Homes Report" />
          <span className="min-w-0 leading-none">
            <span className="block font-display text-[1.55rem] font-semibold tracking-tight md:text-[1.75rem]">
              Palatka
            </span>
            <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              Homes Report
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-muted transition-colors hover:text-fg"
              activeProps={{ className: "text-sm text-fg" }}
            >
              {item.label}
            </Link>
          ))}
          <AuthSlot />
        </nav>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-md border border-border lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      <div className={cn("border-t border-border lg:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex min-h-11 items-center text-base"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex min-h-11 items-center">
            <AuthSlot />
          </div>
        </nav>
      </div>
    </header>
  );
}
