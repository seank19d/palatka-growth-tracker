import type { GuideSection } from "@/lib/types";

export function GuideProse({ sections }: { sections: GuideSection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((section, i) => (
        <section key={section.heading ?? i} className="space-y-3">
          {section.heading ? (
            <h2 className="font-display text-2xl font-semibold md:text-3xl">{section.heading}</h2>
          ) : null}
          {section.paragraphs?.map((p) => (
            <p key={p.slice(0, 40)} className="max-w-prose text-lg leading-relaxed text-fg">
              {p}
            </p>
          ))}
          {section.list ? (
            <ul className="max-w-prose list-disc space-y-2 pl-5 text-lg leading-relaxed text-fg">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {section.callout ? (
            <aside className="max-w-prose rounded-lg border border-primary/20 bg-accent px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
                {section.callout.title}
              </p>
              <p className="mt-1 text-base leading-relaxed text-fg">{section.callout.body}</p>
            </aside>
          ) : null}
        </section>
      ))}
    </div>
  );
}
