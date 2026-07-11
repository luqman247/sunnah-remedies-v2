# Apothecary draft preview — Phase 0 audit

## Canonical public routes (from code)

| Locale | Sanity `language` | Public path |
| --- | --- | --- |
| English (default) | `en` | `/the-apothecary/{slug}` |
| Danish | `da` | `/dk/the-apothecary/{slug}` |

Source: `src/i18n/locales.ts` (en prefix `""`, da prefix `/dk`), `productActions.productPublicPath`, `product-studio.resolveProductProductionUrl`.

## Why draft preview returns 404 (multiple causes)

1. **Public GROQ filter** (`productBySlugQuery`) excludes draft documents, non-public statuses, and `visibleInApothecary == false`.
2. **Service layer** (`getPublicRemedyBySlug` → `isPubliclyVisibleProduct`) rejects draft/hidden even if a document were returned.
3. **Fetch always uses published client** — `safeFetch` never switches to `previewClient` when Next.js Draft Mode is enabled.
4. **Draft Mode enable works in isolation** (`/api/draft`) and the layout shows a banner, but the product page never uses draft-aware data.
5. **Local env gap** — `.env.local` lacked `SANITY_PREVIEW_SECRET` / `SANITY_API_TOKEN`, so Studio preview URLs often opened the raw public path without Draft Mode, and draft perspective could not authenticate.

Not primarily a wrong locale route when Studio builds `/the-apothecary/...` for English.

## Phase 1 verification (local)

| Check | Result |
| --- | --- |
| Public `/en/the-apothecary/apothecary-verification-product` | Soft 404 UI — product copy not shown |
| Catalogue | Does not list verification product |
| `GET /api/draft` wrong secret | 401 |
| `GET /api/draft` valid secret → `/en/...` | 307 + Draft Mode cookie; page 200 with draft content + banner |
| Public catalogue filter unchanged | Still excludes draft/hidden |

Test document (draft, hidden): `drafts.product-apothecary-verification-preview`  
Slug: `apothecary-verification-product`
