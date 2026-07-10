# Good Example — Search and Filter System

## Purpose

Demonstrates a reusable, URL-driven search and filter system for the apothecary catalogue, with server-side filtering, shareable state, and graceful empty/error handling.

This is the reference for any list-with-filters surface (products, courses, articles).

---

# Why This Is a Good Example

- Filter state lives in the URL, so results are shareable and bookmarkable.
- Filtering happens server-side against the CMS; the client never holds the full dataset.
- The system is generic: the same engine drives products, courses, and articles.
- Empty and error states are first-class, not afterthoughts.
- Debounced input avoids hammering the server on every keystroke.

---

# State Lives in the URL

```
/apothecary?q=saffron&category=oils&sort=price-asc&page=2
```

The URL is the single source of truth for filter state. This means:

- Results are shareable and bookmarkable.
- Back/forward navigation restores prior filters.
- No client/server state divergence.

---

# Server-side Filtering

```tsx
// app/apothecary/page.tsx (illustrative)
export default async function Apothecary({ searchParams }: { searchParams: FilterParams }) {
  const filters = parseFilters(searchParams); // validated, typed
  const { items, total } = await sanityFetch({
    query: filteredProductsQuery,
    params: filters,
  });

  if (total === 0) return <EmptyState query={filters.q} />;
  return <ProductGrid items={items} pagination={{ total, ...filters }} />;
}
```

The CMS does the filtering. The browser receives only the page it needs.

---

# Reusable Filter Engine

The same `parseFilters` + query-builder pattern powers products, courses, and articles. Each surface supplies its own field map; the engine is shared.

```ts
// lib/search/parseFilters.ts (illustrative)
export function parseFilters(raw: Record<string, string>): Filters {
  return filtersSchema.parse({
    q: raw.q?.trim() ?? '',
    category: raw.category ?? null,
    sort: raw.sort ?? 'relevance',
    page: Number(raw.page ?? 1),
  });
}
```

---

# Acceptance Criteria

- [ ] Filter state is fully represented in the URL and is shareable.
- [ ] Filtering executes server-side against the CMS.
- [ ] The same engine serves at least two content types without duplication.
- [ ] Text input is debounced before navigation.
- [ ] Empty results show a helpful, query-aware empty state.
- [ ] Invalid filter params are rejected and reset safely.
- [ ] Keyboard and screen-reader users can operate every control.

---

# Related Anti-pattern

See `examples/bad/duplicate-schemas.md` and `examples/bad/mixed-business-logic.md`.

→ **Do this instead:** one shared, URL-driven engine; server-side filtering; no per-surface duplication.

---

# Related Documents

- Sanity Workflow
- Performance Checklist
- Accessibility Checklist

---

## Document Metadata

**Document Type:** Example (Good)
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Annual
