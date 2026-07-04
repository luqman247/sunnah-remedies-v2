/**
 * Media resolver (ADR-8).
 *
 * Converts a Sanity media projection into the render model consumed
 * by Plate, EditorialImage, HeroMedia, etc.
 *
 * Resolution order:
 * 1. Cloudinary reference (public_id) → full Cloudinary delivery
 * 2. Legacy /public path → passthrough (migration fallback)
 * 3. No media → brief state placeholder
 *
 * The /public fallback is removed once migration (3A.2) completes.
 */

import type { PresetKey } from "@/lib/cloudinary/presets";

export interface CloudinaryReference {
  public_id: string;
  format?: string;
  width?: number;
  height?: number;
  resource_type?: string;
  secure_url?: string;
}

export interface SanityMediaProjection {
  status?: "brief" | "interim" | "final";
  alt?: string;
  caption?: string;
  credit?: string;
  copyright?: string;
  decorative?: boolean;
  purpose?: string;
  composition?: string;
  lens?: string;
  lighting?: string;
  grade?: string;
  mood?: string;
  cld?: CloudinaryReference;
  image?: { asset?: { url?: string; metadata?: { dimensions?: { width: number; height: number } } } };
  legacyUrl?: string;
}

export interface ResolvedMedia {
  source: "cloudinary" | "legacy" | "none";
  status: "brief" | "interim" | "final";
  publicId?: string;
  src?: string;
  width?: number;
  height?: number;
  format?: string;
  alt: string;
  caption?: string;
  credit?: string;
  copyright?: string;
  decorative: boolean;
  preset?: PresetKey;
  brief?: {
    purpose: string;
    composition: string;
    lens?: string;
    lighting: string;
    grade?: string;
    mood: string;
  };
}

export function resolveMedia(
  projection: SanityMediaProjection | null | undefined,
  defaultPreset?: PresetKey
): ResolvedMedia {
  if (!projection) {
    return {
      source: "none",
      status: "brief",
      alt: "",
      decorative: false,
      brief: {
        purpose: "Awaiting content",
        composition: "",
        lighting: "",
        mood: "",
      },
    };
  }

  const status = projection.status || "brief";
  const alt = projection.alt || projection.purpose || "";
  const decorative = projection.decorative || false;

  if (status === "brief") {
    return {
      source: "none",
      status: "brief",
      alt,
      decorative,
      brief: {
        purpose: projection.purpose || "",
        composition: projection.composition || "",
        lens: projection.lens,
        lighting: projection.lighting || "",
        grade: projection.grade,
        mood: projection.mood || "",
      },
    };
  }

  if (projection.cld?.public_id) {
    return {
      source: "cloudinary",
      status,
      publicId: projection.cld.public_id,
      width: projection.cld.width,
      height: projection.cld.height,
      format: projection.cld.format,
      alt,
      caption: projection.caption,
      credit: projection.credit,
      copyright: projection.copyright,
      decorative,
      preset: defaultPreset,
    };
  }

  const legacySrc =
    projection.legacyUrl ||
    projection.image?.asset?.url;

  if (legacySrc) {
    return {
      source: "legacy",
      status,
      src: legacySrc,
      width: projection.image?.asset?.metadata?.dimensions?.width,
      height: projection.image?.asset?.metadata?.dimensions?.height,
      alt,
      caption: projection.caption,
      credit: projection.credit,
      copyright: projection.copyright,
      decorative,
      preset: defaultPreset,
    };
  }

  return {
    source: "none",
    status: "brief",
    alt,
    decorative,
    brief: {
      purpose: projection.purpose || "",
      composition: projection.composition || "",
      lens: projection.lens,
      lighting: projection.lighting || "",
      grade: projection.grade,
      mood: projection.mood || "",
    },
  };
}
