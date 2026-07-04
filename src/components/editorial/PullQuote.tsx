/**
 * PullQuote — large editorial quote with attribution and source (Ch. 3.2).
 * Newsreader italic, bordered, with proper <blockquote>/<cite> semantics.
 */

interface PullQuoteProps {
  text: string;
  attribution?: string;
  source?: string;
  dark?: boolean;
}

export function PullQuote({ text, attribution, source, dark }: PullQuoteProps) {
  return (
    <blockquote
      className="type-pullquote"
      style={{
        margin: 0,
        padding: "var(--space-8) 0",
        borderBlockStart: `1px solid ${dark ? "var(--rule-dark)" : "var(--rule)"}`,
        borderBlockEnd: `1px solid ${dark ? "var(--rule-dark)" : "var(--rule)"}`,
        color: dark ? "var(--paper-on-deep)" : undefined,
      }}
    >
      <p style={{ margin: 0, maxInlineSize: "var(--measure-reading)" }}>{text}</p>
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
