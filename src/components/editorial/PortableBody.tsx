/**
 * PortableBody — constrained portable text renderer (Ch. 3.2).
 *
 * Renders portable text with registered inline/block types:
 * paragraph, emphasis, links, PullQuote, BlockQuote, Footnote,
 * Figure, Citation, ReferenceList.
 *
 * Does not allow arbitrary HTML or unregistered types.
 */

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { PullQuote } from "./PullQuote";
import { BlockQuote } from "./BlockQuote";
import { Figure } from "./Figure";
import { FootnoteRef } from "./Footnote";

interface PortableBodyProps {
  value: unknown[];
  measure?: string;
  dark?: boolean;
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="type-body-v2" style={{ marginBlockEnd: "var(--space-5)", maxInlineSize: "68ch" }}>
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="type-section-title" style={{ marginBlock: "var(--space-8) var(--space-4)" }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="type-dept-name" style={{ marginBlock: "var(--space-6) var(--space-3)" }}>
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{
          margin: "var(--space-6) 0",
          paddingInlineStart: "var(--space-6)",
          borderInlineStart: "1px solid var(--brass)",
          fontStyle: "italic",
        }}
      >
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        style={{ color: "var(--sage)", textDecoration: "underline", textUnderlineOffset: "0.15em" }}
      >
        {children}
      </a>
    ),
    footnoteRef: ({ value }) => (
      <FootnoteRef id={value?.id || ""} number={value?.number || 0} />
    ),
  },
  types: {
    pullQuote: ({ value }) => (
      <PullQuote
        text={value?.text || ""}
        attribution={value?.attribution}
        source={value?.source}
      />
    ),
    blockQuote: ({ value }) => (
      <BlockQuote
        text={value?.text || ""}
        attribution={value?.attribution}
        source={value?.source}
        lang={value?.lang}
      />
    ),
    figure: ({ value }) => (
      <Figure
        number={value?.number}
        publicId={value?.media?.cld?.public_id}
        src={value?.media?.image?.asset?.url}
        alt={value?.alt || value?.caption || ""}
        caption={value?.caption || ""}
        credit={value?.credit}
        aspect={value?.aspect}
      />
    ),
    arabicText: ({ value }) => (
      <p
        lang="ar"
        dir="rtl"
        className="type-arabic-body"
        style={{ margin: "var(--space-4) 0" }}
      >
        {value?.text}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul style={{ margin: "var(--space-4) 0", paddingInlineStart: "1.5em", maxInlineSize: "68ch" }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol style={{ margin: "var(--space-4) 0", paddingInlineStart: "1.5em", maxInlineSize: "68ch" }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="type-body-v2" style={{ marginBlockEnd: "var(--space-2)" }}>{children}</li>
    ),
    number: ({ children }) => (
      <li className="type-body-v2" style={{ marginBlockEnd: "var(--space-2)" }}>{children}</li>
    ),
  },
};

export function PortableBody({ value, measure = "68ch", dark }: PortableBodyProps) {
  if (!value || !Array.isArray(value) || value.length === 0) return null;

  return (
    <div
      style={{
        maxInlineSize: measure,
        color: dark ? "var(--paper-on-deep)" : undefined,
      }}
    >
      <PortableText value={value} components={components} />
    </div>
  );
}
