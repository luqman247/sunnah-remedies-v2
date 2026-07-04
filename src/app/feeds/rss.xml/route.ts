/**
 * RSS Feed — site-wide editorial feed.
 *
 * Full-fidelity items: title, canonical link, GUID, author,
 * category, pubDate, and a clean summary.
 */

import { NextResponse } from "next/server";
import { seoConfig } from "@/lib/seo/config";
import { client } from "@/sanity/lib/client";

export const dynamic = "force-static";
export const revalidate = 3600;

interface FeedItem {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  author?: string;
  category?: string;
  id: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const site = seoConfig.siteUrl;

  const items = await client
    .fetch<FeedItem[]>(
      `*[_type in ["article"] && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) [0..49] {
        "title": title,
        "slug": slug.current,
        "description": coalesce(metaDescription, pt::text(body[0..2])),
        publishedAt,
        "author": author->name,
        "category": category,
        "id": _id
      }`
    )
    .catch(() => []);

  const rfc822 = (date: string) => new Date(date).toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(seoConfig.siteName)} — Knowledge Library</title>
    <link>${site}</link>
    <description>${escapeXml(seoConfig.defaultDescription)}</description>
    <language>en-gb</language>
    <managingEditor>${seoConfig.twitterHandle}</managingEditor>
    <atom:link href="${site}/feeds/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${rfc822(new Date().toISOString())}</lastBuildDate>
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${site}/knowledge-library/${item.slug}</link>
      <guid isPermaLink="false">${item.id}</guid>
      <description>${escapeXml(item.description?.slice(0, 300) || "")}</description>
      <pubDate>${rfc822(item.publishedAt)}</pubDate>
${item.author ? `      <author>${escapeXml(item.author)}</author>` : ""}
${item.category ? `      <category>${escapeXml(item.category)}</category>` : ""}
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
