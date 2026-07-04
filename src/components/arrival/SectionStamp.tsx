/**
 * SectionStamp — folio/Roman numeral + section label (Ch. 7.2, 16).
 *
 * On >=lg: renders in the marginal rail.
 * Below lg: renders inline as a section marker above the heading.
 */

interface SectionStampProps {
  numeral: string;
  label?: string;
}

export function SectionStamp({ numeral, label }: SectionStampProps) {
  return (
    <div className="section-stamp" aria-hidden="true">
      <span className="type-folio-v2" style={{ color: "var(--brass)" }}>
        {numeral}
      </span>
      {label && (
        <>
          <span className="section-stamp__dot" style={{ color: "var(--brass)", margin: "0 0.5em" }}>·</span>
          <span className="type-eyebrow-v2">{label}</span>
        </>
      )}
    </div>
  );
}
