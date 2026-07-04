/**
 * Citation — inline academic citation marker (Ch. 3.2).
 * Links to the reference list at the bottom of the article.
 */

interface CitationProps {
  id: string;
  number: number;
}

export function Citation({ id, number }: CitationProps) {
  return (
    <sup>
      <a
        href={`#ref-${id}`}
        id={`cite-${id}`}
        aria-label={`Reference ${number}`}
        className="type-folio-v2"
        style={{ color: "var(--brass)", textDecoration: "none" }}
      >
        [{number}]
      </a>
    </sup>
  );
}
