/**
 * llms-full.txt — Expanded AI Discovery Manifest.
 *
 * Full entity catalogue with all knowledge types and their canonical URLs.
 * Generated from the knowledge graph (pillar/priority flags).
 */

import { NextResponse } from "next/server";
import { seoConfig } from "@/lib/seo/config";
import { client } from "@/sanity/lib/client";

export const dynamic = "force-static";
export const revalidate = 3600;

interface EntityEntry {
  type: string;
  title: string;
  slug: string;
  description?: string;
}

export async function GET() {
  const site = seoConfig.siteUrl;

  // Fetch all published entities from Sanity
  const entities = await client
    .fetch<EntityEntry[]>(
      `*[_type in ["product", "article", "programme", "journey", "ingredient", "condition"] && defined(slug.current)] | order(_type asc, title asc) {
        "type": _type,
        "title": coalesce(title, name),
        "slug": slug.current,
        "description": coalesce(metaDescription, shortDescription, pt::text(body[0..1]))
      }`
    )
    .catch(() => []);

  const typeUrlMap: Record<string, string> = {
    product: "/the-apothecary",
    article: "/knowledge-library",
    programme: "/the-academy",
    journey: "/sacred-journeys",
    ingredient: "/knowledge/ingredient",
    condition: "/knowledge/condition",
  };

  let content = `# Sunnah Remedies — Full Entity Catalogue
> Complete index of knowledge entities for AI systems.
> See /llms.txt for the concise institutional overview.

## Entity Count: ${entities.length}

`;

  // Group by type
  const grouped: Record<string, EntityEntry[]> = {};
  for (const e of entities) {
    if (!grouped[e.type]) grouped[e.type] = [];
    grouped[e.type].push(e);
  }

  for (const [type, items] of Object.entries(grouped)) {
    const basePath = typeUrlMap[type] || "/knowledge";
    content += `## ${type.charAt(0).toUpperCase() + type.slice(1)}s (${items.length})\n\n`;

    for (const item of items) {
      const url = `${site}${basePath}/${item.slug}`;
      content += `- [${item.title}](${url})`;
      if (item.description) {
        content += `: ${item.description.slice(0, 120)}`;
      }
      content += "\n";
    }
    content += "\n";
  }

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
