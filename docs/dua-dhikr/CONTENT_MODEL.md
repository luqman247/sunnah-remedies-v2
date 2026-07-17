# Content Model

## Taxonomy authority model

- **Code owns the canonical category identifiers, slugs, grouping, and
  aliases.** `src/lib/dua-dhikr/taxonomy.ts` (`CANONICAL_COLLECTIONS`,
  `PARENT_GROUPS`, `ALIAS_MAP`) is the single source of truth — see
  [CATEGORY_ALIAS_MAP.md](CATEGORY_ALIAS_MAP.md).
- **Sanity owns editable presentation content** attached to those canonical
  identifiers: a `duaDhikrCollection` document's `introductionEn/Da`,
  `whenReadEn/Da`, `descriptionDa`, `iconKey` override, `relatedCollections`,
  and `seo` — never the identity of the category itself.
- **Sanity editors cannot create an arbitrary public canonical category.**
  `duaDhikrCollection.slug` is validated (Studio-side and at write time)
  against `CANONICAL_COLLECTION_SLUGS`; a slug outside that list cannot be
  saved. Every collection route is generated from the code list
  (`generateStaticParams` in the `[collectionSlug]` route), never from
  whatever `duaDhikrCollection` documents happen to exist — so an editor
  creating (or failing to create) a Sanity document never changes which
  routes exist.
- **The import pipeline resolves source-document labels into canonical,
  code-defined categories** — `resolveCollectionSlug()` in `taxonomy.ts`,
  used by both `src/lib/dua-dhikr/import/schema.ts` and the live search/
  filter UI, so "eating", "wudu", "before wudu" etc. all resolve to one
  canonical collection rather than becoming new ones.

This is enforced, not just documented, by:
`tests/dua-dhikr/dua-dhikr-taxonomy-and-aliases.test.ts` (no duplicate
canonical slugs/aliases, no alias claimed by two collections),
`tests/dua-dhikr/dua-dhikr-schema-and-review-bypass.test.ts` (schema slug
validation references the canonical list), and
`tests/dua-dhikr/dua-dhikr-import-pipeline.test.ts` (an unresolvable
`collectionSlug` is rejected before any write, and Morning/Evening Dhikr
slugs are excluded from `duaDhikrEntry` generation entirely — see
`tests/dua-dhikr/dua-dhikr-routes-and-locale.test.ts` for the
redirect-not-duplicate check).

## Why a new document type, not a reuse of `dhikrItem`/`dhikrCategory`

`dhikrItem`/`dhikrCategory` (`src/sanity/schemas/documents/dhikr/`) remain
exactly as they are, serving only Morning/Evening Dhikr. Duʿa & Dhikr's
field set is broader (multi-collection references, subcategories, occasion
tags, instruction/explanation text, related entries, import provenance),
so it is modelled as two new, sibling document types —
`duaDhikrCollection` and `duaDhikrEntry` — that reuse the same *objects*
(`sourceReference`, `boardApproval`, `provenanceNote`, `seo`) and the same
review-pipeline shape, rather than duplicating either the schema or the
publication-gate logic wholesale.

## `duaDhikrCollection`

`src/sanity/schemas/documents/dua-dhikr/dua-dhikr-collection.ts`

| Field | Type | Notes |
|---|---|---|
| `internalTitle` | string | Studio-only |
| `titleEn` / `titleDa` | string | Public |
| `slug` | slug | Must match a slug in `CANONICAL_COLLECTION_SLUGS` |
| `parentGroup` | string (enum) | From `PARENT_GROUPS` |
| `order`, `featured` | number, boolean | |
| `iconKey` | string (enum) | From `ICON_KEYS` |
| `visualMotifKey` | string | Free text, optional |
| `descriptionEn/Da`, `introductionEn/Da`, `whenReadEn/Da` | text | See "Copy gating" below |
| `searchAliases` | string[] | Editorial additions beyond the code-level alias map |
| `subcategories` | object[] | `{ slug, titleEn, titleDa }`, mirrors the taxonomy |
| `relatedCollections` | reference[] → `duaDhikrCollection` | Powers "Related collections" and umbrella groupings (e.g. Marriage & Children) |
| `seo` | object (`seo`) | Reused SEO/social object |
| `reviewStatus`, `editorialPublicationStatus`, `lastReviewedAt` | — | See [REVIEW_BYPASS.md](REVIEW_BYPASS.md) |

**Copy gating**: `reviewStatus`/`editorialPublicationStatus` gate only this
document's own `introductionEn/Da` and `whenReadEn/Da` prose — never
whether the collection's route renders (it always does, from the fixed
taxonomy) and never whether its entries appear (each entry gates itself).
This mirrors `dhikrCategory`'s existing principle that structural labels
are not religious content, while still letting editorial reviewers sign
off on genuinely written collection copy before it goes public.

## `duaDhikrEntry`

`src/sanity/schemas/documents/dua-dhikr/dua-dhikr-entry.ts`

| Requested field | Schema field(s) |
|---|---|
| Internal title | `internalTitle` |
| Public title | `titleEn` / `titleDa` |
| Slug / stable identifier | `slug`, `importIdentifier` |
| Collection references | `collections` (ref[] → `duaDhikrCollection`, required, min 1) |
| Subcategory references | `subcategorySlugs` (string[]) |
| What it is for | `whatItIsFor` |
| Arabic | `arabicText` |
| Transliteration | `transliteration` |
| Translation | `translationEn` / `translationDa` |
| Repetition count | `recommendedRepetitions` |
| Timing / Occasion | `timingLabel`, `occasion` |
| Instruction | `instructionText` |
| Virtue | `virtueText` |
| Explanation | `explanationText` |
| Qurʾān/hadith reference, source URL, source type, hadith collection/number | `sourceReferences[]` (reused `sourceReference` object) |
| Authentication note | `authenticationNote` (+ each reference's own `hadithGrading`) |
| Audio | `audioAsset` (reused `audioAsset` document) |
| Search aliases | `searchAliases` |
| Related entries | `relatedEntries` (ref[] → `duaDhikrEntry`) |
| Sort order / Featured | `order`, `featured` |
| Localised fields | every `*En`/`*Da` pair above |
| Editorial notes | `editorialNotes` (internal only, never projected publicly) |
| Review fields | `reviewStatus`, `boardApprovals`, `editorialPublicationStatus` |
| Import identifier | `importIdentifier` |
| Content provenance | `contentProvenance` (reused `provenanceNote` object) |
| Last modified date | `lastReviewedAt` + Sanity's own `_updatedAt` |

## Typed GROQ projections

`src/sanity/lib/queries.ts` — `duaDhikrEntriesPublicEligibleQuery`,
`duaDhikrEntriesEditoriallyPublicEligibleQuery`, `duaDhikrCollectionsQuery`.
Every projection lists fields explicitly (never `...`) so a future schema
field is excluded by default until deliberately added — same discipline as
the existing Dhikr queries. `src/sanity/lib/dua-dhikr-public-fetch.ts`
exposes fully-typed `DuaDhikrEntryPublic` / `DuaDhikrCollectionPublic`
interfaces; no internal field (`reviewStatus`, `boardApprovals`,
`editorialNotes`, `contentProvenance`, `importIdentifier`) is ever present
on the public shape.
