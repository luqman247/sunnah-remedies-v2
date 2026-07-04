/**
 * Per-collection RSS Feed.
 *
 * Generates an RSS feed for a specific content collection/category.
 * e.g. /feeds/remedies/rss.xml, /feeds/research/rss.xml
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
  id: string;
}

const COLLECTION_CONFIG: Record<string, { query: string; basePath: string; title: string }> = {
  remedies: {
    query: `*[_type == "product" && defined(slug.current)] | order(_createdAt desc) [0..29]`,
    basePath: "/the-apothecary",
    title: "The Apothecary — Remedies",
  },
  articles: {
    query: `*[_type == "article" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) [0..29]`,
    basePath: "/knowledge-library",
    title: "Knowledge Library — Articles",
  },
  courses: {
    query: `*[_type == "programme" && defined(slug.current)] | order(_createdAt desc) [0..29]`,
    basePath: "/the-academy",
    title: "The Academy — Courses",
  },
  journeys: {
    query: `*[_type == "journey" && defined(slug.current)] | order(_createdAt desc) [0..29]`,
    basePath: "/sacred-journeys",
    title: "Sacred Journeys",
  },
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface Props {
  params: Promise<{ collection: string }>;
}

export async function generateStaticParams() {
  return Object.keys(COLLECTION_CONFIG).map((collection) => ({ collection }));
}

export async function GET(_request: Request, { params }: Props) {
  const { collection } = await params;
  const config = COLLECTION_CONFIG[collection];

  if (!config) {
    return new NextResponse("Not found", { status: 404 });
  }

  const site = seoConfig.siteUrl;

  const items = await client
    .fetch<FeedItem[]>(
      `${config.query} {
        "title": coalesce(title, name),
        "slug": slug.current,
        "description": coalesce(metaDescription, description, pt::text(body[0..1])),
        "publishedAt": coalesce(publishedAt, _createdAt),
        "author": author->name,
        "id": _id
      }`
    )
    .catch(() => []);

  const rfc822 = (date: string) => new Date(date).toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(seoConfig.siteName)} — ${escapeXml(config.title)}</title>
    <link>${site}${config.basePath}</link>
    <description>${escapeXml(config.title)} from ${seoConfig.siteName}</description>
    <language>en-gb</language>
    <atom:link href="${site}/feeds/${collection}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${rfc822(new Date().toISOString())}</lastBuildDate>
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${site}${config.basePath}/${item.slug}</link>
      <guid isPermaLink="false">${item.id}</guid>
      <description>${escapeXml(item.description?.slice(0, 300) || "")}</description>
      <pubDate>${rfc822(item.publishedAt)}</pubDate>
${item.author ? `      <author>${escapeXml(item.author)}</author>` : ""}
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
