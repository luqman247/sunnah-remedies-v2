/**
 * BlockQuote — inline quotation within body text (Ch. 3.2).
 * Left-bordered, indented, with optional attribution.
 */

interface BlockQuoteProps {
  text: string;
  attribution?: string;
  source?: string;
  lang?: string;
}

export function BlockQuote({ text, attribution, source, lang }: BlockQuoteProps) {
  return (
    <blockquote
      lang={lang}
      dir={lang === "ar" ? "rtl" : undefined}
      style={{
        margin: "var(--space-6) 0",
        padding: 0,
        paddingInlineStart: "var(--space-6)",
        borderInlineStart: "1px solid var(--brass)",
      }}
    >
      <p className="type-body-l" style={{ margin: 0, fontStyle: "italic" }}>{text}</p>
      {attribution && (
        <cite
          className="type-caption"
          style={{
            display: "block",
            marginBlockStart: "var(--space-3)",
            fontStyle: "normal",
            color: "var(--ink-soft)",
          }}
        >
          — {attribution}
          {source && <span> ({source})</span>}
        </cite>
      )}
    </blockquote>
  );
}
