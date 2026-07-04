/**
 * Full Reindex Script — scheduled nightly reconciliation.
 *
 * Fetches all indexable entities from Sanity, maps them to search records,
 * and upserts to the search index. Runs off-peak via cron.
 *
 * Usage: npx tsx scripts/reindex-full.ts
 */

import { createClient } from "@sanity/client";
import { algoliaEngine } from "../src/lib/search/algolia";
import {
  indexProduct,
  indexArticle,
  indexIngredient,
  indexCondition,
  indexCourse,
  indexHadith,
  indexJourney,
} from "../src/lib/search/indexers/entities";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function reindex() {
  console.log("[reindex] Starting full reconciliation...");
  const start = Date.now();

  // Fetch all indexable entities
  const [products, articles, ingredients, conditions, courses, hadith, journeys] =
    await Promise.all([
      client.fetch(`*[_type == "product" && defined(slug.current)] {
        _id, _type, "name": title, "title": title, "slug": slug.current,
        "description": coalesce(metaDescription, description),
        "image": mainImage.asset->url,
        "ingredients": ingredients[]->name,
        "conditions": conditions[]->name,
        "availability": availability
      }`),
      client.fetch(`*[_type == "article" && defined(slug.current)] {
        _id, _type, title, "slug": slug.current,
        "description": coalesce(metaDescription, pt::text(body[0..2])),
        "image": mainImage.asset->url,
        publishedAt,
        "author": [author->name],
        "bodyText": pt::text(body)
      }`),
      client.fetch(`*[_type == "ingredient" && defined(slug.current)] {
        _id, _type, name, "title": name, "slug": slug.current,
        "description": description,
        "definition": description,
        "image": image.asset->url,
        "aliases": [arabicName, transliteration, botanicalName],
        "transliteration": transliteration,
        "preparation": preparation
      }`),
      client.fetch(`*[_type == "condition" && defined(slug.current)] {
        _id, _type, name, "title": name, "slug": slug.current,
        "description": description,
        "definition": definition,
        "image": mainImage.asset->url,
        symptoms,
        "bodySystem": [bodySystem->name]
      }`),
      client.fetch(`*[_type == "programme" && defined(slug.current)] {
        _id, _type, "name": title, "title": title, "slug": slug.current,
        "description": coalesce(metaDescription, description),
        "image": mainImage.asset->url,
        "difficulty": level
      }`),
      client.fetch(`*[_type == "hadith" && defined(slug.current)] {
        _id, _type, title, "slug": slug.current,
        "description": coalesce(translation, title),
        "authenticity": authenticity,
        arabicText
      }`),
      client.fetch(`*[_type == "journey" && defined(slug.current)] {
        _id, _type, "name": title, "title": title, "slug": slug.current,
        "description": coalesce(metaDescription, description),
        "image": mainImage.asset->url,
        "difficulty": difficulty
      }`),
    ]);

  const allRecords = [
    ...products.map(indexProduct),
    ...articles.map(indexArticle),
    ...ingredients.map(indexIngredient),
    ...conditions.map(indexCondition),
    ...courses.map(indexCourse),
    ...hadith.map(indexHadith),
    ...journeys.map(indexJourney),
  ];

  console.log(`[reindex] ${allRecords.length} records to index`);

  // Batch in groups of 1000
  const BATCH_SIZE = 1000;
  for (let i = 0; i < allRecords.length; i += BATCH_SIZE) {
    const batch = allRecords.slice(i, i + BATCH_SIZE);
    await algoliaEngine.index(batch);
    console.log(`[reindex] Indexed batch ${Math.floor(i / BATCH_SIZE) + 1}`);
  }

  const elapsed = Date.now() - start;
  console.log(`[reindex] Complete. ${allRecords.length} records in ${elapsed}ms`);
}

reindex().catch((err) => {
  console.error("[reindex] Failed:", err);
  process.exit(1);
});
