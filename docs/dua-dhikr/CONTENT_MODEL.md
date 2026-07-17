# Content Model

## Why a new document type, not a reuse of `dhikrItem`/`dhikrCategory`

`dhikrItem`/`dhikrCategory` (`src/sanity/schemas/documents/dhikr/`) remain
exactly as they are, serving only Morning/Evening Dhikr. Duʿā & Dhikr's
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
