# 12 — Sanity Integration Plan

**Status: implemented as a prototype in Phase 2.** This document now describes what was actually built, not just a plan.

## Schema location (resolves OD-04)

`dhikrItem` and `dhikrCategory` were added under `src/sanity/schemas/documents/dhikr/` — a new subfolder, matching the per-department convention (`apothecary/`, `academy/`, `journeys/`, `clinical/`) rather than the `global/` folder. Both are registered in `src/sanity/schemas/index.ts` in a dedicated "Dhikr" section. Field-level validation follows the same `defineField`/`Rule` pattern already used in `department-card.ts`.

`dhikrItem`/`dhikrCategory` are **not** added to the custom Studio desk structure (`src/sanity/structure/index.ts`), matching the precedent set by `clinicalProtocol` and `practitionerResource` — neither of those is desk-structured either, and both fall back to Sanity's default document listing.

## Reuse of existing objects (not duplicated)

- `sourceReferences: array of sourceReference` — reuses `src/sanity/schemas/objects/source-reference.ts` as-is (citation, hadith collection/number/grading, "unverified attribution" rule). Not duplicated.
- `boardApprovals: array of boardApproval` — reuses `src/sanity/schemas/objects/board-approval.ts` as-is ("Scholarly Review Board" and "Editorial" board options already exist). Not duplicated.
- `audioAsset` references the existing `audioAsset` document type. Not populated or used in this prototype.

## Publish gating — the canonical eligibility rule

The single most important integration rule: **`reviewStatus == "published"` alone is not sufficient for public eligibility.** `approved` means required reviews passed; it does not mean publication has been authorised or activated, and neither state alone proves the mandatory content fields or both required board approvals are actually present.

The full rule is defined once, in `src/sanity/lib/dhikr-publication-gate.ts`, as both a GROQ fragment (`DHIKR_ELIGIBILITY_GROQ`) and a logically-identical TypeScript predicate (`isDhikrItemPubliclyEligible`):

```
Publicly eligible = reviewStatus is "published"
                   + arabicText, translationEn, translationDa present
                   + at least one sourceReference present
                   + an approved "scholarly" board approval present
                   + an approved "editorial" board approval present
```

This same rule is used in three places, so it cannot drift out of sync:
1. **The public GROQ query** (`dhikrItemsPublicEligibleQuery` in `queries.ts`) interpolates `DHIKR_ELIGIBILITY_GROQ` directly.
2. **The Studio publish-time validators** (`requiredWhenDhikrPublished`, `requiredDhikrSourceReferences`, `requiredDhikrBoardApprovals` in `src/sanity/validation/governance.ts`) reuse the same `hasApprovedDhikrBoard` helper, so a document cannot be saved with `reviewStatus: "published"` unless the same conditions hold.
3. **The test suite** (`tests/dhikr/dhikr-review-status-gating.test.ts`) calls the predicate directly with constructed documents, asserting the compound rule behaviourally (not by string-matching a query).

No public route consumes `dhikrItemsPublicEligibleQuery` yet — it exists now so the gate itself is proven correct ahead of Phase 3.

## Internal-preview path (staff-only)

`dhikrItemsInternalPreviewQuery` and `dhikrCategoriesInternalQuery` apply no eligibility filter and live only in `src/sanity/lib/dhikr-fetch.ts`, a module physically separate from the shared public `fetch.ts`, imported only by `src/app/(staff)/dhikr-review/page.tsx`. It uses `previewClient` (draft-visible), not the public `client`, since Sanity's own draft/publish state is a separate mechanism from `reviewStatus`.

## Studio access

Studio-level role restriction (who can move `reviewStatus` forward, and who can set `boardApprovals[].approved`) is not configured in this prototype — it remains an implementation task for whoever administers Sanity roles, mapped to the roles in [03](03-authenticity-and-scholarly-review-policy.md).

## Validation strategy — correction from the original plan

The original plan said to "extend `scripts/validate-schema.ts`." Repository inspection during Phase 2 confirmed this script validates **SEO/JSON-LD structured data** (product/article/medical/course schemas), an unrelated domain — it was never the right integration point for Sanity document-schema checks. It was **not** modified. Instead, `tests/dhikr/dhikr-schema-shape.test.ts` and `tests/dhikr/dhikr-review-status-gating.test.ts` follow the repository's actual existing convention for this kind of check: plain `assert()`-based TypeScript files (see `tests/community/permission-resolver.test.ts`), run via `npx tsx`. See [17-test-and-validation-plan.md](17-test-and-validation-plan.md).

## Explicit non-goals, still true after implementation

- No live Sanity dataset, project config, or Studio deployment change was made.
- No real content was created — zero `dhikrItem`/`dhikrCategory` documents exist in any dataset.
