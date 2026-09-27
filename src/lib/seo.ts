import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

export const SITE_URL = "https://www.palatkahomesreport.com";

/** Soft SERP description length — keep full words, never mid-token cuts. */
export const META_DESCRIPTION_MAX = 158;

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Truncate meta description on a word boundary within `max` chars (default 158).
 * Collapses whitespace; strips trailing punctuation left by the cut.
 */
export function truncateMetaDescription(
  text: string,
  max: number = META_DESCRIPTION_MAX,
): string {
  const t = String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (t.length <= max) return t;
  let cut = t.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  if (sp >= Math.floor(max * 0.7)) cut = cut.slice(0, sp);
  return cut.replace(/[\s.,;:!?]+$/g, "").trimEnd();
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
  const metaDescription = truncateMetaDescription(description);
  const image = absoluteUrl("/og.jpg");
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: metaDescription },
      {
        name: "robots",
        content: noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: APP_NAME },
      { property: "og:locale", content: "en_US" },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: metaDescription },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: fullTitle },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: metaDescription },
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

