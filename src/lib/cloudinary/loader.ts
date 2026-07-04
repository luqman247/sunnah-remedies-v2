/**
 * Custom image loader for next/image (fallback path).
 *
 * Used when components need the next/image optimisation pipeline
 * but are sourcing from Cloudinary. Constructs delivery URLs with
 * f_auto, q_auto, and responsive widths.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

interface LoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export function cloudinaryLoader({ src, width, quality }: LoaderParams): string {
  if (!CLOUD_NAME) return src;

  if (src.startsWith("http")) return src;

  const q = quality || 75;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_${q},w_${width}/${src}`;
}
