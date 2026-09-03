import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { Kicker } from "@/components/brand/kicker";
import { HOUSE_CARDS } from "@/lib/kits";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/house")({
  head: () =>
    seo({
      title: "Lists for a Palatka house",
      description:
        "Moving to Palatka, storm season, the first summer, a well lot, working from home, the yard, and closing week — short lists with Amazon links. We may earn a commission.",
      path: "/house",
    }),
  component: HousePage,
});

function HousePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "The house", path: "/house" },
        ])}
      />
      <Kicker>For the house</Kicker>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
        Lists for a Palatka house
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
        Once you’ve got a house in mind — or a truck booked — these are the lists people here
        actually use. A few questions each, then the usual gear. The links go to Amazon; we may earn
        a commission.
      </p>
      <ul className="mt-10 space-y-3">
        {HOUSE_CARDS.map((c) => (
          <li key={c.to}>
            <Link
              to={c.to}
              className="flex items-start justify-between gap-4 border border-border bg-card px-4 py-4 transition-colors duration-150 hover:bg-secondary/50"
            >
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {c.kicker}
                </span>
                <span className="mt-2 block font-display text-2xl font-semibold">{c.title}</span>
                <span className="mt-2 block text-base leading-relaxed text-muted">{c.blurb}</span>
              </span>
              <ArrowRight className="mt-1 size-4 shrink-0 text-primary" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-base text-muted">
        Still choosing Collection vs Alford?{" "}
        <Link to="/decide" className="font-medium text-primary underline-offset-4 hover:underline">
          Buy now or wait
        </Link>
        . Have a street?{" "}
        <Link to="/address" className="font-medium text-primary underline-offset-4 hover:underline">
          Check city vs well
        </Link>
        .
      </p>
    </main>
  );
}
