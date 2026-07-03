import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0];

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
  options?: { width?: number; height?: number; quality?: number }
): string | null {
  if (!source) return null;

  let img = builder.image(source).auto("format");

  if (options?.width) img = img.width(options.width);
  if (options?.height) img = img.height(options.height);
  if (options?.quality) img = img.quality(options.quality);

  return img.url();
}
