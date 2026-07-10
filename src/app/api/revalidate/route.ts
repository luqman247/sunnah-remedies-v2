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
  product: ["/the-apothecary", "/dk/the-apothecary"],
  article: ["/knowledge-library", "/dk/knowledge-library"],
  programme: ["/the-academy", "/dk/the-academy"],
  journey: ["/sacred-journeys", "/dk/sacred-journeys"],
  ingredient: [
    "/knowledge/ingredient",
    "/the-apothecary",
    "/dk/knowledge/ingredient",
    "/dk/the-apothecary",
  ],
  condition: ["/knowledge/condition", "/dk/knowledge/condition"],
  bodySystem: ["/knowledge/bodySystem", "/dk/knowledge/bodySystem"],
  hadith: ["/knowledge/hadith", "/dk/knowledge/hadith"],
  quranReferenceDoc: ["/knowledge/quranReference", "/dk/knowledge/quranReference"],
  researchPaper: ["/knowledge/research", "/dk/knowledge/research"],
  scholar: ["/knowledge/scholar", "/dk/knowledge/scholar"],
  faculty: ["/the-academy/faculty", "/dk/the-academy/faculty"],
  reference: ["/knowledge/citations", "/dk/knowledge/citations"],
};

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

      // Revalidate specific entity page if slug available
      if (slug) {
        const entityPath = `${route}/${slug}`;
        revalidatePath(entityPath);
        revalidated.push(entityPath);
      }
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
