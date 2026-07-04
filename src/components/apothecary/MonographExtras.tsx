import Link from "next/link";
import type { FaqItem, ReadingItem, PathwayLink, RemedyEvidence } from "@/lib/content/types";
import { SectionLabel } from "@/components/ui/PageIntro";
import { GoLink } from "@/components/ui/Links";

export function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section id="frequently-asked" className="monograph-section" aria-labelledby="faq-heading">
      <SectionLabel>Common questions</SectionLabel>
      <h2 id="faq-heading" className="sr-only">
        Common questions
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

export function EvidenceSection({ evidence }: { evidence: RemedyEvidence }) {
  return (
    <section id="evidence-informed" className="monograph-section" aria-labelledby="evidence-heading">
      <SectionLabel>Evidence-informed discussion</SectionLabel>
      <h2 id="evidence-heading" className="monograph-section__title">
        Evidence context
      </h2>
      <p className="type-body evidence-section__intro">
        Established evidence and emerging findings are listed separately. Neither
        replaces Prophetic grading or traditional scholarly standing
      </p>

      {evidence.established.length > 0 && (
        <div className="evidence-block evidence-block--established">
          <h3 className="type-micro evidence-block__label">Established evidence</h3>
          <ul className="monograph-list">
            {evidence.established.map((item) => (
              <li key={item.slice(0, 48)}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {evidence.emerging.length > 0 && (
        <div className="evidence-block evidence-block--emerging">
          <h3 className="type-micro evidence-block__label">Emerging research</h3>
          <ul className="monograph-list">
            {evidence.emerging.map((item) => (
              <li key={item.slice(0, 48)}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export function AcademyLessons({ items }: { items: ReadingItem[] }) {
  if (items.length === 0) return null;

  return (
    <section id="academy-lessons" className="monograph-section" aria-labelledby="academy-heading">
      <SectionLabel>Related Academy teaching</SectionLabel>
      <h2 id="academy-heading" className="sr-only">
        Related Academy teaching
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

export function KnowledgeLibraryLinks({ items }: { items: ReadingItem[] }) {
  if (items.length === 0) return null;

  return (
    <section id="knowledge-library" className="monograph-section" aria-labelledby="library-heading">
      <SectionLabel>Knowledge Library</SectionLabel>
      <h2 id="library-heading" className="sr-only">
        Knowledge Library articles
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
  const library = pathways.filter((p) => p.department === "Knowledge Library");

  return (
    <section id="pathways" className="monograph-section" aria-labelledby="pathways-heading">
      <SectionLabel>Further study and embodied practice</SectionLabel>
      <h2 id="pathways-heading" className="sr-only">
        Cross-department pathways
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

      {library.length > 0 && (
        <div className="pathway-group">
          <p className="type-micro pathway-group__label">Knowledge Library</p>
          <ul className="pathway-group__list">
            {library.map((p) => (
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
