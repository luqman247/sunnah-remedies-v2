/**
 * Homepage “Latest additions” — publication gate, ordering, and path safety.
 *
 * Pure functions so the editorial rules can be unit-tested without Sanity.
 */

export const HOMEPAGE_HIGHLIGHTS_MAX = 6;

export type HomepageHighlightContentArea =
  | "knowledge-library"
  | "academy"
  | "apothecary"
  | "sacred-journeys"
  | "institution"
  | "clinical"
  | "programmes"
  | "publications";

export type HomepageHighlightVisualTheme =
  "none" | "dua-dhikr" | "knowledge-library" | "institution";

/** Raw highlight candidate before the publication gate. */
export interface HomepageHighlightCandidate {
  id: string;
  enabled: boolean;
  eyebrow: string;
  title: string;
  summary: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  /** CSS object-position derived from Sanity hotspot when present. */
  imageObjectPosition?: string | null;
  pathname?: string | null;
  contentArea: HomepageHighlightContentArea | string;
  contentAreaLabel?: string | null;
  publishedAt?: string | null;
  displayFrom?: string | null;
  displayUntil?: string | null;
  pinned?: boolean | null;
  priority?: number | null;
  ctaLabel?: string | null;
  showNewMarker?: boolean | null;
  visualTheme?: HomepageHighlightVisualTheme | string | null;
}

/** Public view model after gating and ordering. */
export interface HomepageHighlight {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  imageUrl?: string;
  imageAlt: string;
  imageObjectPosition?: string;
  href: string;
  contentArea: string;
  contentAreaLabel?: string;
  ctaLabel?: string;
  showNewMarker: boolean;
  visualTheme: HomepageHighlightVisualTheme;
  pinned: boolean;
  priority: number;
  publishedAt?: string;
}

export interface SelectHomepageHighlightsOptions {
  now?: Date;
  max?: number;
}

/**
 * Normalise an internal pathname for locale-aware Link / getPathname.
 * Rejects absolute URLs, locale prefixes, and empty values.
 */
export function normalizeInternalPathname(
  pathname: string | null | undefined,
): string | null {
  if (!pathname) return null;
  const trimmed = pathname.trim();
  if (!trimmed.startsWith("/")) return null;
  if (trimmed.startsWith("//")) return null;
  if (trimmed === "/en" || trimmed.startsWith("/en/")) return null;
  if (trimmed === "/dk" || trimmed.startsWith("/dk/")) return null;
  if (trimmed === "/da" || trimmed.startsWith("/da/")) return null;
  // Preserve query and hash; collapse accidental duplicate slashes in the path only.
  const hashIndex = trimmed.indexOf("#");
  const queryIndex = trimmed.indexOf("?");
  let pathPart = trimmed;
  let suffix = "";
  if (hashIndex >= 0 && (queryIndex < 0 || hashIndex < queryIndex)) {
    pathPart = trimmed.slice(0, hashIndex);
    suffix = trimmed.slice(hashIndex);
  } else if (queryIndex >= 0) {
    pathPart = trimmed.slice(0, queryIndex);
    suffix = trimmed.slice(queryIndex);
  }
  const normalisedPath = pathPart.replace(/\/{2,}/g, "/") || "/";
  return `${normalisedPath}${suffix}`;
}

export function isHighlightWithinDisplayWindow(
  candidate: Pick<HomepageHighlightCandidate, "displayFrom" | "displayUntil">,
  now: Date = new Date(),
): boolean {
  if (candidate.displayFrom) {
    const from = new Date(candidate.displayFrom);
    if (!Number.isNaN(from.getTime()) && from.getTime() > now.getTime()) {
      return false;
    }
  }
  if (candidate.displayUntil) {
    const until = new Date(candidate.displayUntil);
    if (!Number.isNaN(until.getTime()) && until.getTime() <= now.getTime()) {
      return false;
    }
  }
  return true;
}

/**
 * Locale completeness: required promotion fields must be present for this
 * language document. Incomplete Danish (or English) promotions are excluded
 * rather than falling back to another locale’s copy.
 */
