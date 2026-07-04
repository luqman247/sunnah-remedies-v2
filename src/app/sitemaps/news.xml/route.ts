/**
 * News Sitemap — GUARDED.
 *
 * Route exists but returns empty until a newsArticle type and
 * a Google News relationship are enabled. Must only ever contain
 * articles < 48h old when active.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 3600;

const NEWS_ENABLED = false;

export async function GET() {
  if (!NEWS_ENABLED) {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n<!-- News sitemap: guarded. Enable when newsArticle type launches. -->\n</urlset>`,
      {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  }

  // When enabled: fetch articles with publishedAt within last 48 hours
  // const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  // ... fetch and render news entries

  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"></urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } }
  );
}
