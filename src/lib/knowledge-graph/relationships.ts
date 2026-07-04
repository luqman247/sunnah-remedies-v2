/**
 * Knowledge Graph — Relationship Types & Resolution.
 *
 * The relationship vocabulary is centrally owned. Adding a type
 * is a schema change. This prevents sprawl and keeps the graph
 * queryable and internal-linking modules coherent.
 */

export const RELATION_TYPES = [
  "treats",
  "treatedBy",
  "containsIngredient",
  "evidencedBy",
  "citedIn",
  "contraindicatedIn",
  "partOfBodySystem",
  "taughtIn",
  "relatedTo",
  "preparedBy",
  "authoredBy",
  "reviewedBy",
  "referencedIn",
  "synonymOf",
  "parentOf",
  "childOf",
] as const;

export type RelationType = (typeof RELATION_TYPES)[number];

export interface Relationship {
  target: { _ref: string; _type: string };
  relationType: RelationType;
  strength?: number;
  note?: string;
  evidenceLevel?: string;
}

/**
 * Maps a relation type to its inverse for bidirectional resolution.
 */
export const INVERSE_RELATIONS: Partial<Record<RelationType, RelationType>> = {
  treats: "treatedBy",
  treatedBy: "treats",
  containsIngredient: "containsIngredient",
  evidencedBy: "referencedIn",
  citedIn: "referencedIn",
  contraindicatedIn: "contraindicatedIn",
  partOfBodySystem: "partOfBodySystem",
  taughtIn: "taughtIn",
  relatedTo: "relatedTo",
  authoredBy: "authoredBy",
  reviewedBy: "reviewedBy",
  parentOf: "childOf",
  childOf: "parentOf",
};

/**
 * GROQ fragment to resolve outbound relationships on an entity.
 */
export const RELATIONSHIPS_PROJECTION = `
  relationships[] {
    "target": target->{
      _id,
      _type,
      "title": coalesce(title, name),
      "slug": slug.current,
      "image": mainImage.asset->url
    },
    relationType,
    strength,
    note,
    evidenceLevel
  }
`;

/**
 * GROQ fragment to find all inbound references to a given entity ID.
 * Used for reverse-graph resolution.
 */
export function inboundReferencesQuery(entityId: string): string {
  return `*[references("${entityId}")] {
    _id,
    _type,
    "title": coalesce(title, name),
    "slug": slug.current,
    relationships[target._ref == "${entityId}"] {
      relationType,
      strength
    }
  }`;
}

/**
 * Resolve related entities for a given entity, ranked by strength then recency.
 * Caps at maxResults to avoid link dilution.
 */
export interface RelatedEntity {
  id: string;
  type: string;
  title: string;
  slug: string;
  image?: string;
  relationType: RelationType;
  strength: number;
}

export function rankRelatedEntities(
  relationships: Relationship[],
  resolvedTargets: Record<string, { title: string; slug: string; type: string; image?: string }>,
  maxResults = 6
): RelatedEntity[] {
  return relationships
    .filter((r) => resolvedTargets[r.target._ref])
    .map((r) => {
      const target = resolvedTargets[r.target._ref];
      return {
        id: r.target._ref,
        type: target.type,
        title: target.title,
        slug: target.slug,
        image: target.image,
        relationType: r.relationType,
        strength: r.strength || 1,
      };
    })
    .sort((a, b) => b.strength - a.strength)
    .slice(0, maxResults);
}