export function isHighlightLocaleComplete(
  candidate: HomepageHighlightCandidate,
): boolean {
  if (!candidate.eyebrow?.trim()) return false;
  if (!candidate.title?.trim()) return false;
  if (!candidate.summary?.trim()) return false;
  if (!candidate.contentArea?.trim()) return false;
  const href = normalizeInternalPathname(candidate.pathname);
  if (!href) return false;
  if (candidate.imageUrl && !candidate.imageAlt?.trim()) return false;
  const theme = (candidate.visualTheme || "none") as string;
  const hasThemeFallback =
    theme === "dua-dhikr" ||
    theme === "knowledge-library" ||
    theme === "institution";
  if (!candidate.imageUrl && !hasThemeFallback) {
    // Require either an approved image or a known brand-safe visual theme.
    return false;
  }
  return true;
}

export function isHomepageHighlightEligible(
  candidate: HomepageHighlightCandidate,
  now: Date = new Date(),
): boolean {
  if (!candidate.enabled) return false;
  if (candidate.id.startsWith("drafts.")) return false;
  if (!isHighlightWithinDisplayWindow(candidate, now)) return false;
  if (!isHighlightLocaleComplete(candidate)) return false;
  return true;
}

function toHighlight(candidate: HomepageHighlightCandidate): HomepageHighlight {
  const href = normalizeInternalPathname(candidate.pathname)!;
  const theme = (candidate.visualTheme ||
    "none") as HomepageHighlightVisualTheme;
  const visualTheme: HomepageHighlightVisualTheme =
    theme === "dua-dhikr" ||
    theme === "knowledge-library" ||
    theme === "institution"
      ? theme
      : "none";

  return {
    id: candidate.id,
    eyebrow: candidate.eyebrow.trim(),
    title: candidate.title.trim(),
    summary: candidate.summary.trim(),
    imageUrl: candidate.imageUrl?.trim() || undefined,
    imageAlt: candidate.imageAlt?.trim() || candidate.title.trim(),
    imageObjectPosition: candidate.imageObjectPosition?.trim() || undefined,
    href,
    contentArea: candidate.contentArea,
    contentAreaLabel: candidate.contentAreaLabel?.trim() || undefined,
    ctaLabel: candidate.ctaLabel?.trim() || undefined,
    showNewMarker: Boolean(candidate.showNewMarker),
    visualTheme: candidate.imageUrl
      ? visualTheme
      : visualTheme === "none"
        ? "dua-dhikr"
        : visualTheme,
    pinned: Boolean(candidate.pinned),
    priority: typeof candidate.priority === "number" ? candidate.priority : 0,
    publishedAt: candidate.publishedAt || undefined,
  };
}

function compareHighlights(a: HomepageHighlight, b: HomepageHighlight): number {
  if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
  if (a.priority !== b.priority) return b.priority - a.priority;
  const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
  const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
  if (aTime !== bTime) return bTime - aTime;
  return a.title.localeCompare(b.title);
}

/**
 * Apply the editorial publication gate, dedupe, order, and cap.
 */
export function selectHomepageHighlights(
  candidates: HomepageHighlightCandidate[],
  options: SelectHomepageHighlightsOptions = {},
): HomepageHighlight[] {
  const now = options.now ?? new Date();
  const max = options.max ?? HOMEPAGE_HIGHLIGHTS_MAX;
  const seen = new Set<string>();
  const selected: HomepageHighlight[] = [];

  for (const candidate of candidates) {
    if (!isHomepageHighlightEligible(candidate, now)) continue;
    const highlight = toHighlight(candidate);
    const dedupeKey = `${highlight.href}::${highlight.title.toLowerCase()}`;
    if (seen.has(dedupeKey) || seen.has(highlight.id)) continue;
    seen.add(dedupeKey);
    seen.add(highlight.id);
    selected.push(highlight);
  }

  return selected.sort(compareHighlights).slice(0, max);
}
