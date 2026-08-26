import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

export const SITE_URL = "https://www.palatkahomesreport.com";

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function seo({
  title,
  description = APP_DESCRIPTION,
  path,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path: string;
  noIndex?: boolean;
}) {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(APP_NAME) ? title : `${title} | ${APP_NAME}`;
  const image = absoluteUrl("/og.jpg");
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      {
        name: "robots",
        content: noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: APP_NAME },
      { property: "og:locale", content: "en_US" },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  name: APP_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/__grok/icon-180.png"),
    width: 180,
    height: 180,
  },
  image: absoluteUrl("/og.jpg"),
  description: APP_DESCRIPTION,
  areaServed: [
    { "@type": "City", name: "Palatka", address: { "@type": "PostalAddress", addressRegion: "FL", addressCountry: "US" } },
    { "@type": "Place", name: "East Palatka, FL" },
    { "@type": "AdministrativeArea", name: "Putnam County, FL" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Palatka",
    addressRegion: "FL",
    addressCountry: "US",
  },
};

