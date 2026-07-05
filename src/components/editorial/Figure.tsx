"use client";

/**
 * Figure — numbered editorial figure with caption (Ch. 3.2).
 * Wraps an image/diagram in a <figure> with a numbered <figcaption>.
 */

import { useTranslations } from "next-intl";
import { EditorialImage } from "@/components/media/EditorialImage";

interface FigureProps {
  number?: number;
  publicId?: string;
  src?: string;
  alt: string;
  caption: string;
  credit?: string;
  aspect?: string;
  sizes?: string;
}

export function Figure({ number, publicId, src, alt, caption, credit, aspect, sizes }: FigureProps) {
  const t = useTranslations("editorial");
  const captionId = `figure-${number || "unnumbered"}`;
  const fullCaption = number ? t("figureCaption", { number, caption }) : caption;

  return (
    <figure
      style={{ margin: "var(--space-8) 0" }}
      aria-describedby={captionId}
    >
      <EditorialImage
        publicId={publicId}
        src={src}
        preset="editorial"
        alt={alt}
        sizes={sizes || "(min-width:1024px) 68ch, 100vw"}
        aspect={aspect}
      />
      <figcaption
        id={captionId}
        className="type-caption"
        style={{ marginBlockStart: "var(--space-3)", color: "var(--ink-soft)" }}
      >
        {fullCaption}
        {credit && <span> — {credit}</span>}
      </figcaption>
    </figure>
  );
}
