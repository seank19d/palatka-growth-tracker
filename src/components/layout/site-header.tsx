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

const navClass =
  "relative pb-0.5 text-sm text-muted transition-colors duration-150 hover:text-fg after:absolute after:inset-x-0 after:-bottom-3.5 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-150 after:ease-out data-[status=active]:font-medium data-[status=active]:text-fg data-[status=active]:after:scale-x-100";

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending || !user) return null;
  return (
    <div className="flex items-center gap-3">
      <Link
        to="/admin"
        className="text-sm text-muted transition-colors duration-150 hover:text-primary data-[status=active]:font-medium data-[status=active]:text-primary"
      >
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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <BrandMark className="size-8" title="Palatka Homes Report" />
          <span className="min-w-0 leading-none">
            <span className="block font-display text-xl font-semibold tracking-tight md:text-2xl">
              Palatka
            </span>
            <span className="mt-0.5 block text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Homes Report
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className={navClass}>
              {item.label}
            </Link>
          ))}
          <AuthSlot />
        </nav>
        <button
          type="button"
          className="relative inline-flex size-11 items-center justify-center rounded-sm border border-border transition-[transform,background-color] duration-150 ease-out hover:bg-secondary active:scale-[0.96] lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <Menu
            className={cn(
              "size-5 transition-[opacity,transform,filter] duration-150",
              open ? "scale-50 opacity-0 blur-sm" : "scale-100 opacity-100",
            )}
          />
          <X
            className={cn(
              "absolute size-5 transition-[opacity,transform,filter] duration-150",
              open ? "scale-100 opacity-100" : "scale-50 opacity-0 blur-sm",
            )}
          />
        </button>
      </div>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out lg:hidden",
          open ? "grid-rows-[1fr] border-t border-border" : "grid-rows-[0fr]",
        )}
      >
        <nav className="min-h-0 overflow-hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex min-h-11 items-center text-base text-muted transition-colors duration-150 data-[status=active]:font-medium data-[status=active]:text-fg"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex min-h-11 items-center">
              <AuthSlot />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
