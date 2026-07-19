/**
 * ArrivalPullQuote — blockquote with cite (Ch. 16, 9.4).
 * Restyled for the v2 type system.
 */

interface ArrivalPullQuoteProps {
  text: string;
  attribution?: string;
  source?: string;
  dark?: boolean;
}

export function ArrivalPullQuote({
  text,
  attribution,
  source,
  dark,
}: ArrivalPullQuoteProps) {
  return (
    <blockquote
      className={`type-pullquote arrival-pullquote ${dark ? "arrival-pullquote--dark" : ""}`}
    >
      <p className="arrival-pullquote__text">{text}</p>
      {attribution && (
        <cite className="type-caption arrival-pullquote__cite">
          — {attribution}
          {source && (
            <span className="arrival-pullquote__source">({source})</span>
          )}
        </cite>
      )}
    </blockquote>
  );
}
