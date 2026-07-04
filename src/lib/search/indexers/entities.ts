/**
 * Search Indexers — entity → search record mappers.
 *
 * Each indexer takes a Sanity entity projection and maps it to a
 * flat SearchRecord for the unified search index.
 */

import type { SearchRecord } from "../engine";
import { seoConfig } from "../../seo/config";

interface BaseEntity {
  _id: string;
  _type: string;
  title?: string;
  name?: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  definition?: string;
  image?: string;
  aliases?: string[];
  transliteration?: string;
  keywords?: string[];
  category?: string[];
  collection?: string[];
}

function baseRecord(entity: BaseEntity, urlPath: string): SearchRecord {
  return {
    objectID: entity._id,
    type: entity._type,
    title: entity.title || entity.name || "",
    slug: entity.slug,
    url: `${seoConfig.siteUrl}${urlPath}/${entity.slug}`,
    excerpt: entity.definition || entity.shortDescription || entity.description?.slice(0, 300),
    image: entity.image,
    aliases: entity.aliases,
    transliteration: entity.transliteration ? [entity.transliteration] : undefined,
    keywords: entity.keywords,
    category: entity.category,
    collection: entity.collection,
  };
}

/* ── Product indexer ─────────────────────────────────────────────── */

interface ProductEntity extends BaseEntity {
  price?: number;
  availability?: string;
  ingredients?: string[];
  conditions?: string[];
  bodySystem?: string[];
  editorialWeight?: number;
}

export function indexProduct(entity: ProductEntity): SearchRecord {
  return {
    ...baseRecord(entity, "/the-apothecary"),
    ingredient: entity.ingredients,
    condition: entity.conditions,
    bodySystem: entity.bodySystem,
    availability: entity.availability,
    editorialWeight: entity.editorialWeight || 5,
    popularity: 0,
    recency: Date.now(),
  };
}

/* ── Article indexer ─────────────────────────────────────────────── */

interface ArticleEntity extends BaseEntity {
  publishedAt?: string;
  author?: string[];
  bodyText?: string;
  tags?: string[];
}

export function indexArticle(entity: ArticleEntity): SearchRecord {
  return {
    ...baseRecord(entity, "/knowledge-library"),
    body: entity.bodyText?.slice(0, 5000),
    author: entity.author,
    publicationDate: entity.publishedAt,
    editorialWeight: 5,
    popularity: 0,
    recency: entity.publishedAt ? new Date(entity.publishedAt).getTime() : Date.now(),
  };
}

/* ── Ingredient indexer ──────────────────────────────────────────── */

interface IngredientEntity extends BaseEntity {
  evidenceLevel?: string;
  usageType?: string;
  pregnancySafe?: boolean;
  childrenSafe?: boolean;
  preparation?: string[];
  conditions?: string[];
  bodySystem?: string[];
}

export function indexIngredient(entity: IngredientEntity): SearchRecord {
  return {
    ...baseRecord(entity, "/knowledge/ingredient"),
    evidenceLevel: entity.evidenceLevel,
    usageType: entity.usageType,
    pregnancySafe: entity.pregnancySafe,
    children: entity.childrenSafe,
    preparation: entity.preparation,
    condition: entity.conditions,
    bodySystem: entity.bodySystem,
    editorialWeight: 7,
    popularity: 0,
    recency: Date.now(),
  };
}

/* ── Condition indexer ───────────────────────────────────────────── */

interface ConditionEntity extends BaseEntity {
  symptoms?: string[];
  bodySystem?: string[];
  ingredients?: string[];
}

export function indexCondition(entity: ConditionEntity): SearchRecord {
  return {
    ...baseRecord(entity, "/knowledge/condition"),
    bodySystem: entity.bodySystem,
    ingredient: entity.ingredients,
    editorialWeight: 7,
    popularity: 0,
    recency: Date.now(),
  };
}

/* ── Course (programme) indexer ──────────────────────────────────── */

interface CourseEntity extends BaseEntity {
  courseLevel?: string;
  difficulty?: string;
  bodySystem?: string[];
}

export function indexCourse(entity: CourseEntity): SearchRecord {
  return {
    ...baseRecord(entity, "/the-academy"),
    courseLevel: entity.courseLevel,
    difficulty: entity.difficulty,
    bodySystem: entity.bodySystem,
    editorialWeight: 6,
    popularity: 0,
    recency: Date.now(),
  };
}

/* ── Hadith indexer ──────────────────────────────────────────────── */

interface HadithEntity extends BaseEntity {
  authenticity?: string;
  scholar?: string[];
  arabicText?: string;
}

export function indexHadith(entity: HadithEntity): SearchRecord {
  return {
    ...baseRecord(entity, "/knowledge/hadith"),
    hadithAuthenticity: entity.authenticity,
    scholar: entity.scholar,
    body: entity.arabicText,
    editorialWeight: 8,
    popularity: 0,
    recency: Date.now(),
  };
}

/* ── Journey indexer ─────────────────────────────────────────────── */

interface JourneyEntity extends BaseEntity {
  difficulty?: string;
}

export function indexJourney(entity: JourneyEntity): SearchRecord {
  return {
    ...baseRecord(entity, "/sacred-journeys"),
    difficulty: entity.difficulty,
    editorialWeight: 5,
    popularity: 0,
    recency: Date.now(),
  };
}
