import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand/mark";
import { FOOTER_DISCLOSURE } from "@/lib/constants";
import { formatDateShort } from "@/lib/format";
const LINKS = [
  { to: "/developments", label: "Developments" },
  { to: "/decide", label: "Now or wait" },
  { to: "/address", label: "Check an address" },
  { to: "/house", label: "The house" },
  { to: "/guide", label: "Living here" },
  { to: "/whats-new", label: "The latest" },
  { to: "/faq", label: "Common questions" },
  { to: "/about", label: "Sources & approach" },
] as const;
export function SiteFooter({ lastUpdated }: { lastUpdated?: string | null }) {
  return (
    <footer className="phr-footer">
      <div className="phr-container">
        <div className="phr-footer-top">
          <Link
            className="phr-brand phr-footer-brand"
            to="/"
            aria-label="Palatka Homes Report home"
          >
            <BrandMark className="phr-shell-mark" />
            <span className="phr-wordmark">
              Palatka<span>HOMES REPORT</span>
            </span>
          </Link>
          <p>
            An independent look at homes, growth,
            <br />
            and life on both sides of the river.
          </p>
          <nav className="phr-footer-links" aria-label="Footer navigation">
            {LINKS.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="phr-footer-disclosure">{FOOTER_DISCLOSURE}</p>
        <div className="phr-footer-bottom">
          <span>Palatka Homes Report</span>
          <span>Last checked: {formatDateShort(lastUpdated)}</span>
          <details className="phr-photo-credits">
            <summary>Photo credits</summary>
            <div>
              <p>
                Memorial Bridge / St. Johns River: Ebyabe,{" "}
                <a
                  href="https://commons.wikimedia.org/wiki/File:Palatka_old_memorial_bridge02.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikimedia Commons
                </a>
                ,{" "}
                <a
                  href="https://creativecommons.org/licenses/by-sa/3.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CC BY-SA 3.0
                </a>
                .
              </p>
              <p>
                Ravine Gardens: Usflibstudent21,{" "}
                <a
                  href="https://commons.wikimedia.org/wiki/File:Ravine_Gardens,_Palatka,_Florida.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikimedia Commons
                </a>
                ,{" "}
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CC BY-SA 4.0
                </a>
                .
              </p>
              <p>
                Photos are resized and displayed with responsive crops and overlays. Adapted image
                assets retain their respective licenses.
              </p>
            </div>
          </details>
        </div>
      </div>
    </footer>
  );
}
