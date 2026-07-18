/**
 * Duʿā & Dhikr landing hub — pure composition helpers.
 *
 * Keeps the page free of duplicate browse surfaces when only the
 * foundational Morning/Evening collections are published, while remaining
 * ready for additional published collections and future articles.
 */

/** Foundational collections featured once in “Begin here”. Canonical source. */
export const BEGIN_HERE_COLLECTION_SLUGS = [
  "morning-dhikr",
  "evening-dhikr",
] as const;

export type BeginHereSlug = (typeof BEGIN_HERE_COLLECTION_SLUGS)[number];

export function isBeginHereSlug(slug: string): slug is BeginHereSlug {
  return (BEGIN_HERE_COLLECTION_SLUGS as readonly string[]).includes(slug);
}

export function selectBeginHereCollections<T extends { slug: string }>(
  published: T[],
): T[] {
  const bySlug = new Map(
    published.map((collection) => [collection.slug, collection]),
  );
  return BEGIN_HERE_COLLECTION_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (collection): collection is T => Boolean(collection),
  );
}

/**
 * Browse-by-occasion collections exclude anything already featured in Begin here,
 * so Morning/Evening are never duplicated in the principal browse experience.
 */
export function selectBrowseByOccasionCollections<T extends { slug: string }>(
  published: T[],
): T[] {
  return published.filter((collection) => !isBeginHereSlug(collection.slug));
}

export function shouldRenderBrowseByOccasionSection(
  browseCollections: unknown[],
): boolean {
  return browseCollections.length > 0;
}

/**
 * Preferred explicit topic slugs for Guides & Articles.
 * Long-term CMS SoT: assign Knowledge Library articles the `dua-dhikr` topic
 * (or another entry in this list). Do not rely on title/excerpt matching.
 */
export const DUA_DHIKR_GUIDE_TOPIC_SLUGS = [
  "dua-dhikr",
  "dua",
  "du-a",
  "dhikr",
  "adhkar",
  "adhkār",
  "dua-etiquette",
  "dhikr-etiquette",
  "supplication",
] as const;

/** Max articles rendered in Guides & Articles (deterministic slice). */
export const DUA_DHIKR_GUIDE_ARTICLE_LIMIT = 6;

/**
 * Temporary compatibility: topic *titles* that clearly name Duʿā/Dhikr
 * (not broad words like “prayer”, “morning”, or “remembrance”).
 */
const DEDICATED_TOPIC_TITLE_PATTERN =
  /^(du[ʿ'ʼ]?[aā]|dhikr|adhk[aā]r|supplication|ihukommelse)\b/i;

/**
 * Temporary legacy fallback when an article has *no* topics: title/excerpt must
 * contain an explicit Duʿā/Dhikr term — never broad words (morning, prayer, daily).
 * Prefer assigning an explicit `dua-dhikr` topic in CMS instead of relying on this.
 *
 * Note: avoid JS `\b` after letters like ā/ʿ — those are non-ASCII and break
 * word-boundary matching for “Duʿā”.
 */
const LEGACY_TITLE_EXCERPT_PATTERN =
  /(du[ʿ'ʼ]?[aā]|dhikr|adhk[aā]r|supplication)/i;

export interface ArticleTopicLike {
  slug?: { current?: string } | string | null;
  title?: string | null;
}

export interface ArticleLike {
  _id?: string | null;
  title?: string | null;
  excerpt?: string | null;
  topics?: ArticleTopicLike[] | null;
}

function topicSlug(topic: ArticleTopicLike): string {
  if (!topic.slug) return "";
  if (typeof topic.slug === "string") return topic.slug;
  return topic.slug.current ?? "";
}

function normalizeTopicSlug(slug: string): string {
  return slug
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ʿʾ'ʼ]/g, "")
    .toLowerCase()
    .trim();
}

function hasExplicitGuideTopicSlug(topic: ArticleTopicLike): boolean {
  const slug = normalizeTopicSlug(topicSlug(topic));
  if (!slug) return false;
  return (DUA_DHIKR_GUIDE_TOPIC_SLUGS as readonly string[]).some(
    (allowed) => normalizeTopicSlug(allowed) === slug,
  );
}

function hasDedicatedTopicTitle(topic: ArticleTopicLike): boolean {
  const title = topic.title?.trim() ?? "";
  return title.length > 0 && DEDICATED_TOPIC_TITLE_PATTERN.test(title);
}

function articleIdentity<T extends ArticleLike>(
  article: T,
  index: number,
): string {
  if (article._id) return article._id;
  return `title:${article.title ?? ""}:${index}`;
}

/**
 * Select published Duʿā & Dhikr guide articles for the landing hub.
 *
 * Selection order (per article):
 * 1. Explicit preferred topic slug (`dua-dhikr`, `dhikr`, `dua-etiquette`, …)
 * 2. Dedicated Duʿā/Dhikr topic title (narrow pattern — not “prayer” / “morning”)
 * 3. Legacy title/excerpt fallback *only* when the article has no topics
 *
 * Articles that already have topics but none match are rejected (no title fallback).
 * Results are de-duplicated and capped at {@link DUA_DHIKR_GUIDE_ARTICLE_LIMIT}.
 *
 * Callers must pass only published articles (e.g. `getAllArticles`).
 */
export function selectDuaDhikrGuideArticles<T extends ArticleLike>(
  articles: T[],
): T[] {
  const matched: T[] = [];
  const seen = new Set<string>();

  for (let index = 0; index < articles.length; index++) {
    if (matched.length >= DUA_DHIKR_GUIDE_ARTICLE_LIMIT) break;

    const article = articles[index];
    const id = articleIdentity(article, index);
    if (seen.has(id)) continue;

    const topics = article.topics ?? [];
    let include = false;

    if (topics.length > 0) {
      include = topics.some(
        (topic) =>
          hasExplicitGuideTopicSlug(topic) || hasDedicatedTopicTitle(topic),
      );
    } else {
      // Temporary compatibility fallback — prefer CMS topic assignment.
      include =
        LEGACY_TITLE_EXCERPT_PATTERN.test(article.title ?? "") ||
        LEGACY_TITLE_EXCERPT_PATTERN.test(article.excerpt ?? "");
    }

    if (!include) continue;
    seen.add(id);
    matched.push(article);
  }

  return matched;
}

export function shouldRenderGuidesAndArticlesSection(
  articles: unknown[],
): boolean {
  return articles.length > 0;
}

/**
 * Locale-safe decorative/collection title.
 * Danish never silently falls back to English taxonomy strings —
 * callers must supply an intentional Danish label (e.g. from messages)
 * when titleDa is absent.
 */
export function resolveLandingCollectionTitle(
  collection: { titleEn: string; titleDa?: string | null },
  locale: "en" | "da",
  intentionalDanishFallback?: string | null,
): { title: string; lang?: "en" } {
  if (locale === "da") {
    const danish = collection.titleDa?.trim();
    if (danish) return { title: danish };
    if (intentionalDanishFallback?.trim()) {
      return { title: intentionalDanishFallback.trim() };
    }
    // Last-resort intentional marking: English string with lang="en"
    return { title: collection.titleEn, lang: "en" };
  }
  return { title: collection.titleEn };
}
