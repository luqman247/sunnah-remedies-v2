import type { AppLocale } from "@/i18n/locales";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { client } from "@/sanity/lib/client";
import { hotspotToObjectPosition, resolveMediaUrl } from "@/sanity/lib/image";
import { homepageHighlightsQuery } from "@/sanity/lib/queries";
import {
  selectHomepageHighlights,
  type HomepageHighlight,
  type HomepageHighlightCandidate,
} from "@/lib/homepage/highlights";

/** Avoid stale CDN reads for freshly published editorial photography. */
const highlightsClient = client.withConfig({ useCdn: false });

/** Editorial frame for Latest additions media — 16:10. */
const HIGHLIGHT_IMAGE_WIDTH = 1200;
const HIGHLIGHT_IMAGE_HEIGHT = 750;
const HIGHLIGHT_IMAGE_QUALITY = 80;

interface SanityHighlightImage {
  asset?: {
    _id?: string;
    url?: string | null;
    metadata?: {
      dimensions?: { width?: number; height?: number } | null;
      lqip?: string | null;
    } | null;
  } | null;
  hotspot?: { x?: number; y?: number; height?: number; width?: number } | null;
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  } | null;
}

interface HomepageHighlightQueryRow {
  _id: string;
  enabled?: boolean | null;
  eyebrow?: string | null;
  title?: string | null;
  summary?: string | null;
  image?: SanityHighlightImage | null;
  imageAlt?: string | null;
  contentArea?: string | null;
  contentAreaLabel?: string | null;
  destinationType?: string | null;
  pathname?: string | null;
  resolvedPathname?: string | null;
  publishedAt?: string | null;
  displayFrom?: string | null;
  displayUntil?: string | null;
  pinned?: boolean | null;
  priority?: number | null;
  ctaLabel?: string | null;
  showNewMarker?: boolean | null;
  visualTheme?: string | null;
}

function resolveHighlightImageUrl(
  image: SanityHighlightImage | null | undefined,
): string | undefined {
  if (!image?.asset?._id && !image?.asset?.url) return undefined;
  const url = resolveMediaUrl(image, {
    width: HIGHLIGHT_IMAGE_WIDTH,
    height: HIGHLIGHT_IMAGE_HEIGHT,
    quality: HIGHLIGHT_IMAGE_QUALITY,
    fit: "crop",
  });
  return url || undefined;
}

function mapQueryRow(
  row: HomepageHighlightQueryRow,
): HomepageHighlightCandidate {
  return {
    id: row._id,
    enabled: Boolean(row.enabled),
    eyebrow: row.eyebrow ?? "",
    title: row.title ?? "",
    summary: row.summary ?? "",
    imageUrl: resolveHighlightImageUrl(row.image),
    imageAlt: row.imageAlt,
    imageObjectPosition: hotspotToObjectPosition(row.image?.hotspot),
    pathname: row.resolvedPathname || row.pathname,
    contentArea: row.contentArea ?? "",
    contentAreaLabel: row.contentAreaLabel,
    publishedAt: row.publishedAt,
    displayFrom: row.displayFrom,
    displayUntil: row.displayUntil,
    pinned: row.pinned,
    priority: row.priority,
    ctaLabel: row.ctaLabel,
    showNewMarker: row.showNewMarker,
    visualTheme: row.visualTheme,
  };
}

async function fetchCmsHighlightCandidates(
  locale: string,
): Promise<HomepageHighlightCandidate[]> {
  try {
    const rows = await highlightsClient.fetch<HomepageHighlightQueryRow[]>(
      homepageHighlightsQuery,
      { language: locale },
    );
    if (!Array.isArray(rows)) return [];
    return rows.map(mapQueryRow);
  } catch {
    return [];
  }
}

/**
 * Public homepage highlights for a locale.
 *
 * Returns only eligible published CMS highlights. When none exist, returns
 * an empty array — the homepage section must be omitted. There is no
 * curated runtime fallback: disabling, expiring, or unpublishing all
 * highlights removes the section. English CMS copy never falls back onto Danish.
 */
export async function getHomepageHighlights(
  locale: AppLocale | string = DEFAULT_LOCALE,
  now: Date = new Date(),
): Promise<HomepageHighlight[]> {
  const appLocale = (locale === "da" ? "da" : "en") as AppLocale;
  return selectHomepageHighlights(
    await fetchCmsHighlightCandidates(appLocale),
    {
      now,
    },
  );
}
