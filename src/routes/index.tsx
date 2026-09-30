import { createFileRoute } from "@tanstack/react-router";
import { JsonLd } from "@/components/json-ld";
import { EditorialHome } from "@/components/home/editorial-home";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { fetchHome } from "@/lib/data/api";
import { faqJsonLd, seo, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/")({
  loader: () => fetchHome(),
  head: () =>
    seo({
      title: "Palatka homes, developments & local living",
      description:
        "Explore new homes, development plans, and local life in Palatka, East Palatka, and Putnam County. Independent project files and practical moving guides.",
      path: "/",
    }),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: APP_NAME,
            url: `${SITE_URL}/`,
            description: APP_DESCRIPTION,
            about: { "@type": "Place", name: "Palatka, East Palatka, and Putnam County, Florida" },
          },
          ...(data.faqs.length ? [faqJsonLd(data.faqs)] : []),
        ]}
      />
      <EditorialHome data={data} />
    </>
  );
}
