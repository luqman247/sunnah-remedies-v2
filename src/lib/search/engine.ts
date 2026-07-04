/**
 * Search Engine Abstraction.
 *
 * Every call site imports this abstraction, never a vendor SDK directly.
 * The engine is replaceable per §16 (migration) and §0.5 (portability).
 *
 * Launch: Algolia. Future: Meilisearch/vector engine.
 */

export interface SearchQuery {
  query: string;
  filters?: Record<string, string | string[] | boolean>;
  facets?: string[];
  page?: number;
  hitsPerPage?: number;
  sortBy?: string;
}

export interface SearchHit {
  objectID: string;
  type: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  slug: string;
  url: string;
  image?: string;
  facets: Record<string, string | string[] | boolean | number>;
}

export interface SearchFacet {
  attribute: string;
  values: { value: string; count: number }[];
}

export interface SearchResult {
  hits: SearchHit[];
  totalHits: number;
  page: number;
  totalPages: number;
  facets: SearchFacet[];
  query: string;
  processingTimeMs: number;
}

export interface SearchSuggestion {
  query: string;
  count?: number;
}

export interface SearchEngine {
  search(query: SearchQuery): Promise<SearchResult>;
  suggest(query: string, limit?: number): Promise<SearchSuggestion[]>;
  index(records: SearchRecord[]): Promise<void>;
  remove(objectIDs: string[]): Promise<void>;
  configure(settings: IndexSettings): Promise<void>;
}

export interface SearchRecord {
  objectID: string;
  type: string;
  title: string;
  subtitle?: string;
  aliases?: string[];
  transliteration?: string[];
  keywords?: string[];
  body?: string;
  excerpt?: string;
  slug: string;
  url: string;
  image?: string;
  // Facet fields
  condition?: string[];
  ingredient?: string[];
  bodySystem?: string[];
  evidenceLevel?: string;
  hadithAuthenticity?: string;
  preparation?: string[];
  difficulty?: string;
  audience?: string[];
  pregnancySafe?: boolean;
  children?: boolean;
  usageType?: string;
  availability?: string;
  category?: string[];
  collection?: string[];
  courseLevel?: string;
  scholar?: string[];
  author?: string[];
  publicationDate?: string;
  // Ranking
  editorialWeight?: number;
  popularity?: number;
  recency?: number;
}

export interface IndexSettings {
  searchableAttributes: string[];
  attributesForFaceting: string[];
  customRanking: string[];
  synonyms?: { type: "synonym" | "oneWaySynonym"; words: string[]; input?: string }[];
  typoTolerance?: Record<string, unknown>;
}

/* ── Default index configuration (version-controlled) ───────────── */

export const defaultIndexSettings: IndexSettings = {
  searchableAttributes: [
    "title",
    "subtitle,aliases,transliteration",
    "keywords",
    "excerpt,body",
  ],
  attributesForFaceting: [
    "type",
    "condition",
    "ingredient",
    "bodySystem",
    "evidenceLevel",
    "hadithAuthenticity",
    "preparation",
    "difficulty",
    "audience",
    "pregnancySafe",
    "children",
    "usageType",
    "availability",
    "category",
    "collection",
    "courseLevel",
    "scholar",
    "author",
    "publicationDate",
  ],
  customRanking: ["desc(editorialWeight)", "desc(popularity)", "desc(recency)"],
  synonyms: [
    { type: "synonym", words: ["black seed", "nigella sativa", "habbat al-barakah", "kalonji"] },
    { type: "synonym", words: ["honey", "asal", "عسل"] },
    { type: "synonym", words: ["cupping", "hijama", "hijamah", "حجامة"] },
    { type: "synonym", words: ["senna", "sana makki", "سنا"] },
    { type: "synonym", words: ["olive oil", "zayt al-zaytun", "زيت الزيتون"] },
    { type: "synonym", words: ["fasting", "siyam", "صيام"] },
    { type: "synonym", words: ["prophetic medicine", "tibb nabawi", "طب نبوي"] },
  ],
};
