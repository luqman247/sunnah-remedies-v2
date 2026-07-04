/**
 * EditorialImage — inline editorial image with Cloudinary delivery (Ch. 3.1).
 *
 * Renders through CldImage (next-cloudinary) when a publicId is available,
 * falls back to next/image for legacy /public paths.
 * Always includes LQIP blur placeholder and responsive srcset.
 */

import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { MediaCaption } from "./MediaCaption";
import type { PresetKey } from "@/lib/cloudinary/presets";
import { presets } from "@/lib/cloudinary/presets";

interface EditorialImageProps {
  publicId?: string;
  src?: string;
  preset?: PresetKey;
  alt: string;
  caption?: string;
  credit?: string;
  copyright?: string;
  sizes: string;
  priority?: boolean;
  aspect?: string;
  width?: number;
  height?: number;
  blurDataUrl?: string;
  decorative?: boolean;
  className?: string;
}

export function EditorialImage({
  publicId,
  src,
  preset = "editorial",
  alt,
  caption,
  credit,
  copyright,
  sizes,
  priority = false,
  aspect,
  width,
  height,
  blurDataUrl,
  decorative = false,
  className,
}: EditorialImageProps) {
  const resolvedAlt = decorative ? "" : alt;
  const p = presets[preset];
  const captionId = caption || credit || copyright ? `caption-${publicId || src}` : undefined;

  const figureStyle: React.CSSProperties = {
    position: "relative",
    margin: 0,
    overflow: "hidden",
    borderRadius: "var(--radius)",
    ...(aspect ? { aspectRatio: aspect } : {}),
  };

  if (publicId) {
    return (
      <figure className={className} style={figureStyle} aria-describedby={captionId}>
        <CldImage
          src={publicId}
          alt={resolvedAlt}
          width={width || 1200}
          height={height || 800}
          sizes={sizes}
          crop={p.crop as "fill" | "pad"}
          gravity={p.gravity}
          format="auto"
          quality="auto"
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? "eager" : "lazy"}
          placeholder={blurDataUrl ? "blur" : undefined}
          blurDataURL={blurDataUrl}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <MediaCaption caption={caption} credit={credit} copyright={copyright} id={captionId} />
      </figure>
    );
  }

  if (src) {
    return (
      <figure className={className} style={figureStyle} aria-describedby={captionId}>
        <Image
          src={src}
          alt={resolvedAlt}
          width={width || 1200}
          height={height || 800}
          sizes={sizes}
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? "eager" : "lazy"}
          placeholder={blurDataUrl ? "blur" : undefined}
          blurDataURL={blurDataUrl}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <MediaCaption caption={caption} credit={credit} copyright={copyright} id={captionId} />
      </figure>
    );
  }

  return null;
}
