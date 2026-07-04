/**
 * MediaCaption — renders caption, credit, and copyright with restraint (Ch. 3.1).
 * Mono typography, supplementary to the image alt text.
 */

interface MediaCaptionProps {
  caption?: string;
  credit?: string;
  copyright?: string;
  id?: string;
  dark?: boolean;
}

export function MediaCaption({ caption, credit, copyright, id, dark }: MediaCaptionProps) {
  if (!caption && !credit && !copyright) return null;

  return (
    <figcaption
      id={id}
      className="type-caption"
      style={{ marginBlockStart: "var(--space-3)", color: dark ? "var(--paper-on-deep)" : "var(--ink-soft)" }}
    >
      {caption}
      {credit && (
        <span style={{ marginInlineStart: caption ? "0.5em" : undefined }}>
          {caption ? "— " : ""}{credit}
        </span>
      )}
      {copyright && (
        <span style={{ marginInlineStart: "0.5em", opacity: 0.7 }}>
          © {copyright}
        </span>
      )}
    </figcaption>
  );
}
