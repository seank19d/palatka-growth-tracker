import { createFileRoute } from "@tanstack/react-router";
import { Building2, Droplets, Landmark, LineChart, Newspaper } from "lucide-react";
import { Kicker } from "@/components/brand/kicker";
import { SectionIcon } from "@/components/brand/section-icon";
import { DISCLOSURE } from "@/lib/constants";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    seo({
      title: "About & sources",
      description:
        "How Palatka Homes Report is compiled from Putnam County, SJRWMD, and public news. Independent of the county, builders, and brokerages.",
      path: "/about",
    }),
  component: AboutPage,
});

const SOURCES = [
  {
    icon: Landmark,
    text: "Putnam County planning, zoning, and Board of County Commissioners materials",
  },
  {
    icon: Droplets,
    text: "St. Johns River Water Management District permit files",
  },
  {
    icon: Building2,
    text: "City of Palatka notices when they affect housing",
  },
  {
    icon: Newspaper,
    text: "Local news RSS and public web pages, fetched on a schedule",
  },
  {
    icon: LineChart,
    text: "Published market dashboards for the cost-of-living snapshot (always labeled as a band)",
  },
];

function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <div className="flex items-center gap-3">
        <SectionIcon icon={Landmark} tone="river" />
        <Kicker className="mt-0">Method</Kicker>
      </div>
      <h1 className="mt-3 font-display text-4xl font-semibold">About this report</h1>
      <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed">
        <p>
          Palatka Homes Report is an independent public website. It is not Putnam County, the City
          of Palatka, a builder, a lender, or a real-estate brokerage. Nothing here is an offer to
          sell real property.
        </p>
        <p>
          County PDFs are the source of truth and almost nobody reads them first. This site turns
          those files — starting with Alford Farms — into a dated status, and keeps a living guide
          for people moving to Putnam County that is not a listing brochure.
        </p>
        <h2 className="pt-4 font-display text-2xl font-semibold">Where the facts come from</h2>
        <ul className="mt-4 space-y-3">
          {SOURCES.map((s) => (
            <li key={s.text} className="flex items-start gap-3">
              <SectionIcon icon={s.icon} tone="paper" size="sm" className="mt-0.5" />
              <span>{s.text}</span>
            </li>
          ))}
        </ul>
        <p>
          Each project carries a confidence mark: <strong>public record</strong> (tied to a case or
          ordinance), <strong>reported</strong> (local reporting, no case number in our file yet), or{" "}
          <strong>watch</strong> (auto-detected from news or county copy, not yet confirmed).
        </p>
        <h2 className="pt-4 font-display text-2xl font-semibold">How the site stays current</h2>
        <p>
          Once a day a scheduled job fetches the source list, stores new headlines, matches them to
          known projects, advances status when the public record is clear, and publishes new
          watch-list items when a subdivision is named in Palatka or Putnam coverage. If an xAI key
          is configured, plain-language summaries are rewritten from the new material. Failed
          scrapes are logged; public pages keep the last good data.
        </p>
        <p>
          No daily editor is required. Optional operators can still open the admin console to force
          a refresh or correct a record.
        </p>
        <h2 className="pt-4 font-display text-2xl font-semibold">Affiliate links</h2>
        <p>{DISCLOSURE}</p>
        <h2 className="pt-4 font-display text-2xl font-semibold">Corrections</h2>
        <p>
          Prefer county PDFs over social posts. If a primary document contradicts this site, the
          county file wins — and the next automated pass should reflect it once the source is
          online.
        </p>
      </div>
    </main>
  );
}
