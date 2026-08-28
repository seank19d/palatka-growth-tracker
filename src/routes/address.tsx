import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JsonLd } from "@/components/json-ld";
import { Kicker } from "@/components/brand/kicker";
import { ProductBlock } from "@/components/guide/product-block";
import { MapEmbed } from "@/components/projects/map-embed";
import { StatusBadge } from "@/components/projects/status-badge";
import { decodeAddress } from "@/lib/data/api";
import { ADDRESS_EXAMPLES, ADDRESS_FAQS, type DecodeFact, type DecodeResult } from "@/lib/decode";
import { breadcrumbJsonLd, faqJsonLd, seo } from "@/lib/seo";
import type { AffiliateProduct, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type Search = { q?: string };

export const Route = createFileRoute("/address")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" && s.q.trim() ? s.q : undefined,
  }),
  loaderDeps: ({ search }) => ({ q: search.q ?? "" }),
  loader: ({ deps }) => decodeAddress({ data: deps.q }),
  head: () =>
    seo({
      title: "Decode a Palatka or East Palatka address",
      description:
        "Paste a Putnam County street. City vs unincorporated, water, electric, flood map, school locator, and nearby new construction — Collection vs Alford.",
      path: "/address",
    }),
  component: AddressPage,
});

function AddressPage() {
  const search = Route.useSearch();
  const q = search.q ?? "";
  const { result, products } = Route.useLoaderData();
  const navigate = useNavigate({ from: "/address" });
  const [value, setValue] = useState(q);

  function submit(next: string) {
    const trimmed = next.trim();
    void navigate({ search: { q: trimmed } });
  }

  const kit = result && !result.error ? kitFor(result, products) : [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Address", path: "/address" },
          ]),
          faqJsonLd(ADDRESS_FAQS),
        ]}
      />
      <Kicker>Street file</Kicker>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
        Decode a Palatka address
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
        City vs East Palatka, water, electric, flood map, and what’s actually selling nearby. Census
        geocode, not a listing photo.
      </p>

      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
      >
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          name="q"
          placeholder="508 N 17th St, Palatka, FL"
          aria-label="Street address"
          className="h-12 flex-1 rounded-sm text-base"
          autoComplete="street-address"
        />
        <Button type="submit" className="h-12 shrink-0">
          <Search className="size-4" />
          Decode
        </Button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {ADDRESS_EXAMPLES.map((ex) => (
          <button
            key={ex.query}
            type="button"
            onClick={() => {
              setValue(ex.query);
              submit(ex.query);
            }}
            className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-base hover:bg-secondary"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {result?.error ? (
        <p className="mt-8 border border-border bg-card px-4 py-4 text-base leading-relaxed">{result.error}</p>
      ) : null}

      {result && !result.error ? <Decoded result={result} kit={kit} /> : null}

      {!result && (
        <p className="mt-10 text-base leading-relaxed text-muted">
          Try The Collection’s street if you want an in-town example, or Alford Road for the East
          Palatka PUD side of the river.
        </p>
      )}
    </main>
  );
}

function kitFor(result: DecodeResult, products: AffiliateProduct[]): AffiliateProduct[] {
  const want =
    result.jurisdiction === "palatka-city"
      ? new Set([
          "Mattress protector (waterproof)",
          "Dehumidifier",
          "Window solar film",
          "Basic home tool kit",
        ])
      : new Set([
          "Garden hose and nozzle",
          "Dehumidifier",
          "Mosquito treatment for yards",
          "Hurricane supply kit",
        ]);
  return products.filter((p) => want.has(p.title)).sort((a, b) => a.sortOrder - b.sortOrder);
}

function Decoded({ result, kit }: { result: DecodeResult; kit: AffiliateProduct[] }) {
  const facts: DecodeFact[] = [result.water, result.electric, result.flood, result.school];
  const factTitle = ["Water", "Electric", "Flood", "Schools"];

  return (
    <section className="mt-10 space-y-8">
      <article className="border border-border bg-card p-5 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {result.jurisdictionLabel}
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold leading-tight">{result.matched}</h2>
        <p className="mt-2 font-mono text-sm tabular-nums text-subtle">
          {result.lat.toFixed(5)}°N {Math.abs(result.lng).toFixed(5)}°W
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {result.place ? `${result.place}. ` : null}
          {result.subdivision ? `${result.subdivision}. ` : null}
          {result.county ? `${result.county}.` : null} Listing language is not a city limit.
        </p>
      </article>

      <MapEmbed lat={result.lat} lng={result.lng} label={result.matched} />

      <ul className="grid gap-3">
        {facts.map((f, i) => (
          <li key={factTitle[i]} className="border border-border bg-card px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">{factTitle[i]}</p>
            <p className="mt-2 font-medium">{f.label}</p>
            <p className="mt-1 text-base leading-relaxed text-muted">{f.detail}</p>
            {f.href ? (
              <a
                href={f.href}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-base font-medium text-primary underline-offset-4 hover:underline"
              >
                {f.hrefLabel || "Open source"}
                <ArrowRight className="size-3.5" />
              </a>
            ) : null}
          </li>
        ))}
      </ul>

      {result.nearby.length ? (
        <div>
          <h2 className="font-display text-2xl font-semibold">New construction nearby</h2>
          <ul className="mt-4 grid gap-3">
            {result.nearby.map((n) => (
              <li key={n.slug}>
                <Link
                  to="/developments/$slug"
                  params={{ slug: n.slug }}
                  className={cn(
                    "flex items-center justify-between gap-4 border px-4 py-4 hover:bg-secondary/50",
                    n.slug === "collection-at-palatka" ? "border-primary bg-accent" : "border-border bg-card",
                  )}
                >
                  <span>
                    <span className="block font-display text-xl font-semibold">{n.name}</span>
                    <span className="mt-1 block text-base text-muted">
                      {n.miles < 0.5 ? "On this street" : `${n.miles.toFixed(1)} mi`} · {n.locationLabel}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={n.status as ProjectStatus} />
                    <ArrowRight className="size-4 text-primary" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {kit.length ? (
        <ProductBlock
          products={kit}
          heading={
            result.jurisdiction === "palatka-city"
              ? "If you’re moving into town"
              : "If you’re moving onto a well lot"
          }
        />
      ) : null}

      <p className="text-sm leading-relaxed text-subtle">
        Sources: {result.sources.join("; ") || "Census geocoder"}. Not a flood determination, not a
        school assignment, not a brokerage. Putnam PDFs win.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/decide">
            Buy now or wait
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/storm">Storm list</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/guide">Living guide</Link>
        </Button>
      </div>
    </section>
  );
}
