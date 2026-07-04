/**
 * Search API — proxies search requests to the engine abstraction.
 *
 * Uses search-only keys client-side. Admin keys stay server-only.
 */

import { NextRequest, NextResponse } from "next/server";
import { algoliaEngine } from "@/lib/search/algolia";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);

  if (!query.trim()) {
    return NextResponse.json({
      hits: [],
      totalHits: 0,
      page: 1,
      totalPages: 0,
      facets: [],
      query: "",
      processingTimeMs: 0,
    });
  }

  try {
    const filters: Record<string, string> = {};
    if (type) filters.type = type;

    const result = await algoliaEngine.search({
      query,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
      page,
      hitsPerPage: 20,
      facets: ["type"],
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { hits: [], totalHits: 0, page: 1, totalPages: 0, facets: [], query, processingTimeMs: 0 },
      { status: 200 }
    );
  }
}
