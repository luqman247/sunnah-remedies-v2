/**
 * Algolia Search Engine Implementation.
 *
 * Implements the SearchEngine interface for Algolia.
 * All Algolia-specific code is isolated here.
 */

import type {
  SearchEngine,
  SearchQuery,
  SearchResult,
  SearchSuggestion,
  SearchRecord,
  IndexSettings,
} from "./engine";

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "";
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || "";
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY || "";
const INDEX_NAME = "content";

/**
 * Algolia REST API helper (avoids heavy SDK dependency).
 */
async function algoliaRequest(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown,
  useAdmin = false
): Promise<unknown> {
  const key = useAdmin ? ALGOLIA_ADMIN_KEY : ALGOLIA_SEARCH_KEY;
  const res = await fetch(
    `https://${ALGOLIA_APP_ID}-dsn.algolia.net${path}`,
    {
      method,
      headers: {
        "X-Algolia-Application-Id": ALGOLIA_APP_ID,
        "X-Algolia-API-Key": key,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    }
  );
  if (!res.ok) {
    throw new Error(`Algolia ${method} ${path}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function buildFilterString(filters: Record<string, string | string[] | boolean>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === "boolean") {
      parts.push(`${key}:${value}`);
    } else if (Array.isArray(value)) {
      const orParts = value.map((v) => `${key}:"${v}"`);
      parts.push(`(${orParts.join(" OR ")})`);
    } else {
      parts.push(`${key}:"${value}"`);
    }
  }
  return parts.join(" AND ");
}

export const algoliaEngine: SearchEngine = {
  async search(query: SearchQuery): Promise<SearchResult> {
    const params: Record<string, unknown> = {
      query: query.query,
      page: (query.page || 1) - 1,
      hitsPerPage: query.hitsPerPage || 20,
    };

    if (query.filters && Object.keys(query.filters).length > 0) {
      params.filters = buildFilterString(query.filters);
    }
    if (query.facets) {
      params.facets = query.facets;
    }

    const data = (await algoliaRequest(
      `/1/indexes/${INDEX_NAME}/query`,
      "POST",
      params
    )) as Record<string, unknown>;

    const hits = ((data.hits as Record<string, unknown>[]) || []).map((hit) => ({
      objectID: hit.objectID as string,
      type: hit.type as string,
      title: hit.title as string,
      subtitle: hit.subtitle as string | undefined,
      excerpt: hit.excerpt as string | undefined,
      slug: hit.slug as string,
      url: hit.url as string,
      image: hit.image as string | undefined,
      facets: hit as Record<string, string | string[] | boolean | number>,
    }));

    const facets: { attribute: string; values: { value: string; count: number }[] }[] = [];
    if (data.facets) {
      for (const [attr, vals] of Object.entries(data.facets as Record<string, Record<string, number>>)) {
        facets.push({
          attribute: attr,
          values: Object.entries(vals).map(([v, c]) => ({ value: v, count: c })),
        });
      }
    }

    return {
      hits,
      totalHits: data.nbHits as number || 0,
      page: (data.page as number || 0) + 1,
      totalPages: data.nbPages as number || 0,
      facets,
      query: query.query,
      processingTimeMs: data.processingTimeMS as number || 0,
    };
  },

  async suggest(query: string, limit = 5): Promise<SearchSuggestion[]> {
    const data = (await algoliaRequest(
      `/1/indexes/${INDEX_NAME}_query_suggestions/query`,
      "POST",
      { query, hitsPerPage: limit }
    )) as Record<string, unknown>;

    return ((data.hits as Record<string, unknown>[]) || []).map((hit) => ({
      query: hit.query as string,
      count: hit.count as number | undefined,
    }));
  },

  async index(records: SearchRecord[]): Promise<void> {
    if (!ALGOLIA_ADMIN_KEY || records.length === 0) return;
    await algoliaRequest(
      `/1/indexes/${INDEX_NAME}/batch`,
      "POST",
      { requests: records.map((r) => ({ action: "updateObject", body: r })) },
      true
    );
  },

  async remove(objectIDs: string[]): Promise<void> {
    if (!ALGOLIA_ADMIN_KEY || objectIDs.length === 0) return;
    await algoliaRequest(
      `/1/indexes/${INDEX_NAME}/batch`,
      "POST",
      { requests: objectIDs.map((id) => ({ action: "deleteObject", body: { objectID: id } })) },
      true
    );
  },

  async configure(settings: IndexSettings): Promise<void> {
    if (!ALGOLIA_ADMIN_KEY) return;
    await algoliaRequest(
      `/1/indexes/${INDEX_NAME}/settings`,
      "PUT",
      {
        searchableAttributes: settings.searchableAttributes,
        attributesForFaceting: settings.attributesForFaceting.map((a) => `filterOnly(${a})`),
        customRanking: settings.customRanking,
      },
      true
    );
  },
};
