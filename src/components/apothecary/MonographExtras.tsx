import Link from "next/link";
import type { FaqItem, ReadingItem, PathwayLink } from "@/lib/content/types";
import { SectionLabel } from "@/components/ui/PageIntro";
import { GoLink } from "@/components/ui/Links";

export function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section id="frequently-asked" className="monograph-section" aria-labelledby="faq-heading">
      <SectionLabel>Questions</SectionLabel>
      <h2 id="faq-heading" className="sr-only">
        Frequently asked questions
      </h2>
      <dl className="faq-list">
        {items.map((item) => (
          <div key={item.question} className="faq-item">
            <dt className="type-body faq-item__question">{item.question}</dt>
            <dd className="type-body faq-item__answer">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ReadingList({ items }: { items: ReadingItem[] }) {
  if (items.length === 0) return null;

  return (
    <section id="suggested-reading" className="monograph-section" aria-labelledby="reading-heading">
      <SectionLabel>Suggested reading</SectionLabel>
      <h2 id="reading-heading" className="sr-only">
        Suggested reading
      </h2>
      <ul className="reading-list">
        {items.map((item) => (
          <li key={item.href} className="reading-list__item">
            <Link href={item.href} className="go-link">
              {item.title}
              <span aria-hidden="true">→</span>
            </Link>
            <p className="type-small reading-list__note">{item.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PathwaysPanel({ pathways }: { pathways: PathwayLink[] }) {
  if (pathways.length === 0) return null;

  const academy = pathways.filter((p) => p.department === "Academy");
  const journeys = pathways.filter((p) => p.department === "Sacred Journeys");

  return (
    <section id="pathways" className="monograph-section" aria-labelledby="pathways-heading">
      <SectionLabel>Further study &amp; embodiment</SectionLabel>
      <h2 id="pathways-heading" className="sr-only">
        Cross-links
      </h2>

      {academy.length > 0 && (
        <div className="pathway-group">
          <p className="type-micro pathway-group__label">The Academy</p>
          <ul className="pathway-group__list">
            {academy.map((p) => (
              <li key={p.href}>
                <GoLink href={p.href}>{p.label}</GoLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      {journeys.length > 0 && (
        <div className="pathway-group">
          <p className="type-micro pathway-group__label">Sacred Journeys</p>
          <ul className="pathway-group__list">
            {journeys.map((p) => (
              <li key={p.href}>
                <GoLink href={p.href}>{p.label}</GoLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
