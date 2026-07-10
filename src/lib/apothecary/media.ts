/**
 * Resolve public product media URLs from Sanity + Cloudinary library refs.
 */

import { resolveMediaUrl } from "@/sanity/lib/image";
import { getImageUrl, getVideoUrl } from "@/lib/cloudinary";
import type { Product, SanityImage } from "@/sanity/lib/types";

export interface LibraryMediaAsset {
  _id?: string;
  title?: string;
  alt?: string;
  cloudinary?: {
    public_id?: string;
    secure_url?: string;
  };
  image?: SanityImage;
}

const FALLBACK_PHOTOGRAPHY: Record<string, { src: string; alt: string }> = {
  "black-seed-oil": {
    src: "/photography/black-seed-editorial.jpg",
    alt: "Black seed oil monograph photography",
  },
  honey: {
    src: "/photography/honey-editorial.jpg",
    alt: "Honey monograph photography",
  },
  "olive-oil": {
    src: "/photography/olive-oil-editorial.jpg",
    alt: "Olive oil monograph photography",
  },
  senna: {
    src: "/photography/senna-editorial.jpg",
    alt: "Senna monograph photography",
  },
};

function urlFromLibraryAsset(
  asset: LibraryMediaAsset | null | undefined,
  width = 1600,
): string | null {
  if (!asset) return null;
  if (asset.cloudinary?.secure_url) return asset.cloudinary.secure_url;
  if (asset.cloudinary?.public_id) {
    const url = getImageUrl(asset.cloudinary.public_id, "editorial", width);
    if (url) return url;
  }
  if (asset.image) {
    return resolveMediaUrl(asset.image, { width, quality: 80 });
  }
  return null;
}

export function resolveProductImage(product: Product): {
  src: string | null;
  alt: string;
} {
  const library = product.primaryLibraryImage as LibraryMediaAsset | undefined;
  const fromLibrary = urlFromLibraryAsset(library);
  if (fromLibrary) {
    return {
      src: fromLibrary,
      alt: library?.alt || product.mainImage?.alt || product.name,
    };
  }

  if (product.mainImage) {
    const src = resolveMediaUrl(product.mainImage, { width: 1600, quality: 80 });
    if (src) {
      return {
        src,
        alt: product.mainImage.alt || product.name,
      };
    }
  }

  const slug = product.slug?.current || "";
  const fallback = FALLBACK_PHOTOGRAPHY[slug];
  if (fallback) return fallback;

  return { src: null, alt: product.name };
}

export function resolveProductVideoUrl(product: Product): string | null {
  const libraryVideos = product.libraryVideos as
    | { cloudinary?: { public_id?: string; secure_url?: string } }[]
    | undefined;
  const first = libraryVideos?.[0];
  if (first?.cloudinary?.secure_url) return first.cloudinary.secure_url;
  if (first?.cloudinary?.public_id) {
    const url = getVideoUrl(first.cloudinary.public_id, false);
    if (url) return url;
  }
  return null;
}

export { FALLBACK_PHOTOGRAPHY };
