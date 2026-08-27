import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { Kicker } from "@/components/brand/kicker";
import { ProductBlock } from "@/components/guide/product-block";
import { StatusBadge } from "@/components/projects/status-badge";
import { fetchDecide } from "@/lib/data/api";
import {
  buildKit,
  DECIDE_FAQS,
  DEFAULT_KIT,
  QUESTIONS,
  scoreDecide,
  type DecideAnswers,
  type KitPrefs,
  type Verdict,
} from "@/lib/decide";
import { breadcrumbJsonLd, faqJsonLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

export const Route = createFileRoute("/decide")({
  loader: () => fetchDecide(),
  head: () =>
    seo({
      title: "Buy Palatka new construction now or wait?",
      description:
        "A short Palatka decision tool. The Collection at Palatka is selling in town. Alford Farms in East Palatka is still a county file. Get a plain-language read and a first-week moving kit.",
      path: "/decide",
    }),
  component: DecidePage,
});

function DecidePage() {
  const { projects, products } = Route.useLoaderData();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<DecideAnswers>>({});
  const [kit, setKit] = useState<KitPrefs>(DEFAULT_KIT);

  const current = QUESTIONS[step];
  const complete = step >= QUESTIONS.length;
  const verdict = complete ? scoreDecide(answers as DecideAnswers) : null;
  const kitItems = useMemo(
    () => (verdict ? buildKit(products, kit, verdict.id) : []),
    [products, kit, verdict],
  );

  function pick<K extends keyof DecideAnswers>(key: K, value: DecideAnswers[K]) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    window.setTimeout(() => setStep((s) => Math.min(s + 1, QUESTIONS.length)), 140);
  }

  function reset() {
    setAnswers({});
    setStep(0);
    setKit(DEFAULT_KIT);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Now or wait", path: "/decide" },
          ]),
          faqJsonLd(DECIDE_FAQS),
        ]}
      />
      <Kicker>Decision file</Kicker>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
        Buy now, or wait on the big PUD?
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
        Six questions. A plain-language read of what’s selling versus what’s still a Putnam file.
        Then a first-week kit for the house you actually land.
      </p>

      {!complete ? (
        <section className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-xs tabular-nums text-subtle">
              {String(step + 1).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}
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
              style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
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
      ) : verdict ? (
        <Result
          verdict={verdict}
          projects={projects}
          kit={kit}
          setKit={setKit}
          kitItems={kitItems}
          onReset={reset}
        />
      ) : null}
    </main>
  );
}

function Result({
  verdict,
  projects,
  kit,
  setKit,
  kitItems,
  onReset,
}: {
  verdict: Verdict;
  projects: Project[];
  kit: KitPrefs;
  setKit: (next: KitPrefs) => void;
  kitItems: ReturnType<typeof buildKit>;
  onReset: () => void;
}) {
  function project(slug: string) {
    return projects.find((p) => p.slug === slug);
  }

  return (
    <section className="mt-10 space-y-10">
      <article className="border border-border bg-card p-5 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{verdict.kicker}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">{verdict.headline}</h2>
        <p className="mt-4 text-lg leading-relaxed">{verdict.body}</p>
        <ul className="mt-6 space-y-3 border-t border-border pt-5">
          {verdict.points.map((p) => (
            <li key={p} className="flex gap-3 text-base leading-relaxed text-muted">
              <span className="mt-2 size-1.5 shrink-0 bg-primary" aria-hidden />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </article>

      <div className="grid gap-3">
        <FileLink slot={verdict.primary} project={project(verdict.primary.slug)} featured />
        <FileLink slot={verdict.secondary} project={project(verdict.secondary.slug)} />
      </div>

      <div>
        <h2 className="font-display text-2xl font-semibold">First-week kit</h2>
        <p className="mt-2 text-base leading-relaxed text-muted">
          Tune it for the house you land. Links go to Amazon; we may earn a commission.
        </p>
        <div className="mt-5 space-y-4">
          <ChipRow
            label="Household"
            value={kit.household}
            onChange={(household) => setKit({ ...kit, household })}
            options={[
              { value: "couple", label: "1–2 people" },
              { value: "family", label: "3–4" },
              { value: "large", label: "5+" },
            ]}
          />
          <ChipRow
            label="Water"
            value={kit.water}
            onChange={(water) => setKit({ ...kit, water })}
            options={[
              { value: "city", label: "City water" },
              { value: "well", label: "Well / septic" },
              { value: "unsure", label: "Not sure" },
            ]}
          />
          <ChipRow
            label="Storm season"
            value={kit.storm}
            onChange={(storm) => setKit({ ...kit, storm })}
            options={[
              { value: "season", label: "Moving Jun–Nov" },
              { value: "off", label: "Other months" },
            ]}
          />
        </div>
        <div className="mt-6">
          <ProductBlock products={kitItems} heading="For the truck and the first night" />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/guide">
            Open the living guide
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button type="button" variant="outline" onClick={onReset}>
          <RotateCcw className="size-4" />
          Start over
        </Button>
      </div>
    </section>
  );
}

function FileLink({
  slot,
  project,
  featured = false,
}: {
  slot: Verdict["primary"];
  project?: Project;
  featured?: boolean;
}) {
  return (
    <Link
      to="/developments/$slug"
      params={{ slug: slot.slug }}
      className={cn(
        "flex items-center justify-between gap-4 border px-4 py-4 transition-colors duration-150 hover:bg-secondary/50",
        featured ? "border-primary bg-accent" : "border-border bg-card",
      )}
    >
      <span>
        <span className="block font-display text-xl font-semibold">{slot.label}</span>
        <span className="mt-1 block text-base text-muted">{slot.why}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {project ? <StatusBadge status={project.status} /> : null}
        <ArrowRight className="size-4 text-primary" />
      </span>
    </Link>
  );
}

function ChipRow<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full border px-4 text-base transition-[background-color,border-color,transform] duration-150 active:scale-[0.97]",
                on ? "border-primary bg-primary text-primary-fg" : "border-border bg-card hover:bg-secondary",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
