import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { BrandMark } from "@/components/brand/mark";
import { SignedIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

const NAV = [
  { to: "/developments", label: "Developments" },
  { to: "/decide", label: "Now or wait" },
  { to: "/guide", label: "Living here" },
  { to: "/whats-new", label: "The latest" },
] as const;
const MORE = [
  { to: "/address", label: "Check an address" },
  { to: "/house", label: "The house" },
  { to: "/faq", label: "Common questions" },
  { to: "/about", label: "Sources & approach" },
] as const;
function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending || !user) return null;
  return (
    <div className="phr-auth-slot">
      <Link to="/admin">Admin</Link>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useLocation({ select: (location) => location.pathname });
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  return (
    <div className="phr-header">
      <div className="phr-edition-bar">
        <div className="phr-container phr-edition-inner">
          <span>INDEPENDENT LOCAL INTELLIGENCE</span>
          <span>PALATKA · EAST PALATKA · PUTNAM COUNTY, FL</span>
          <span className="phr-edition-date">PUBLIC RECORDS. LOCAL PERSPECTIVE.</span>
        </div>
      </div>
      <header className="phr-site-header">
        <div className="phr-container phr-header-inner">
          <Link to="/" className="phr-brand" aria-label="Palatka Homes Report home">
            <BrandMark className="phr-shell-mark" />
            <span className="phr-wordmark">
              Palatka<span>HOMES REPORT</span>
            </span>
          </Link>
          <nav className="phr-desktop-nav" aria-label="Main navigation">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
            <AuthSlot />
          </nav>
          <Link className="phr-header-cta" to="/developments">
            Explore the report <Search aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="phr-menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="report-mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        <nav
          id="report-mobile-nav"
          className="phr-mobile-nav"
          aria-label="Mobile navigation"
          hidden={!open}
        >
          {[...NAV, ...MORE].map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <AuthSlot />
        </nav>
      </header>
    </div>
  );
}
