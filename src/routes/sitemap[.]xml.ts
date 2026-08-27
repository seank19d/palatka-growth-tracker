import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

function iso(d: string | null | undefined, fallback: string) {
  if (!d) return fallback;
  const t = Date.parse(d);
  return Number.isNaN(t) ? fallback : new Date(t).toISOString();
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { fetchSitemapData } = await import("@/lib/data/api");
        const { lastPublic, projects, guides } = await fetchSitemapData();
        const fallback = lastPublic ? iso(lastPublic, new Date().toISOString()) : new Date().toISOString();
        const paths: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [
          { loc: "/", lastmod: fallback, changefreq: "daily", priority: "1.0" },
          { loc: "/developments", lastmod: fallback, changefreq: "daily", priority: "0.9" },
          { loc: "/guide", lastmod: fallback, changefreq: "weekly", priority: "0.8" },
          { loc: "/decide", lastmod: fallback, changefreq: "weekly", priority: "0.9" },
          { loc: "/address", lastmod: fallback, changefreq: "weekly", priority: "0.85" },
          { loc: "/whats-new", lastmod: fallback, changefreq: "daily", priority: "0.7" },
          { loc: "/faq", lastmod: fallback, changefreq: "weekly", priority: "0.8" },
          { loc: "/about", lastmod: iso(lastPublic, fallback), changefreq: "monthly", priority: "0.4" },
          ...projects.map((p) => ({
            loc: `/developments/${p.slug}`,
            lastmod: iso(p.updatedAt, fallback),
            changefreq: "weekly",
            priority:
              p.slug === "alford-farms" || p.slug === "collection-at-palatka" ? "0.95" : "0.7",
          })),
          ...guides.map((s) => ({
            loc: `/guide/${s.slug}`,
            lastmod: iso(s.updatedAt, fallback),
            changefreq: "monthly",
            priority: "0.6",
          })),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;
        return new Response(xml, {
          headers: { "content-type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
