/**
 * Revalidation Endpoint — triggered by Sanity/Shopify webhooks.
 *
 * On entity publish/update:
 * 1. Revalidates affected Next.js routes (on-demand ISR)
 * 2. Triggers incremental search reindex for the entity
 *
 * Webhook authenticity verified by shared secret.
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

const TYPE_ROUTE_MAP: Record<string, string[]> = {
  product: ["/the-apothecary"],
  article: ["/knowledge-library"],
  programme: ["/the-academy"],
  journey: ["/sacred-journeys"],
  ingredient: ["/knowledge/ingredient", "/the-apothecary"],
  condition: ["/knowledge/condition"],
  bodySystem: ["/knowledge/bodySystem"],
  hadith: ["/knowledge/hadith"],
  quranReferenceDoc: ["/knowledge/quranReference"],
  researchPaper: ["/knowledge/research"],
  scholar: ["/knowledge/scholar"],
  faculty: ["/the-academy/faculty"],
  reference: ["/knowledge/citations"],
  // These two routes physically live under src/app/[locale]/..., unlike
  // every other entry in this map — the [locale] segment MUST be included
  // in the pattern passed to revalidatePath (Next.js matches the literal
  // file-system route template, including every ancestor dynamic segment;
  // omitting [locale] does not match the actual cached route for either
  // the unprefixed English path or /da, and silently revalidates nothing).
  duaDhikrCollection: ["/[locale]/knowledge-library/dua-dhikr"],
  // Entries render inline within their collection page, not a route of
  // their own — revalidating the landing page alone doesn't touch the
  // per-collection dynamic pages, so those are revalidated separately below.
  duaDhikrEntry: ["/[locale]/knowledge-library/dua-dhikr"],
};

/**
 * Types whose content can appear on ANY /knowledge-library/dua-dhikr/[slug]
 * page (collection counts, entry lists) — revalidated as a dynamic-route
 * pattern in addition to the fixed paths above, since a single entry or
 * collection change can't otherwise be mapped to the one affected slug
 * without extra webhook payload data.
 */
const DUA_DHIKR_DYNAMIC_TYPES = new Set(["duaDhikrCollection", "duaDhikrEntry"]);

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidation-secret");

  if (REVALIDATION_SECRET && secret !== REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { _type, _id, slug } = body;

    if (!_type) {
      return NextResponse.json({ error: "Missing _type" }, { status: 400 });
    }

    const revalidated: string[] = [];

    // Revalidate type-specific routes
    const routes = TYPE_ROUTE_MAP[_type] || [];
    for (const route of routes) {
      revalidatePath(route, "layout");
      revalidated.push(route);

      // Revalidate specific entity page if slug available — skipped for
      // the Duʿa & Dhikr types: `${route}/${slug}` would mix the literal
      // "[locale]" segment with a concrete slug, which matches neither a
      // real path nor a valid template. The dynamic-pattern block below
      // covers every locale + slug combination correctly instead.
      if (slug && !DUA_DHIKR_DYNAMIC_TYPES.has(_type)) {
        const entityPath = `${route}/${slug}`;
        revalidatePath(entityPath);
        revalidated.push(entityPath);
      }
    }

    // A duaDhikrEntry/duaDhikrCollection change can affect any populated
    // collection page's entry list/count, not just one slug — revalidate
    // the whole dynamic-route pattern (every locale, every slug) rather
    // than guessing a single one.
    if (DUA_DHIKR_DYNAMIC_TYPES.has(_type)) {
      const pattern = "/[locale]/knowledge-library/dua-dhikr/[collectionSlug]";
      revalidatePath(pattern, "page");
      revalidated.push(pattern);
    }

    // Always revalidate sitemap and llms.txt on content changes
    revalidatePath("/sitemap.xml");
    revalidatePath("/llms.txt");
    revalidatePath("/llms-full.txt");
    revalidatePath("/feeds/rss.xml");

    // Revalidate homepage (may reference entities)
    revalidatePath("/");

    return NextResponse.json({
      revalidated: true,
      paths: revalidated,
      type: _type,
      id: _id,
    });
  } catch (error) {
    console.error("[revalidate] Error:", error);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
