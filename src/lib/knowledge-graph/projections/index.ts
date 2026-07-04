/**
 * GROQ Projections — per-entity-type projection definitions.
 *
 * At projection time, each entity resolves: its outbound relationships,
 * inbound references, computed relatedEntities, reading time,
 * facetBundle, and citationBundle.
 */

/**
 * Base projection fields shared across all entity types.
 */
export const BASE_PROJECTION = `
  _id,
  _type,
  _updatedAt,
  "title": coalesce(title, name),
  "name": coalesce(name, title),
  "slug": slug.current,
  "image": coalesce(mainImage.asset->url, image.asset->url),
  "imageAlt": coalesce(mainImage.alt, image.alt)
`;

/**
 * SEO projection — resolves the editorial override object.
 */
export const SEO_PROJECTION = `
  seo {
    metaTitle,
    metaDescription,
    canonicalUrl,
    "socialImage": ogImage.asset->url,
    noIndex,
    robots,
    keywords,
    "focusEntities": focusEntities[]->{ _id, _type, "title": coalesce(title, name), "slug": slug.current }
  }
`;

/**
 * Relationships projection — resolves outbound edges with targets.
 */
export const RELATIONSHIPS_PROJECTION = `
  relationships[] {
    "target": target->{ _id, _type, "title": coalesce(title, name), "slug": slug.current, "image": coalesce(mainImage.asset->url, image.asset->url) },
    relationType,
    strength,
    note,
    evidenceLevel
  }
`;

/**
 * Author/reviewer projection.
 */
export const AUTHORSHIP_PROJECTION = `
  author->{ name, "slug": slug.current, jobTitle },
  reviewer->{ name, "slug": slug.current, jobTitle },
  reviewDate
`;

/**
 * FAQ projection.
 */
export const FAQ_PROJECTION = `
  faqs[] { question, answer }
`;

/* ── Complete entity projections ────────────────────────────────── */

export const INGREDIENT_PROJECTION = `{
  ${BASE_PROJECTION},
  description,
  definition,
  "shortDescription": coalesce(definition, description),
  botanicalName,
  arabicName,
  transliteration,
  "aliases": [botanicalName, arabicName, transliteration],
  evidenceLevel,
  "usageType": select(
    defined(traditionLayers) => "traditional",
    "modern"
  ),
  "preparation": preparation,
  "contraindications": contraindications,
  propheticBasis,
  featuredSnippetAnswer,
  ${RELATIONSHIPS_PROJECTION},
  ${FAQ_PROJECTION},
  ${AUTHORSHIP_PROJECTION},
  ${SEO_PROJECTION}
}`;

export const CONDITION_PROJECTION = `{
  ${BASE_PROJECTION},
  description,
  definition,
  "shortDescription": coalesce(definition, description),
  nameAr,
  "aliases": [nameAr],
  symptoms,
  "bodySystem": bodySystem->{ _id, name, "slug": slug.current },
  featuredSnippetAnswer,
  ${RELATIONSHIPS_PROJECTION},
  ${FAQ_PROJECTION},
  ${AUTHORSHIP_PROJECTION},
  ${SEO_PROJECTION}
}`;

export const ARTICLE_PROJECTION = `{
  ${BASE_PROJECTION},
  "description": coalesce(metaDescription, pt::text(body[0..2])),
  publishedAt,
  "updatedAt": _updatedAt,
  "wordCount": length(pt::text(body)),
  "section": category,
  "tags": tags,
  "bodyText": pt::text(body),
  ${AUTHORSHIP_PROJECTION},
  ${RELATIONSHIPS_PROJECTION},
  ${FAQ_PROJECTION},
  ${SEO_PROJECTION}
}`;

export const PRODUCT_PROJECTION = `{
  ${BASE_PROJECTION},
  "description": coalesce(metaDescription, description),
  "shopifyHandle": shopifyHandle,
  "ingredients": ingredients[]->{ _id, name, "slug": slug.current },
  "conditions": conditions[]->{ _id, name, "slug": slug.current },
  preparation,
  contraindications,
  evidenceLevel,
  propheticBasis,
  ${RELATIONSHIPS_PROJECTION},
  ${FAQ_PROJECTION},
  ${AUTHORSHIP_PROJECTION},
  ${SEO_PROJECTION}
}`;

export const COURSE_PROJECTION = `{
  ${BASE_PROJECTION},
  "description": coalesce(metaDescription, description),
  "level": level,
  "courseMode": courseMode,
  ${RELATIONSHIPS_PROJECTION},
  ${SEO_PROJECTION}
}`;

export const HADITH_PROJECTION = `{
  ${BASE_PROJECTION},
  arabicText,
  translation,
  collection,
  number,
  authenticity,
  narrator,
  topic,
  ${RELATIONSHIPS_PROJECTION},
  ${SEO_PROJECTION}
}`;
