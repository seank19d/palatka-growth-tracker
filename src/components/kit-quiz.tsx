import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { Kicker } from "@/components/brand/kicker";
import { ProductBlock } from "@/components/guide/product-block";
import { pickTitles, type KitDef } from "@/lib/kits";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import type { AffiliateProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

export function KitQuiz({ kit, products }: { kit: KitDef; products: AffiliateProduct[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const current = kit.questions[step];
  const complete = step >= kit.questions.length;
  const read = complete ? kit.score(answers) : null;
  const items = useMemo(
    () => (complete ? pickTitles(products, kit.titles(answers)) : []),
    [complete, products, kit, answers],
  );

  function pick(value: string) {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
    setStep((s) => Math.min(s + 1, kit.questions.length));
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
            { name: "The house", path: "/house" },
            { name: kit.breadcrumb, path: kit.path },
          ]),
          faqJsonLd(kit.faqs),
        ]}
      />
      <Kicker>{kit.kicker}</Kicker>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{kit.title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{kit.lede}</p>

      {!complete ? (
        <section className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-xs tabular-nums text-subtle">
              {String(step + 1).padStart(2, "0")} / {String(kit.questions.length).padStart(2, "0")}
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
              style={{ width: `${((step + 1) / kit.questions.length) * 100}%` }}
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
                    onClick={() => pick(opt.value)}
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
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{read.kicker}</p>
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

          {items.length ? <ProductBlock products={items} heading={kit.listHeading} /> : null}

          <p className="text-base text-muted">
            {kit.related.map((r, i) => (
              <span key={r.to}>
                {i > 0 ? " · " : null}
                <Link to={r.to} className="font-medium text-primary underline-offset-4 hover:underline">
                  {r.label}
                </Link>
              </span>
            ))}
          </p>
          <Button type="button" variant="outline" onClick={reset}>
            <RotateCcw className="size-4" />
            Start over
          </Button>
        </section>
      ) : null}

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-display text-2xl font-semibold">A few things people ask</h2>
        <dl className="mt-6 space-y-6">
          {kit.faqs.map((f) => (
            <div key={f.question}>
              <dt className="font-medium">{f.question}</dt>
              <dd className="mt-2 text-base leading-relaxed text-muted">{f.answer}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-base">
          <Link to="/house" className="inline-flex items-center gap-1 font-medium text-primary">
            All the house lists
            <ArrowRight className="size-4" />
          </Link>
        </p>
      </section>
    </main>
  );
}
