import type { PolicyItem } from "@/lib/content/journeys/types";
import { SectionLabel } from "@/components/ui/PageIntro";

export function PolicyBlocks({ items }: { items: PolicyItem[] }) {
  return (
    <>
      {items.map((policy) => (
        <article key={policy.title} className="policy-block">
          <h3 className="type-title">{policy.title}</h3>
          {policy.body.map((p) => (
            <p key={p.slice(0, 40)} className="type-body">{p}</p>
          ))}
        </article>
      ))}
    </>
  );
}

export function SessionCards({
  sessions,
}: {
  sessions: { title: string; format: string; description: string }[];
}) {
  return (
    <>
      {sessions.map((session) => (
        <article key={session.title} className="curriculum-module">
          <header className="curriculum-module__header">
            <div>
              <h3 className="type-title curriculum-module__title">{session.title}</h3>
              <p className="type-micro curriculum-module__hours">{session.format}</p>
            </div>
          </header>
          <p className="type-body">{session.description}</p>
        </article>
      ))}
    </>
  );
}

export function PreparationTimeline({
  timeline,
}: {
  timeline: { phase: string; items: string[] }[];
}) {
  return (
    <>
      {timeline.map((phase) => (
        <article key={phase.phase} className="curriculum-module">
          <h3 className="type-title curriculum-module__title">{phase.phase}</h3>
          <ul className="monograph-list">
            {phase.items.map((item) => (
              <li key={item.slice(0, 48)}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </>
  );
}

export function PackingCategories({
  categories,
}: {
  categories: { category: string; items: string[] }[];
}) {
  return (
    <>
      {categories.map((cat) => (
        <article key={cat.category}>
          <SectionLabel>{cat.category}</SectionLabel>
          <ul className="monograph-list">
            {cat.items.map((item) => (
              <li key={item.slice(0, 48)}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </>
  );
}
