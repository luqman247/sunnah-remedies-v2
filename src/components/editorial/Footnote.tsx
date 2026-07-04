/**
 * Footnote — numbered footnote with back-reference (Ch. 3.2).
 * Renders in the mono/small style with an anchor link back to the reference point.
 */

interface FootnoteProps {
  id: string;
  number: number;
  children: React.ReactNode;
}

export function Footnote({ id, number, children }: FootnoteProps) {
  return (
    <li
      id={`fn-${id}`}
      className="type-small-v2"
      style={{ marginBlockEnd: "var(--space-3)" }}
    >
      <span style={{ color: "var(--brass)", marginInlineEnd: "0.5em" }}>{number}.</span>
      {children}
      <a
        href={`#fnref-${id}`}
        aria-label={`Back to reference ${number}`}
        style={{
          marginInlineStart: "0.5em",
          color: "var(--brass)",
          textDecoration: "none",
          fontSize: "0.75em",
        }}
      >
        ↩
      </a>
    </li>
  );
}

interface FootnoteRefProps {
  id: string;
  number: number;
}

export function FootnoteRef({ id, number }: FootnoteRefProps) {
  return (
    <sup>
      <a
        id={`fnref-${id}`}
        href={`#fn-${id}`}
        aria-label={`Footnote ${number}`}
        className="type-folio-v2"
        style={{ color: "var(--brass)", textDecoration: "none" }}
      >
        [{number}]
      </a>
    </sup>
  );
}
