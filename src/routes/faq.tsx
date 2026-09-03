import { createFileRoute, Link } from "@tanstack/react-router";
import { Kicker } from "@/components/brand/kicker";
import { FileAlertForm } from "@/components/leads/file-alert-form";
import { JsonLd } from "@/components/json-ld";
import { fetchFaqs } from "@/lib/data/api";
import { seo } from "@/lib/seo";

const PUD_FAQ = {
  id: -1,
  question: "What is a PUD?",
  answer:
    "PUD means planned unit development. It is a county land-use category for a master-planned neighborhood — roads, lots, open space, and sometimes commercial — approved as one package instead of lot-by-lot zoning. Alford Farms is a PUD (case PUD24-000004). A PUD approval is not a recorded plat and not homes for sale.",
  sortOrder: 0,
  generated: false,
};

export const Route = createFileRoute("/faq")({
  loader: () => fetchFaqs(),
  head: () =>
    seo({
      title: "Palatka housing FAQ: Alford Farms, flood, schools",
      description:
        "Is Alford Farms selling? What a PUD is, 700 vs 559 lots, D.R. Horton, East Palatka vs Palatka, Clay Electric vs FPL, flood maps, and schools.",
      path: "/faq",
    }),
  component: FaqPage,
});

function FaqPage() {
  const faqs = Route.useLoaderData();
  const all = [PUD_FAQ, ...faqs.filter((f) => f.question !== PUD_FAQ.question)];
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: all.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />
      <Kicker>FAQ</Kicker>
      <h1 className="mt-2 font-display text-4xl font-semibold">Palatka housing FAQ</h1>
      <p className="mt-3 text-lg text-muted">Answers follow the public file, not builder talking points.</p>
      <dl className="mt-8 space-y-8">
        {all.map((f) => (
          <div key={String(f.id)} className="border-t border-border pt-6">
            <dt className="font-display text-xl font-semibold">{f.question}</dt>
            <dd className="mt-2 text-base leading-relaxed text-muted">{f.answer}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-10 text-base text-muted">
        Moving here this year?{" "}
        <Link to="/pack" className="font-medium text-primary underline-offset-4 hover:underline">
          Moving to Putnam pack
        </Link>
        .
      </p>
      <div className="mt-8">
        <FileAlertForm sourcePath="/faq" />
      </div>
    </main>
  );
}
