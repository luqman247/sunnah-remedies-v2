/**
 * Metadata Builder — Four-tier cascade.
 *
 * Resolution: Tier 4 (editorial override) > Tier 3 (document values) >
 * Tier 2 (type defaults) > Tier 1 (institutional defaults).
 *
 * No page ever ships without a resolved title, description, and canonical.
 * Open Graph images: page-specific socialImage / document.image override
 * the file-based institutional opengraph-image; otherwise the file
 * convention supplies the premium default (do not set a conflicting images array).
 */

import type { Metadata } from "next";
import { seoConfig, typeDefaults } from "./config";
import { canonicalUrl } from "./canonical";

/**
 * Build a locale-aware URL (unprefixed for default locale 'en').
 */
export function localeUrl(locale: string, path: string): string {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return `${seoConfig.siteUrl}${prefix}${path}`;
}

export interface SeoOverrides {
  seoTitle?: string;
  seoDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  socialImage?: string;
  robots?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export interface DocumentMeta {
  title?: string;
  name?: string;
  description?: string;
  shortDescription?: string;
  definition?: string;
  question?: string;
  slug?: string;
  image?: string;
  imageAlt?: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export interface MetadataInput {
  path: string;
  type?: string;
  document?: DocumentMeta;
  overrides?: SeoOverrides;
}

/**
 * Apply a title pattern by replacing {field} tokens with document values.
 */
function applyPattern(pattern: string, doc: DocumentMeta): string {
  return pattern.replace(/\{(\w+)\}/g, (_, key) => {
    const value = doc[key as keyof DocumentMeta];
    if (typeof value === "string") return value;
    return "";
  });
}

/**
 * Truncate a string to a maximum length, breaking at word boundaries.
 */
function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  const truncated = str.slice(0, max);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > max * 0.6 ? truncated.slice(0, lastSpace) : truncated;
}

/**
 * Build complete Next.js Metadata for a route.
 *
 * Consumed by every route's generateMetadata export.
 */
export function buildMetadata(input: MetadataInput): Metadata {
  const { path, type, document: doc, overrides } = input;

  const typeConfig = type ? typeDefaults[type] : undefined;

  // Tier 3: Document-derived values
  let computedTitle = doc?.title || doc?.name || "";
  let computedDescription = doc?.description || doc?.shortDescription || doc?.definition || "";

  // Apply type patterns (Tier 2)
  if (typeConfig && doc) {
    if (!computedTitle && typeConfig.titlePattern) {
      computedTitle = applyPattern(typeConfig.titlePattern, doc);
    } else if (computedTitle && typeConfig.titlePattern) {
      computedTitle = applyPattern(typeConfig.titlePattern, doc);
    }
    if (!computedDescription && typeConfig.descriptionPattern) {
      computedDescription = applyPattern(typeConfig.descriptionPattern, doc);
    }
  }

  // Tier 4: Editorial overrides
  const finalTitle = overrides?.seoTitle || computedTitle || seoConfig.defaultTitle;
  const finalDescription = truncate(
    overrides?.seoDescription || computedDescription || seoConfig.defaultDescription,
    155
  );
  const ogTitle = overrides?.ogTitle || finalTitle;
  const ogDescription = truncate(
    overrides?.ogDescription || finalDescription,
    200
  );
  const finalCanonical = overrides?.canonicalUrl || canonicalUrl(path);
  const customImage = overrides?.socialImage || doc?.image || undefined;
  const finalImage = customImage || seoConfig.defaultOgImage;
  const finalRobots = overrides?.noIndex
    ? "noindex, follow"
    : overrides?.robots || typeConfig?.robots || "index, follow";

  // Determine OG type
  let ogType: "website" | "article" | "profile" = "website";
  if (type === "article") ogType = "article";
  if (type === "faculty") ogType = "profile";

  const metadata: Metadata = {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: finalCanonical,
    },
    robots: finalRobots,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: finalCanonical,
      siteName: seoConfig.siteName,
      locale: seoConfig.locale,
      type: ogType,
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: doc?.imageAlt || ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [finalImage],
      site: seoConfig.twitterHandle,
    },
  };

  // Article-specific OG fields
  if (type === "article" && metadata.openGraph && "type" in metadata.openGraph) {
    const og = metadata.openGraph as Record<string, unknown>;
    if (doc?.publishedAt) og.publishedTime = doc.publishedAt;
    if (doc?.updatedAt) og.modifiedTime = doc.updatedAt;
    if (doc?.author) og.authors = [doc.author];
    if (doc?.section) og.section = doc.section;
    if (doc?.tags) og.tags = doc.tags;
  }

  // Keywords (internal use, not meta keywords — used for search/topical hints)
  if (overrides?.keywords && overrides.keywords.length > 0) {
    metadata.keywords = overrides.keywords;
  }

  return metadata;
}

/**
 * Build metadata for a simple static page (Tier 1 + 2 only).
 */
export function buildStaticMetadata(
  path: string,
  title: string,
  description?: string,
  overrides?: SeoOverrides
): Metadata {
  return buildMetadata({
    path,
    document: { title, description },
    overrides,
  });
}
