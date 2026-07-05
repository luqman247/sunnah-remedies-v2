"use client";

/**
 * Related Entities Module — Internal linking from the knowledge graph.
 *
 * Links are projections of the graph, not hand-placed.
 * Modules are capped and ranked by strength then recency
 * to avoid link dilution.
 */

import Link from "next/link";
import { useTranslations } from "next-intl";

export interface RelatedItem {
  title: string;
  slug: string;
  type: string;
  description?: string;
  image?: string;
}

interface RelatedModuleProps {
  title: string;
  items: RelatedItem[];
  maxItems?: number;
}

const TYPE_PATH_MAP: Record<string, string> = {
  ingredient: "/knowledge/ingredient",
  condition: "/knowledge/condition",
  bodySystem: "/knowledge/bodySystem",
  hadith: "/knowledge/hadith",
  quranReferenceDoc: "/knowledge/quranReference",
  researchPaper: "/knowledge/research",
  scholar: "/knowledge/scholar",
  product: "/the-apothecary",
  article: "/knowledge-library",
  programme: "/the-academy",
  journey: "/sacred-journeys",
  faculty: "/faculty",
};

function getEntityUrl(type: string, slug: string): string {
  const base = TYPE_PATH_MAP[type] || `/knowledge/${type}`;
  return `${base}/${slug}`;
}

/**
 * A single related-* module (e.g. "Related Ingredients", "Related Research").
 */
export function RelatedModule({ title, items, maxItems = 6 }: RelatedModuleProps) {
  if (!items || items.length === 0) return null;

  const capped = items.slice(0, maxItems);

  return (
    <div style={{ marginBottom: "var(--s5)" }}>
      <h3
        className="type-eyebrow"
        style={{ marginBottom: "var(--s3)", color: "var(--muted)" }}
      >
        {title}
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s3)" }}>
        {capped.map((item) => (
          <Link
            key={`${item.type}-${item.slug}`}
            href={getEntityUrl(item.type, item.slug)}
            className="quiet-link"
            style={{
              padding: "var(--s2) var(--s3)",
              border: "1px solid var(--rule)",
              borderRadius: "var(--radius, 4px)",
              fontSize: "var(--step--1)",
            }}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Compose multiple related-* modules from entity relationships.
 */
export interface RelatedSectionProps {
  relationships: {
    target: { title: string; slug: string; type: string };
    relationType: string;
    strength?: number;
  }[];
}

type RelationMessageKey =
  | "relations.relatedConditions"
  | "relations.relatedRemedies"
  | "relations.relatedIngredients"
  | "relations.relatedSources"
  | "relations.relatedHadith"
  | "relations.relatedTopics"
  | "relations.relatedCourses"
  | "relations.relatedScholars";

const RELATION_TYPE_KEYS: Record<string, RelationMessageKey> = {
  treats: "relations.relatedConditions",
  treatedBy: "relations.relatedRemedies",
  containsIngredient: "relations.relatedIngredients",
  evidencedBy: "relations.relatedSources",
  citedIn: "relations.relatedHadith",
  contraindicatedIn: "relations.relatedConditions",
  partOfBodySystem: "relations.relatedTopics",
  taughtIn: "relations.relatedCourses",
  relatedTo: "relations.relatedTopics",
  preparedBy: "relations.relatedRemedies",
  authoredBy: "relations.relatedScholars",
  reviewedBy: "relations.relatedScholars",
  referencedIn: "relations.relatedSources",
};

export function RelatedSection({ relationships }: RelatedSectionProps) {
  const t = useTranslations("knowledge");

  if (!relationships || relationships.length === 0) return null;

  const sortedRelationships = [...relationships].sort(
    (a, b) => (b.strength || 5) - (a.strength || 5)
  );

  const sortedGrouped: Record<string, RelatedItem[]> = {};
  for (const rel of sortedRelationships) {
    if (!rel.target || !rel.target.slug) continue;
    const key = rel.relationType;
    if (!sortedGrouped[key]) sortedGrouped[key] = [];
    if (sortedGrouped[key].length < 6) {
      sortedGrouped[key].push({
        title: rel.target.title,
        slug: rel.target.slug,
        type: rel.target.type,
      });
    }
  }

  function relationLabel(relType: string): string {
    const key = RELATION_TYPE_KEYS[relType];
    if (key) return t(key);
    return relType;
  }

  return (
    <section className="leaf" aria-labelledby="related-heading">
      <div className="measure-wide">
        <h2
          id="related-heading"
          className="type-title"
          style={{ marginBottom: "var(--s5)" }}
        >
          {t("relatedHeading")}
        </h2>
        {Object.entries(sortedGrouped).map(([relType, items]) => (
          <RelatedModule
            key={relType}
            title={relationLabel(relType)}
            items={items}
          />
        ))}
      </div>
    </section>
  );
}
