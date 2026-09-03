import { createFileRoute, Link } from "@tanstack/react-router";
import { Kicker } from "@/components/brand/kicker";
import { TipForm } from "@/components/leads/tip-form";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/resources")({
  head: () =>
    seo({
      title: "Local resources",
      description:
        "Inspectors, insurance, well and septic, movers, and lenders who serve Palatka and East Palatka. Labeled resources, not endorsements.",
      path: "/resources",
    }),
  component: ResourcesPage,
});

function ResourcesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Local resources", path: "/resources" },
        ])}
      />
      <Kicker>Local</Kicker>
      <h1 className="mt-2 font-display text-4xl font-semibold">Local resources</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted">
        This site tracks county files. The people who write in are often moving, buying new
        construction, or waiting on Alford Farms. If you inspect houses, write insurance, pump
        septic, move households, or lend in Putnam County, a labeled slot here is how readers find
        you without this report becoming a brokerage.
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-base leading-relaxed text-muted">
        <li>One shop per category to start. Labeled “local resource,” not “endorsed.”</li>
        <li>We stay unlicensed and independent. No IDX. No “talk to our agent.”</li>
        <li>
          Corrections still go through the{" "}
          <Link to="/about" className="font-medium text-primary underline-offset-4 hover:underline">
            about page
          </Link>
          .
        </li>
      </ul>
      <div className="mt-8">
        <TipForm
          kind="resource"
          heading="Ask about a local-resource slot"
          lede="Say who you are, the category, and the part of Putnam you cover. We will write back when a slot is open."
        />
      </div>
    </main>
  );
}
