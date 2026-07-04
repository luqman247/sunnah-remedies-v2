/**
 * Named transformation presets (ADR-6).
 *
 * Every image/video render resolves to one of these presets.
 * Raw transformation strings never appear at call sites.
 * f_auto and q_auto are applied globally by the URL builder.
 */

export interface TransformationPreset {
  crop: string;
  gravity: string;
  quality: string;
  aspect?: string;
  width?: number;
  height?: number;
}

export const presets = {
  hero: {
    crop: "fill",
    gravity: "auto",
    quality: "auto:good",
    aspect: "16:7",
  },
  heroMobile: {
    crop: "fill",
    gravity: "auto",
    quality: "auto:good",
    aspect: "4:5",
  },
  editorial: {
    crop: "fill",
    gravity: "auto",
    quality: "auto:good",
  },
  portrait: {
    crop: "fill",
    gravity: "face",
    quality: "auto:good",
    aspect: "4:5",
  },
  product: {
    crop: "pad",
    gravity: "auto",
    quality: "auto:best",
    aspect: "1:1",
  },
  productTall: {
    crop: "fill",
    gravity: "auto",
    quality: "auto:best",
    aspect: "4:5",
  },
  ingredient: {
    crop: "fill",
    gravity: "auto",
    quality: "auto:best",
    aspect: "3:2",
  },
  galleryThumb: {
    crop: "fill",
    gravity: "auto",
    quality: "auto:eco",
    aspect: "1:1",
  },
  wide: {
    crop: "fill",
    gravity: "auto",
    quality: "auto:good",
    aspect: "21:9",
  },
  lqip: {
    crop: "fill",
    gravity: "auto",
    quality: "1",
    width: 24,
  },
  og: {
    crop: "fill",
    gravity: "auto",
    quality: "auto",
    width: 1200,
    height: 630,
  },
} as const satisfies Record<string, TransformationPreset>;

export type PresetKey = keyof typeof presets;
