import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { fetchSitemapData } = await import("@/lib/data/api");
        const { slugs, guideSlugs } = await fetchSitemapData();
        const now = new Date().toISOString();
        const paths: Array<{ loc: string; changefreq: string; priority: string }> = [
          { loc: "/", changefreq: "daily", priority: "1.0" },
          { loc: "/developments", changefreq: "daily", priority: "0.9" },
          { loc: "/guide", changefreq: "weekly", priority: "0.8" },
          { loc: "/whats-new", changefreq: "daily", priority: "0.7" },
          { loc: "/faq", changefreq: "weekly", priority: "0.8" },
          { loc: "/about", changefreq: "monthly", priority: "0.4" },
          ...slugs.map((s) => ({
            loc: `/developments/${s}`,
            changefreq: "weekly",
            priority: s === "alford-farms" ? "0.95" : "0.8",
          })),
          ...guideSlugs.map((s) => ({
            loc: `/guide/${s}`,
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
    <lastmod>${now}</lastmod>
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
