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

export function ArrivalPullQuote({ text, attribution, source, dark }: ArrivalPullQuoteProps) {
  return (
    <blockquote
      className="type-pullquote"
      style={{
        margin: 0,
        padding: 0,
        borderInlineStart: `1px solid ${dark ? "var(--paper-on-deep)" : "var(--brass)"}`,
        paddingInlineStart: "var(--space-6)",
        color: dark ? "var(--paper-on-deep)" : undefined,
      }}
    >
      <p style={{ margin: 0 }}>{text}</p>
      {attribution && (
        <cite
          className="type-caption"
          style={{
            display: "block",
            marginBlockStart: "var(--space-4)",
            fontStyle: "normal",
            color: dark ? "var(--paper-on-deep)" : "var(--ink-soft)",
          }}
        >
          — {attribution}
          {source && <span style={{ marginInlineStart: "0.5em" }}>({source})</span>}
        </cite>
      )}
    </blockquote>
  );
}
