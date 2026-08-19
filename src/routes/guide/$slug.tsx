import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { GuideProse } from "@/components/guide/prose";
import { ProductBlock } from "@/components/guide/product-block";
import { formatDateShort } from "@/lib/format";
import { fetchGuidePage } from "@/lib/data/api";

export const Route = createFileRoute("/guide/$slug")({
  loader: async ({ params }) => {
    const page = await fetchGuidePage({ data: params.slug });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.page.title} — Palatka Growth Tracker`
          : "Guide — Palatka Growth Tracker",
      },
      { name: "description", content: loaderData?.page.excerpt ?? "" },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  const { page, nav, products } = Route.useLoaderData();
  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[13rem_1fr] md:px-6 md:py-14">
      <aside className="hidden md:block">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Guide</p>
        <nav className="mt-3 space-y-1 text-sm">
          {nav.map((g) => (
            <Link
              key={g.slug}
              to="/guide/$slug"
              params={{ slug: g.slug }}
              className="block rounded-md px-2 py-2 text-muted hover:bg-secondary hover:text-fg"
              activeProps={{ className: "block rounded-md bg-secondary px-2 py-2 text-fg" }}
            >
              {g.navLabel}
            </Link>
          ))}
        </nav>
      </aside>
      <article>
        <Link to="/guide" className="text-sm text-muted hover:text-primary">
          All guide pages
        </Link>
        <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{page.title}</h1>
        <p className="mt-3 max-w-prose text-lg text-muted">{page.excerpt}</p>
        <p className="mt-2 text-xs text-subtle">
          Last refreshed {formatDateShort(page.lastRefreshedAt)}
        </p>
        <div className="mt-10">
          <GuideProse sections={page.sections} />
        </div>
        <div className="mt-12">
          <ProductBlock products={products} />
        </div>
      </article>
    </main>
  );
}
