import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const { fetchSitemapData } = await import("@/lib/data/api");
        const { slugs, guideSlugs } = await fetchSitemapData();
        const paths = [
          "/",
          "/developments",
          "/guide",
          "/whats-new",
          "/faq",
          "/about",
          ...slugs.map((s) => `/developments/${s}`),
          ...guideSlugs.map((s) => `/guide/${s}`),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (p) => `  <url><loc>${origin}${p}</loc><changefreq>weekly</changefreq></url>`,
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
