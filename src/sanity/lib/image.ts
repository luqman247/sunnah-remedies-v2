import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

type SanityImageSource = Parameters<
  ReturnType<typeof imageUrlBuilder>["image"]
>[0];

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Future Cloudinary integration point.
 * When Cloudinary is integrated, this function will resolve
 * Cloudinary asset IDs to optimised delivery URLs.
 * For now, it returns Sanity image URLs.
 */
export function resolveMediaUrl(
  source: SanityImageSource | null,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    /** When height is set with width, crop to the frame using hotspot. */
    fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
  },
): string | null {
  if (!source) return null;

  let img = builder.image(source).auto("format");

  if (options?.width) img = img.width(options.width);
  if (options?.height) img = img.height(options.height);
  if (options?.quality) img = img.quality(options.quality);
  if (options?.fit) img = img.fit(options.fit);

  return img.url();
}

/**
 * CSS object-position from a Sanity image hotspot (x/y in 0–1).
 * Falls back to centre when hotspot is absent.
 */
export function hotspotToObjectPosition(
  hotspot: { x?: number; y?: number } | null | undefined,
): string | undefined {
  if (
    !hotspot ||
    typeof hotspot.x !== "number" ||
    typeof hotspot.y !== "number"
  ) {
    return undefined;
  }
  const x = Math.min(100, Math.max(0, hotspot.x * 100));
  const y = Math.min(100, Math.max(0, hotspot.y * 100));
  return `${x.toFixed(1)}% ${y.toFixed(1)}%`;
}
