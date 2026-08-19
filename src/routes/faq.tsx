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

export const Route = createFileRoute("/faq")({
  loader: () => fetchFaqs(),
  head: () => ({ meta: [{ title: "FAQ — Palatka Growth Tracker" }] }),
  component: FaqPage,
});

function FaqPage() {
  const faqs = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />
      <Kicker>FAQ</Kicker>
      <h1 className="mt-2 font-display text-4xl font-semibold">Questions people actually ask</h1>
      <p className="mt-3 text-muted">
        Answers follow the public file, not builder talking points. If a sales agent and this page
        disagree, ask for the ordinance number.
      </p>
      <Accordion type="single" collapsible className="mt-8">
        {faqs.map((f) => (
          <AccordionItem key={f.id} value={String(f.id)}>
            <AccordionTrigger className="text-left text-base">{f.question}</AccordionTrigger>
            <AccordionContent className="leading-relaxed">{f.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}
