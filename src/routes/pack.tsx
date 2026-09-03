import { createFileRoute, Link } from "@tanstack/react-router";
import { Kicker } from "@/components/brand/kicker";
import { FileAlertForm } from "@/components/leads/file-alert-form";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/pack")({
  head: () =>
    seo({
      title: "Moving to Putnam pack",
      description:
        "Collection vs Alford Farms, insurance and flood, utilities, commute, and schools — the notes a listing skips when you move to Palatka or East Palatka.",
      path: "/pack",
    }),
  component: PackPage,
});

function PackPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Moving to Putnam pack", path: "/pack" },
        ])}
      />
      <Kicker>Moving here</Kicker>
      <h1 className="mt-2 font-display text-4xl font-semibold">Moving to Putnam pack</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted">
        Four pages most out-of-town buyers actually need, plus the file alert for the dirt that is
        not selling yet.
      </p>
      <ol className="mt-8 space-y-6">
        <li className="border-t border-border pt-5">
          <h2 className="font-display text-2xl font-semibold">Buy now or wait</h2>
          <p className="mt-2 text-base text-muted">
            Century Complete is taking contracts on 17th Street. Alford Farms is still a Putnam PUD file.
          </p>
          <Link to="/decide" className="mt-3 inline-block font-medium text-primary underline-offset-4 hover:underline">
            Open
          </Link>
        </li>
        <li className="border-t border-border pt-5">
          <h2 className="font-display text-2xl font-semibold">Cost of living and insurance</h2>
          <p className="mt-2 text-base text-muted">
            Putnam is cheaper than St. Johns. The fine print is insurance, flood maps, wells, septic, and SR 207.
          </p>
          <Link to="/guide/$slug" params={{ slug: "cost-of-living" }} className="mt-3 inline-block font-medium text-primary underline-offset-4 hover:underline">
            Open
          </Link>
        </li>
        <li className="border-t border-border pt-5">
          <h2 className="font-display text-2xl font-semibold">Lists for the house</h2>
          <p className="mt-2 text-base text-muted">Storm season, first summer, well lots, and closing week.</p>
          <Link to="/house" className="mt-3 inline-block font-medium text-primary underline-offset-4 hover:underline">
            Open
          </Link>
        </li>
      </ol>
      <div className="mt-10">
        <FileAlertForm
          projectSlug="pack"
          sourcePath="/pack"
          heading="Send me the pack and file changes"
          lede="A note when Alford Farms or another pipeline file actually moves. Not a weekly digest."
        />
      </div>
    </main>
  );
}
