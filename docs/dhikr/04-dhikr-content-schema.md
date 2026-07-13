# 04 — Dhikr Content Schema (Shape Only)

**Status: implemented as a prototype in Phase 2** — see `src/sanity/schemas/documents/dhikr/dhikr-item.ts` and `dhikr-category.ts`. This document is updated to match what was actually built, following repository validation (Objective 5 of the Phase 2 brief) that surfaced existing, reusable governance objects the original shape below didn't account for. It still contains **no data** — no Arabic text, no translations, no hadith references, no repetition counts.

The implemented shape follows `src/sanity/schemas/documents/global/department-card.ts` for general structure (see [00](00-existing-system-audit.md)), but for citation and approval fields it reuses two existing, already-battle-tested objects rather than the bespoke fields originally proposed here:

- `sourceCitation` + `gradingNote` (originally proposed) → **replaced by** `sourceReferences: array of sourceReference` — the existing `sourceReference` object (`src/sanity/schemas/objects/source-reference.ts`) already encodes citation + hadith collection/number/grading + the "unverified attribution" rule, a strictly better fit than inventing parallel fields.
- `reviewerId` / `reviewDate` (originally proposed) → **replaced by** `boardApprovals: array of boardApproval` — the existing `boardApproval` object (`src/sanity/schemas/objects/board-approval.ts`) already has "Scholarly Review Board" and "Editorial" as board options. The publish-time validator requires **both**, independently approved — a single approval of either kind is rejected. See [12](12-sanity-integration-plan.md) for the full validator design.

## Implemented `dhikrItem` shape

| Field | Type | Populated by | Notes |
|---|---|---|---|
| `_id` | string (system) | System | Sanity-managed identifier |
| `category` | reference → `dhikrCategory` | Editorial | See [05-category-taxonomy.md](05-category-taxonomy.md) |
| `order` | number | Editorial | Position within category, mirrors `department-card.order` pattern |
| `titleEn` / `titleDa` | string / string | Editorial | Short label, no religious content itself. Dual-field on one document — see the authoritative-Arabic-source decision below |
| `arabicText` | text (RTL) | Source compiler → scholarly reviewer | **Empty in this prototype.** Stored once on this document; never duplicated onto a separate English/Danish record |
| `transliteration` | text | Source compiler → scholarly reviewer | **Empty in this prototype** |
| `translationEn` / `translationDa` | text / text | Scholarly reviewer | **Empty in this prototype.** Derived from `arabicText`, not independent content — see [03](03-authenticity-and-scholarly-review-policy.md) |
| `sourceReferences` | array of `sourceReference` (existing object) | Source compiler → scholarly reviewer | **Empty in this prototype.** At least one required before `reviewStatus` can reach `published` |
| `recommendedRepetitions` | number, optional | Scholarly reviewer | **Not populated** — see restriction in [07](07-repeat-counter-specification.md) |
| `audioAsset` | reference → existing `audioAsset` document type | Audio pipeline | **Not populated or used in this prototype** — see [10](10-audio-review-and-delivery.md) |
| `reviewStatus` | enum: `sourced` \| `scholarly-review` \| `editorial-review` \| `approved` \| `published` | System / reviewers | Enforced via a custom validator (not just the Studio dropdown) — see [12](12-sanity-integration-plan.md). `approved` ≠ authorised for publication; only `published` is publicly visible, and only when the full eligibility rule is also satisfied |
| `boardApprovals` | array of `boardApproval` (existing object) | Scholarly reviewer, editorial reviewer | Both a `scholarly` and an `editorial` entry, each `approved: true`, required before `published` — one alone is rejected |
| `tags` | array of string, optional | Editorial | For future search/filter, not v1-critical |

## Implemented `dhikrCategory` shape

| Field | Type | Notes |
|---|---|---|
| `_id` | string (system) | |
| `nameEn` / `nameDa` | string / string | See [05](05-category-taxonomy.md) for draft label set |
| `order` | number | Display order, mirrors existing department-card pattern |
| `description` | text, optional | Editorial framing only — must not assert any reward/virtue claim (see [03](03-authenticity-and-scholarly-review-policy.md)) |

`dhikrCategory` deliberately has no `reviewStatus`/publication workflow of its own — categories are internal-preview-only in this phase, per [12](12-sanity-integration-plan.md).

## Explicit non-goals, still true after implementation

- No `arabicText`, `transliteration`, `translationEn/Da`, `sourceReferences`, `recommendedRepetitions`, or `audioAsset` has any real value populated anywhere in this prototype.
- This is a starting shape for implementation review, not a frozen contract.

## Why `recommendedRepetitions` is optional and unpopulated

Traditional adhkar are often associated with specific repetition counts from source material. This architecture pack is restricted from stating any such counts. The field exists in the shape so that, once scholarly review supplies a verified count for a specific item, there's a defined place to put it — but no value is assigned here or anywhere else in this pack.
