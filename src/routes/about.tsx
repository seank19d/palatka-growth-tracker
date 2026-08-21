import { createFileRoute } from "@tanstack/react-router";
import { Kicker } from "@/components/brand/kicker";
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
  "Putnam County planning, zoning, and Board of County Commissioners materials",
  "St. Johns River Water Management District permit files",
  "City of Palatka notices when they affect housing",
  "Local news RSS and public web pages, fetched on a schedule",
  "Published market dashboards for the cost-of-living snapshot (always labeled as a band)",
];

function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <Kicker>Method</Kicker>
      <h1 className="mt-3 font-display text-4xl font-semibold">About this report</h1>
      <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed">
        <p>
          Palatka Homes Report is an independent public website. It is not Putnam County, the City
          of Palatka, a builder, a lender, or a real-estate brokerage. Nothing here is an offer to
          sell real property.
        </p>
        <p>
          Compiled from Putnam agendas, SJRWMD files, and attributed news. Alford Farms is the lead
          file because it is the large East Palatka PUD. The living guide is for people moving to
          Putnam County, not a listing brochure.
        </p>
        <h2 className="pt-4 font-display text-2xl font-semibold">Where the facts come from</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {SOURCES.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
        <p>
          Each project carries a confidence mark: <strong>public record</strong> (tied to a case or
          ordinance), <strong>reported</strong> (local reporting, no case number in our file yet), or{" "}
          <strong>watch</strong> (picked up from news or county copy, not yet confirmed).
        </p>
        <h2 className="pt-4 font-display text-2xl font-semibold">How the site stays current</h2>
        <p>
          Sources are checked on a schedule: county pages, water-management notices, and local news.
          New items are matched to projects by name and case number. If a source is down, the last
          good file stays up.
        </p>
        <h2 className="pt-4 font-display text-2xl font-semibold">Affiliate links</h2>
        <p>{DISCLOSURE}</p>
        <h2 className="pt-4 font-display text-2xl font-semibold">Corrections</h2>
        <p>
          Prefer county PDFs over social posts. If a primary document contradicts this site, the
          county file wins.
        </p>
      </div>
    </main>
  );
}
