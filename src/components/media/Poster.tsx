/**
 * Poster — video poster with play affordance (Ch. 3.1).
 *
 * Renders the poster image and an accessible play button overlay.
 * Used when video is deferred (poster-first strategy, ADR-7).
 */

import { EditorialImage } from "./EditorialImage";

interface PosterProps {
  publicId?: string;
  src?: string;
  alt: string;
  aspect?: string;
  priority?: boolean;
  onPlay?: () => void;
  blurDataUrl?: string;
}

export function Poster({ publicId, src, alt, aspect, priority, onPlay, blurDataUrl }: PosterProps) {
  return (
    <div style={{ position: "relative", aspectRatio: aspect || "16/9" }}>
      <EditorialImage
        publicId={publicId}
        src={src}
        preset="hero"
        alt={alt}
        sizes="100vw"
        priority={priority}
        aspect={aspect}
        blurDataUrl={blurDataUrl}
      />
      {onPlay && (
        <button
          type="button"
          onClick={onPlay}
          aria-label="Play video"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "color-mix(in srgb, var(--ink) 70%, transparent)",
              color: "var(--paper)",
              fontSize: "1.5rem",
            }}
          >
            ▶
          </span>
        </button>
      )}
    </div>
  );
}
