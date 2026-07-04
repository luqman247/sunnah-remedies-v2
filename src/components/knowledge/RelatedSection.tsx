/**
 * Related Entities Module — Internal linking from the knowledge graph.
 *
 * Links are projections of the graph, not hand-placed.
 * Modules are capped and ranked by strength then recency
 * to avoid link dilution.
 */

import Link from "next/link";

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

const RELATION_LABELS: Record<string, string> = {
  treats: "Related Conditions",
  treatedBy: "Possible Treatments",
  containsIngredient: "Key Ingredients",
  evidencedBy: "Supporting Research",
  citedIn: "Referenced In",
  contraindicatedIn: "Contraindications",
  partOfBodySystem: "Body System",
  taughtIn: "Related Courses",
  relatedTo: "Related",
  preparedBy: "Preparation",
  authoredBy: "Authors",
  reviewedBy: "Reviewed By",
  referencedIn: "Citations",
};

export function RelatedSection({ relationships }: RelatedSectionProps) {
  if (!relationships || relationships.length === 0) return null;

  // Group by relation type, sort by strength
  const grouped: Record<string, RelatedItem[]> = {};
  for (const rel of relationships) {
    if (!rel.target || !rel.target.slug) continue;
    const key = rel.relationType;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({
      title: rel.target.title,
      slug: rel.target.slug,
      type: rel.target.type,
    });
  }

  // Sort within each group by strength
  const sortedRelationships = [...relationships].sort(
    (a, b) => (b.strength || 5) - (a.strength || 5)
  );

  // Rebuild grouped with sorted order
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

  return (
    <section className="leaf" aria-labelledby="related-heading">
      <div className="measure-wide">
        <h2
          id="related-heading"
          className="type-title"
          style={{ marginBottom: "var(--s5)" }}
        >
          Related
        </h2>
        {Object.entries(sortedGrouped).map(([relType, items]) => (
          <RelatedModule
            key={relType}
            title={RELATION_LABELS[relType] || relType}
            items={items}
          />
        ))}
      </div>
    </section>
  );
}
