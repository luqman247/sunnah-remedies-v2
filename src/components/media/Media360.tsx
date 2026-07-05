"use client";

/**
 * Media360 — future seam for 360° imagery (Ch. 13).
 *
 * Component boundary behind Plate for product gallery 360 spin.
 * Currently renders a placeholder; Cloudinary 360 viewer integration
 * activates when content exists.
 */

import { useTranslations } from "next-intl";

interface Media360Props {
  publicId?: string;
  alt: string;
  fallbackSrc?: string;
}

export function Media360({ publicId, alt, fallbackSrc }: Media360Props) {
  const t = useTranslations("media");

  if (!publicId) {
    return (
      <div
        aria-label={alt}
        style={{
          aspectRatio: "1/1",
          background: "var(--paper-deep)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--radius)",
        }}
      >
        <span className="type-caption" style={{ color: "var(--ink-soft)" }}>
          {t("view360ComingSoon")}
        </span>
      </div>
    );
  }

  return (
    <div
      aria-label={t("view360", { alt })}
      style={{ aspectRatio: "1/1", position: "relative", overflow: "hidden" }}
    >
      {/* Cloudinary 360 spin viewer will be integrated here */}
      <img
        src={fallbackSrc || ""}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
