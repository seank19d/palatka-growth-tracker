import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Kicker } from "@/components/brand/kicker";
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
      title: "Palatka FL housing FAQ: Alford Farms, utilities, flood zones",
      description:
        "Answers on what a PUD is, Alford Farms sales timing, 700 vs 559 lots, D.R. Horton, East Palatka vs Palatka, Clay Electric vs FPL, flood maps, and Putnam County schools.",
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
      <h1 className="mt-2 font-display text-4xl font-semibold">Common questions</h1>
      <p className="mt-3 text-lg text-muted">
        Answers follow the public file, not builder talking points.
      </p>
      <Accordion type="single" collapsible className="mt-8">
        {all.map((f) => (
          <AccordionItem key={String(f.id)} value={String(f.id)}>
            <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
            <AccordionContent className="leading-relaxed">{f.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}
