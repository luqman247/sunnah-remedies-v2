/**
 * Cloudinary URL construction utilities.
 *
 * All image/video URLs are built through these helpers.
 * They apply f_auto, q_auto, and the named preset transformations.
 */

import { presets, type PresetKey } from "./presets";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

const WIDTH_LADDER = [320, 480, 640, 768, 1024, 1280, 1536, 1920, 2560];

function buildBaseUrl(publicId: string, resourceType: "image" | "video" = "image"): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload`;
}

function buildTransformations(preset: PresetKey, widthOverride?: number): string {
  const p = presets[preset] as Record<string, string | number | undefined>;
  const parts: string[] = ["f_auto"];

  if (p.quality) parts.push(`q_${p.quality}`);
  if (p.crop) parts.push(`c_${p.crop}`);
  if (p.gravity) parts.push(`g_${p.gravity}`);
  if (p.aspect) parts.push(`ar_${String(p.aspect).replace(":", "_")}`);

  const w = widthOverride || (p.width as number | undefined);
  if (w) parts.push(`w_${w}`);
  if (p.height && !widthOverride) parts.push(`h_${p.height}`);

  return parts.join(",");
}

export function getImageUrl(publicId: string, preset: PresetKey, width?: number): string {
  if (!CLOUD_NAME || !publicId) return "";
  const transforms = buildTransformations(preset, width);
  return `${buildBaseUrl(publicId)}/${transforms}/${publicId}`;
}

export function getSrcSet(publicId: string, preset: PresetKey): string {
  if (!CLOUD_NAME || !publicId) return "";
  return WIDTH_LADDER
    .map((w) => `${getImageUrl(publicId, preset, w)} ${w}w`)
    .join(", ");
}

export function getVideoUrl(publicId: string, streaming = true): string {
  if (!CLOUD_NAME || !publicId) return "";
  const base = buildBaseUrl(publicId, "video");
  if (streaming) {
    return `${base}/sp_auto,f_auto:video,q_auto/${publicId}.m3u8`;
  }
  return `${base}/f_auto:video,q_auto/${publicId}`;
}

export function getPosterUrl(publicId: string, preset: PresetKey = "hero"): string {
  if (!CLOUD_NAME || !publicId) return "";
  const transforms = buildTransformations(preset);
  return `${buildBaseUrl(publicId, "video")}/${transforms},so_0/${publicId}.jpg`;
}

export function getOgImageUrl(publicId: string): string {
  return getImageUrl(publicId, "og");
}

export function getLqipUrl(publicId: string): string {
  if (!CLOUD_NAME || !publicId) return "";
  const base = buildBaseUrl(publicId);
  return `${base}/w_24,e_blur:1000,q_1,f_auto/${publicId}`;
}

export { WIDTH_LADDER };
