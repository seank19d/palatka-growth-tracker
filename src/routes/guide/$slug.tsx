import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { GuideGlyph } from "@/components/brand/guide-glyph";
import { GuideProse } from "@/components/guide/prose";
import { ProductBlock } from "@/components/guide/product-block";
import { JsonLd } from "@/components/json-ld";
import { formatDateShort } from "@/lib/format";
import { fetchGuidePage } from "@/lib/data/api";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import type { GuideSection } from "@/lib/types";

const SCHOOLS_CALLOUT: GuideSection = {
  callout: {
    title: "Do not trust marketing maps",
    body: "A new PUD will eventually get a school assignment. Until Putnam County School District says so in writing, assume nothing. Call the district with the parcel number.",
  },
};

function withSchoolsCallout(slug: string, sections: GuideSection[]): GuideSection[] {
  if (slug !== "schools") return sections;
  const has = sections.some((s) => s.callout?.title?.toLowerCase().includes("marketing maps"));
  if (has) {
    return sections.map((s) =>
      s.callout?.title?.toLowerCase().includes("marketing maps") ? SCHOOLS_CALLOUT : s,
    );
  }
  return [...sections, SCHOOLS_CALLOUT];
}

export const Route = createFileRoute("/guide/$slug")({
  loader: async ({ params }) => {
    const page = await fetchGuidePage({ data: params.slug });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) =>
    seo({
      title: loaderData?.page.title ?? "Guide",
      description: loaderData?.page.excerpt ?? "",
      path: loaderData ? `/guide/${loaderData.page.slug}` : "/guide",
    }),
  component: GuidePage,
});

function GuidePage() {
  const { page, nav, products } = Route.useLoaderData();
  const sections = withSchoolsCallout(page.slug, page.sections);
  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[13rem_1fr] md:px-6 md:py-14">
      <aside className="hidden md:block">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">Guide</p>
        <nav className="mt-3 space-y-1 text-sm">
          {nav.map((g) => (
            <Link
              key={g.slug}
              to="/guide/$slug"
              params={{ slug: g.slug }}
              className="block rounded-md px-2 py-2 text-muted transition-colors duration-150 hover:bg-secondary hover:text-fg data-[status=active]:bg-accent data-[status=active]:font-medium data-[status=active]:text-fg"
              activeProps={{ className: "block rounded-md bg-accent px-2 py-2 font-medium text-fg" }}
            >
              <span className="flex items-center gap-2">
                <GuideGlyph slug={g.slug} className="size-4 text-primary" />
                {g.navLabel}
              </span>
            </Link>
          ))}
        </nav>
      </aside>
      <article>
        <JsonLd
          data={[
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Living guide", path: "/guide" },
              { name: page.navLabel, path: `/guide/${page.slug}` },
            ]),
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: page.title,
              description: page.excerpt,
              dateModified: page.lastRefreshedAt,
              about: {
                "@type": "Place",
                name: "Palatka, East Palatka, and Putnam County, Florida",
              },
            },
          ]}
        />
        <Link to="/guide" className="text-base text-muted hover:text-primary">
          ← Living guide
        </Link>
        <p className="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-muted">Living guide</p>
        <div className="mt-3 flex items-start gap-3">
          <GuideGlyph slug={page.slug} className="mt-1 size-10 shrink-0 rounded-sm bg-accent p-2" />
          <h1 className="font-display text-4xl font-semibold md:text-5xl">{page.title}</h1>
        </div>
        <p className="mt-3 max-w-prose text-lg text-muted">{page.excerpt}</p>
        <p className="mt-2 text-xs text-subtle">
          Last refreshed {formatDateShort(page.lastRefreshedAt)}
        </p>
        <div className="mt-10">
          <GuideProse sections={sections} />
        </div>
        <div className="mt-12">
          <ProductBlock products={products} />
        </div>
        {page.slug === "home-setup" || page.slug === "utilities" || page.slug === "moving-checklist" ? (
          <p className="mt-6 text-base text-muted">
            {page.slug === "utilities" ? (
              <>
                On a well?{" "}
                <Link to="/well" className="font-medium text-primary underline-offset-4 hover:underline">
                  Well-lot list
                </Link>
                . Storm season?{" "}
                <Link to="/storm" className="font-medium text-primary underline-offset-4 hover:underline">
                  Storm list
                </Link>
                .
              </>
            ) : page.slug === "moving-checklist" ? (
              <>
                Truck booked?{" "}
                <Link to="/move" className="font-medium text-primary underline-offset-4 hover:underline">
                  What to pack and have waiting
                </Link>
                .
              </>
            ) : (
              <>
                First summer or closing week?{" "}
                <Link to="/house" className="font-medium text-primary underline-offset-4 hover:underline">
                  Lists for the house
                </Link>
                .
              </>
            )}
          </p>
        ) : null}
      </article>
    </main>
  );
}
