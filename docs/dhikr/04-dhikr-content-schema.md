# 04 — Dhikr Content Schema (Shape Only)

This document specifies field **names and types** for a future Dhikr content model. It contains **no data** — no Arabic text, no translations, no hadith references, no repetition counts. It follows the pattern already established by `src/sanity/schemas/documents/global/department-card.ts` (see [00](00-existing-system-audit.md)) rather than inventing a new schema style. Actual Sanity schema files are **not created** by this document — see [12-sanity-integration-plan.md](12-sanity-integration-plan.md) for how this shape would later become a real schema.

## Proposed `dhikrItem` shape

| Field | Type (conceptual) | Populated by | Notes |
|---|---|---|---|
| `id` / `_id` | string (system) | System | Sanity-managed identifier |
| `category` | reference → `dhikrCategory` | Editorial | See [05-category-taxonomy.md](05-category-taxonomy.md) |
| `order` | number | Editorial | Position within category, mirrors `department-card.order` pattern |
| `titleEn` / `titleDa` | localised string | Editorial | Short label, no religious content itself |
| `arabicText` | text (RTL) | Source compiler → scholarly reviewer | **Empty in this architecture phase** |
| `transliteration` | text | Source compiler → scholarly reviewer | **Empty in this architecture phase** |
| `translationEn` / `translationDa` | localised text | Scholarly reviewer | **Empty in this architecture phase.** Derived from `arabicText`, not independent content — see authoritative-source rule in [03](03-authenticity-and-scholarly-review-policy.md) |
| `sourceCitation` | text | Source compiler | Collection/reference name — **empty placeholder only** |
| `gradingNote` | text | Scholarly reviewer | **Empty in this architecture phase; not populated until review policy in [03](03-authenticity-and-scholarly-review-policy.md) clears it** |
| `recommendedRepetitions` | number, optional | Scholarly reviewer | **Not populated in this architecture phase** — see restriction in [07](07-repeat-counter-specification.md) |
| `audioAsset` | reference → existing `audio-asset` schema pattern | Audio pipeline | See [10](10-audio-review-and-delivery.md) |
| `reviewStatus` | enum: `sourced` \| `scholarly-review` \| `editorial-review` \| `approved` \| `published` | System / reviewers | Drives publish gating per [03](03-authenticity-and-scholarly-review-policy.md) |
| `reviewerId` / `reviewDate` | string / date | Scholarly reviewer | Auditability |
| `tags` | array of string, optional | Editorial | For future search/filter, not v1-critical |

## Proposed `dhikrCategory` shape

| Field | Type | Notes |
|---|---|---|
| `id` / `_id` | string (system) | |
| `nameEn` / `nameDa` | localised string | See [05](05-category-taxonomy.md) for draft label set |
| `order` | number | Display order, mirrors existing department-card pattern |
| `description` | text, optional | Editorial framing only — must not assert any reward/virtue claim (see [03](03-authenticity-and-scholarly-review-policy.md)) |

## Explicit non-goals of this document

- Does not create any `.ts` Sanity schema file.
- Does not populate `arabicText`, `transliteration`, `translationEn/Da`, `sourceCitation`, `gradingNote`, or `recommendedRepetitions` with any real value.
- Does not decide the final field list — this is a starting shape for implementation review, not a frozen contract.

## Why `recommendedRepetitions` is optional and unpopulated

Traditional adhkar are often associated with specific repetition counts from source material. This architecture pack is restricted from stating any such counts. The field exists in the shape so that, once scholarly review supplies a verified count for a specific item, there's a defined place to put it — but no value is assigned here or anywhere else in this pack.
