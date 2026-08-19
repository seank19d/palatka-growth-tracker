import { createFileRoute } from "@tanstack/react-router";

const BODY = `User-agent: *
Allow: /

Sitemap: /sitemap.xml
`;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(BODY, {
          headers: { "content-type": "text/plain; charset=utf-8" },
        }),
    },
  },
});
