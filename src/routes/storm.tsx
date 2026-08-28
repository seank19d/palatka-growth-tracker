import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, CloudLightning, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { Kicker } from "@/components/brand/kicker";
import { ProductBlock } from "@/components/guide/product-block";
import { fetchStorm } from "@/lib/data/api";
import {
  STORM_FAQS,
  STORM_QUESTIONS,
  buildStormKit,
  scoreStorm,
  type StormAnswers,
} from "@/lib/storm";
import { breadcrumbJsonLd, faqJsonLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/storm")({
  loader: () => fetchStorm(),
  head: () =>
    seo({
      title: "Palatka hurricane kit: first storm in a Putnam house",
      description:
        "Four questions. A Palatka-specific list for power, well water, and the first named storm — not a generic prepper blog. Amazon links; we may earn a commission.",
      path: "/storm",
    }),
  component: StormPage,
});

function StormPage() {
  const { products } = Route.useLoaderData();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<StormAnswers>>({});

  const current = STORM_QUESTIONS[step];
  const complete = step >= STORM_QUESTIONS.length;
  const read = complete ? scoreStorm(answers as StormAnswers) : null;
  const kitItems = useMemo(
    () => (complete ? buildStormKit(products, answers as StormAnswers) : []),
    [products, answers, complete],
  );

  function pick<K extends keyof StormAnswers>(key: K, value: StormAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((s) => Math.min(s + 1, STORM_QUESTIONS.length));
  }

  function reset() {
    setAnswers({});
    setStep(0);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Storm list", path: "/storm" },
          ]),
          faqJsonLd(STORM_FAQS),
        ]}
      />
      <Kicker>June–November</Kicker>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
        Before the next named storm
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
        Putnam is inland. Trees, laterals, and the St. Johns still do the work. Four questions, then
        a list for this house — not a bunker catalog.
      </p>

      {!complete ? (
        <section className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-xs tabular-nums text-subtle">
              {String(step + 1).padStart(2, "0")} / {String(STORM_QUESTIONS.length).padStart(2, "0")}
            </p>
            {step > 0 ? (
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-1 text-base text-muted hover:text-fg"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                <ArrowLeft className="size-4" />
                Back
              </button>
            ) : null}
          </div>
          <div className="mt-3 h-1 bg-border">
            <div
              className="h-1 bg-primary transition-[width] duration-200 ease-out"
              style={{ width: `${((step + 1) / STORM_QUESTIONS.length) * 100}%` }}
            />
          </div>
          <h2 className="mt-8 font-display text-2xl font-semibold md:text-3xl">{current.prompt}</h2>
          <p className="mt-2 text-base leading-relaxed text-muted">{current.hint}</p>
          <ul className="mt-6 space-y-3">
            {current.options.map((opt) => {
              const selected = answers[current.key] === opt.value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => pick(current.key, opt.value)}
                    className={cn(
                      "flex w-full min-h-14 items-start gap-3 border px-4 py-3 text-left transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.99]",
                      selected
                        ? "border-primary bg-accent"
                        : "border-border bg-card hover:bg-secondary/60",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid size-5 shrink-0 place-items-center border",
                        selected ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface",
                      )}
                      aria-hidden
                    >
                      {selected ? <Check className="size-3" strokeWidth={3} /> : null}
                    </span>
                    <span>
                      <span className="block font-medium">{opt.label}</span>
                      <span className="mt-1 block text-base leading-relaxed text-muted">{opt.detail}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : read ? (
        <section className="mt-10 space-y-10">
          <article className="border border-border bg-card p-5 md:p-7">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              <CloudLightning className="size-3.5 text-primary" strokeWidth={1.75} />
              {read.kicker}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">{read.headline}</h2>
            <p className="mt-4 text-lg leading-relaxed">{read.body}</p>
            <ul className="mt-6 space-y-3 border-t border-border pt-5">
              {read.points.map((p) => (
                <li key={p} className="flex gap-3 text-base leading-relaxed text-muted">
                  <span className="mt-2 size-1.5 shrink-0 bg-primary" aria-hidden />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </article>

          <ProductBlock products={kitItems} heading="This house’s storm list" />

          <p className="text-base text-muted">
            Not an official emergency list. For that, use Putnam County Emergency Management. Have a
            street?{" "}
            <Link to="/address" className="font-medium text-primary underline-offset-4 hover:underline">
              Decode city vs well
            </Link>
            . Still choosing Collection vs Alford?{" "}
            <Link to="/decide" className="font-medium text-primary underline-offset-4 hover:underline">
              Buy now or wait
            </Link>
            .
          </p>
          <Button type="button" variant="outline" onClick={reset}>
            <RotateCcw className="size-4" />
            Start over
          </Button>
        </section>
      ) : null}

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-display text-2xl font-semibold">Before you buy a generator off a truck</h2>
        <dl className="mt-6 space-y-6">
          {STORM_FAQS.map((f) => (
            <div key={f.question}>
              <dt className="font-medium">{f.question}</dt>
              <dd className="mt-2 text-base leading-relaxed text-muted">{f.answer}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-base">
          <Link to="/guide/$slug" params={{ slug: "utilities" }} className="inline-flex items-center gap-1 font-medium text-primary">
            Utilities and who to call
            <ArrowRight className="size-4" />
          </Link>
        </p>
      </section>
    </main>
  );
}
