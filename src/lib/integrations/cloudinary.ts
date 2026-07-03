/**
 * Cloudinary Integration — Architecture Preparation
 *
 * This module prepares the architecture for future Cloudinary integration.
 * When activated, all media will be served via Cloudinary's CDN with
 * automatic format negotiation, responsive transforms, and edge delivery.
 *
 * DO NOT implement Cloudinary during Phase 2.
 * This file exists solely to define the integration interface.
 */

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export interface CloudinaryTransform {
  width?: number;
  height?: number;
  quality?: "auto" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  crop?: "fill" | "fit" | "limit" | "scale" | "thumb";
  gravity?: "auto" | "face" | "center";
  fetchFormat?: "auto";
}

export interface CloudinaryAsset {
  publicId: string;
  resourceType: "image" | "video" | "raw";
  format: string;
  width: number;
  height: number;
  bytes: number;
  url: string;
  secureUrl: string;
}

/**
 * Future: Resolve a Cloudinary asset ID to an optimised delivery URL.
 * Currently returns null — Sanity image URLs are used instead.
 */
export function resolveCloudinaryUrl(
  _assetId: string | null | undefined,
  _transforms?: CloudinaryTransform
): string | null {
  // Phase 3: Implement Cloudinary URL construction
  // const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  // if (!cloudName || !_assetId) return null;
  // return `https://res.cloudinary.com/${cloudName}/image/upload/.../${_assetId}`;
  return null;
}

/**
 * Future: Generate responsive image srcset from Cloudinary.
 */
export function generateCloudinarySrcSet(
  _assetId: string | null | undefined,
  _widths?: number[]
): string | null {
  return null;
}

/**
 * Future: Upload asset to Cloudinary and return the public ID.
 */
export async function uploadToCloudinary(
  _file: File | Buffer,
  _options?: { folder?: string; tags?: string[] }
): Promise<CloudinaryAsset | null> {
  return null;
}
