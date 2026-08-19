import { createFileRoute } from "@tanstack/react-router";
import { DISCLOSURE } from "@/lib/constants";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About & sources — Palatka Growth Tracker" }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary">Method</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">About this tracker</h1>
      <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed">
        <p>
          Palatka Growth Tracker is an independent public website. It is not Putnam County, the City
          of Palatka, a builder, a lender, or a real-estate brokerage. Nothing here is an offer to
          sell real property.
        </p>
        <p>
          The point of the site is to keep a dated, boring record of significant residential
          projects — starting with Alford Farms — and a living-in-Putnam guide that does not read
          like a listing brochure.
        </p>
        <h2 className="pt-4 font-display text-2xl font-semibold">Where the facts come from</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Putnam County planning, zoning, and Board of County Commissioners materials</li>
          <li>St. Johns River Water Management District permit files</li>
          <li>City of Palatka notices when they affect housing</li>
          <li>Local news RSS and public web pages, fetched on a schedule</li>
          <li>Published market dashboards for the cost-of-living snapshot (always labeled as a band)</li>
        </ul>
        <p>
          Each project carries a confidence mark: <strong>public record</strong> (tied to a case or
          ordinance), <strong>reported</strong> (local reporting, no case number in our file yet), or{" "}
          <strong>watch</strong> (land-use chatter we do not want to lose). Draft auto-detected
          projects stay unpublished until a person or a later confirmed filing promotes them.
        </p>
        <h2 className="pt-4 font-display text-2xl font-semibold">How automation works</h2>
        <p>
          Twice a day (when deployed with a cron secret) a job fetches the source list, stores new
          headlines, matches them to known projects, and — if an xAI key is configured — writes a
          plain-language summary. Failed scrapes are logged. The public pages keep the last good
          data, so a dead county CMS does not blank the site.
        </p>
        <p>
          Staff can sign in and force a refresh or correct a status. That is the only ongoing human
          path we designed for.
        </p>
        <h2 className="pt-4 font-display text-2xl font-semibold">Affiliate links</h2>
        <p>{DISCLOSURE}</p>
        <h2 className="pt-4 font-display text-2xl font-semibold">Corrections</h2>
        <p>
          If you have a primary document this site is missing — an ordinance, plat, or permit — the
          staff console is the place to file it. Prefer PDFs from the county over screenshots of
          Facebook.
        </p>
      </div>
    </main>
  );
}
