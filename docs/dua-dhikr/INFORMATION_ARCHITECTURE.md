# Information Architecture

## Routes

| Route | File | Notes |
|---|---|---|
| `/[locale]/knowledge-library/dua-dhikr` | `src/app/[locale]/knowledge-library/dua-dhikr/page.tsx` | Landing page: hero (embeds the existing `DhikrTimeNavigation`), search, quick access, browse-by-occasion grid, guided discovery, learning placeholders, continue reading. |
| `/[locale]/knowledge-library/dua-dhikr/[collectionSlug]` | `.../dua-dhikr/[collectionSlug]/page.tsx` | One statically-generated route per canonical collection slug (`generateStaticParams` reads `CANONICAL_COLLECTIONS`). |
| `/knowledge/dhikr/morning`, `/knowledge/dhikr/evening` | production, unmodified by this project | Complete, live Morning/Evening Dhikr collections (`dhikrItem` content, merged in from `main`). Linked from the Duʿa & Dhikr hero via the existing `DhikrTimeNavigation` component, never duplicated. |

Visiting `/knowledge-library/dua-dhikr/morning-dhikr` or `.../evening-dhikr`
redirects (Next.js `redirect()`) straight to the real Morning/Evening
routes — the canonical taxonomy includes them as collections (for the
alias map, search, and IA completeness) but they render no page of their
own, so there is exactly one page per piece of content.

## Why `knowledge-library`, not `knowledge`

The audit found three URL families sharing the word "knowledge":
`/knowledge-library/dhikr` (old plain-list landing), `/knowledge/dhikr/*`
(styled Morning/Evening reader), and an unrelated `/knowledge/[type]/[slug]`
SEO knowledge-graph route outside `[locale]` entirely. Duʿa & Dhikr
deliberately extends `knowledge-library`, matching the explicit route given
in the brief, and becomes the new canonical hub:

- `src/lib/navigation/site-structure.ts`'s Knowledge Library sidebar entry
  now points at `/knowledge-library/dua-dhikr` (was `/knowledge-library/dhikr`).
- `next.config.ts` permanently redirects `/knowledge-library/dhikr` →
  `/knowledge-library/dua-dhikr`.
- The old `src/app/[locale]/knowledge-library/dhikr/page.tsx` file is left
  in place, untouched, so its existing test coverage
  (`tests/dhikr/dhikr-landing-page.test.ts`) keeps passing and a direct link
  to the old URL still resolves (via the redirect) rather than 404ing.

## Canonical taxonomy

Parent groups, collections, subcategories, and the alias map are all
defined once in `src/lib/dua-dhikr/taxonomy.ts` — see
[CATEGORY_ALIAS_MAP.md](CATEGORY_ALIAS_MAP.md). This file, not Sanity, is
the source of truth for which routes exist: every collection's page
renders its structural shell (icon, title, subcategory filters, related
collections, previous/next-in-group navigation) immediately, whether or
not any Sanity content references it yet.

A `duaDhikrCollection` Sanity document is optional, additive editorial
enrichment for one canonical collection (its own reviewed introduction
copy, an icon override, etc.) — never a second source of routing truth.

## Entry-detail routes

Not built in this phase, mirroring the same deliberate choice already made
for Morning/Evening Dhikr (`docs/dhikr/21-decision-log.md`, ADR-015).
Entries render inline within their collection page
(`DuaDhikrEntryCollection` → `DuaDhikrEntryCard`). Adding one later is a
route addition only — the content model already carries a `slug` field on
`duaDhikrEntry` in preparation for it.
