/**
 * LQIP (Low Quality Image Placeholder) generation.
 *
 * Generates a tiny blur placeholder URL and fetches/encodes it
 * as a base64 blurDataURL for use with next/image placeholder="blur".
 * Runs server-side only.
 */

import { getLqipUrl } from "./url";

export async function getBlurDataUrl(publicId: string): Promise<string | undefined> {
  if (!publicId) return undefined;

  const url = getLqipUrl(publicId);
  if (!url) return undefined;

  try {
    const response = await fetch(url);
    if (!response.ok) return undefined;

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const contentType = response.headers.get("content-type") || "image/webp";

    return `data:${contentType};base64,${base64}`;
  } catch {
    return undefined;
  }
}
