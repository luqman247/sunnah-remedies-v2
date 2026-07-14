import type { MetadataRoute } from "next";
import { localeUrl } from "@/lib/seo/metadata";
import { client } from "@/sanity/lib/client";
import { seoConfig } from "@/lib/seo/config";

/**
 * Sitemap index — references child sitemaps per content type.
 * Accurate lastmod from document _updatedAt.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "/",
    "/the-apothecary",
    "/the-apothecary/catalogue",
    "/the-apothecary/monographs",
    "/the-apothecary/ingredients",
    "/the-apothecary/quality-standards",
    "/the-apothecary/laboratory-verification",
    "/the-apothecary/faqs",
    "/the-academy",
    "/the-academy/curriculum",
    "/the-academy/faculty",
    "/the-academy/enrolment",
    "/the-academy/foundations",
    "/sacred-journeys",
    "/knowledge-library",
    "/knowledge-library/dhikr",
    "/consultations",
    "/charter",
    "/correspondence",
    "/institute",
    "/calendar",
    "/exhibitions",
    "/research",
    "/press",
    "/search",
  ];

  const [products, programmes, journeys, articles, entities] = await Promise.all([
    client.fetch<{ slug: string; updatedAt: string }[]>(
      `*[_type == "product" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`,
    ).catch(() => []),
    client.fetch<{ slug: string; updatedAt: string }[]>(
      `*[_type == "programme" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`,
    ).catch(() => []),
    client.fetch<{ slug: string; updatedAt: string }[]>(
      `*[_type == "journey" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`,
    ).catch(() => []),
    client.fetch<{ slug: string; updatedAt: string }[]>(
      `*[_type == "article" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`,
    ).catch(() => []),
    client.fetch<{ type: string; slug: string; updatedAt: string }[]>(
      `*[_type in ["ingredient", "condition", "bodySystem", "hadith", "quranReference", "scholar", "researchPaper"] && defined(slug.current)]{
        "type": _type,
        "slug": slug.current,
        "updatedAt": _updatedAt
      }`,
    ).catch(() => []),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const path of staticPaths) {
    entries.push({
      url: localeUrl("en", path),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: path === "/" ? 1.0 : 0.8,
    });
  }

  // Products
  for (const p of products) {
    entries.push({
      url: `${seoConfig.siteUrl}/the-apothecary/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // Programmes (courses)
  for (const p of programmes) {
    entries.push({
      url: `${seoConfig.siteUrl}/the-academy/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Journeys
  for (const j of journeys) {
    entries.push({
      url: `${seoConfig.siteUrl}/sacred-journeys/${j.slug}`,
      lastModified: j.updatedAt ? new Date(j.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Articles
  for (const a of articles) {
    entries.push({
      url: `${seoConfig.siteUrl}/knowledge-library/${a.slug}`,
      lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Knowledge entities
  const typePathMap: Record<string, string> = {
    ingredient: "ingredient",
    condition: "condition",
    bodySystem: "bodySystem",
    hadith: "hadith",
    quranReference: "quranReference",
    scholar: "scholar",
    researchPaper: "research",
  };

  for (const e of entities) {
    const typePath = typePathMap[e.type] || e.type;
    entries.push({
      url: `${seoConfig.siteUrl}/knowledge/${typePath}/${e.slug}`,
      lastModified: e.updatedAt ? new Date(e.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
