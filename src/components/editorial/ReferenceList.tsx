"use client";

/**
 * ReferenceList — academic reference list at the foot of an article (Ch. 3.2).
 * Renders numbered references with back-links to their citation points.
 */

import { useTranslations } from "next-intl";

interface Reference {
  id: string;
  number: number;
  text: string;
  url?: string;
  doi?: string;
}

interface ReferenceListProps {
  references: Reference[];
}

export function ReferenceList({ references }: ReferenceListProps) {
  const t = useTranslations("editorial");

  if (!references.length) return null;

  return (
    <section aria-labelledby="references-heading" style={{ marginBlockStart: "var(--space-12)" }}>
      <h2 id="references-heading" className="type-eyebrow-v2" style={{ marginBlockEnd: "var(--space-6)" }}>
        {t("references")}
      </h2>
      <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {references.map((ref) => (
          <li
            key={ref.id}
            id={`ref-${ref.id}`}
            className="type-small-v2"
            style={{
              marginBlockEnd: "var(--space-3)",
              paddingInlineStart: "var(--space-6)",
              position: "relative",
            }}
          >
            <span
              className="type-folio-v2"
              style={{
                position: "absolute",
                insetInlineStart: 0,
                color: "var(--brass)",
              }}
            >
              {ref.number}.
            </span>
            {ref.text}
            {ref.doi && (
              <a
                href={`https://doi.org/${ref.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginInlineStart: "0.5em", color: "var(--sage)" }}
              >
                doi:{ref.doi}
              </a>
            )}
            {ref.url && !ref.doi && (
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginInlineStart: "0.5em", color: "var(--sage)" }}
              >
                {t("link")}
              </a>
            )}
            <a
              href={`#cite-${ref.id}`}
              aria-label={t("backToCitation", { number: ref.number })}
              style={{ marginInlineStart: "0.5em", color: "var(--brass)", textDecoration: "none" }}
            >
              ↩
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
