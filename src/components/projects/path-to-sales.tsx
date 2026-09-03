import { Link } from "@tanstack/react-router";

const STEPS = [
  {
    label: "PUD rezoning",
    done: true,
    detail: "Ordinance 2024-017, case PUD24-000004 — August 13, 2024.",
  },
  {
    label: "SJRWMD / engineering closeout",
    done: false,
    detail: "Stormwater and site engineering still the live step in the 2026 file checks.",
  },
  {
    label: "Plat recorded",
    done: false,
    detail: "Lots exist on paper only after the clerk records a plat. Not for sale yet.",
  },
  {
    label: "Model / builder page",
    done: false,
    detail: "A Horton (or other) community page with prices is the first public sales signal.",
  },
  {
    label: "Taking contracts",
    done: false,
    detail: "That is when this tracker flips Alford Farms from pipeline to selling.",
  },
];

export function PathToSales() {
  return (
    <section className="mt-10 border border-border bg-card p-5 md:p-6">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
        What has to happen before sales
      </p>
      <h2 className="mt-2 font-display text-2xl font-semibold">Alford Farms is not late. It is early.</h2>
      <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
        A PUD is an entitlement. Homes for sale need a recorded plat and a builder taking contracts.
        Need a house this year?{" "}
        <Link to="/developments/$slug" params={{ slug: "collection-at-palatka" }} className="font-medium text-primary underline-offset-4 hover:underline">
          The Collection at Palatka
        </Link>{" "}
        is the in-town product that is already selling.
      </p>
      <ol className="mt-6 space-y-4">
        {STEPS.map((step, i) => (
          <li key={step.label} className="flex gap-3">
            <span
              className={
                step.done
                  ? "mt-0.5 grid size-6 shrink-0 place-items-center bg-primary text-xs font-medium text-primary-fg"
                  : "mt-0.5 grid size-6 shrink-0 place-items-center border border-border text-xs text-muted"
              }
            >
              {String(i + 1)}
            </span>
            <div>
              <p className="font-medium">
                {step.label}
                {step.done ? <span className="ml-2 text-xs font-normal uppercase tracking-[0.12em] text-primary">Done</span> : null}
              </p>
              <p className="mt-1 text-base leading-relaxed text-muted">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
