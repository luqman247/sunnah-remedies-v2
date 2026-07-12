# 12 — Sanity Integration Plan

## Scope restriction

This document describes **how** Dhikr content would integrate with the existing Sanity setup. No actual schema `.ts` files are created here — see [04-dhikr-content-schema.md](04-dhikr-content-schema.md) for the field shape this plan would eventually implement.

## Approach

Follow the existing schema-authoring convention demonstrated by `src/sanity/schemas/documents/global/department-card.ts` and `audio-asset.ts` (see [00-existing-system-audit.md](00-existing-system-audit.md)):

- `dhikrItem` and `dhikrCategory` would be added as new document types under `src/sanity/schemas/documents/` (exact subfolder — e.g. a new `dhikr/` grouping vs. `global/` — is an implementation decision, not fixed here).
- Field-level validation (required/max-length rules) would follow the same `defineField`/`Rule` pattern already used in `department-card.ts`.
- The `audioAsset` reference field in [04](04-dhikr-content-schema.md) would reference the existing `audio-asset` document type rather than duplicating an audio schema.

## Publish gating

The `reviewStatus` field (see [04](04-dhikr-content-schema.md) and policy in [03](03-authenticity-and-scholarly-review-policy.md)) must be enforced at the query layer, not only as a display-only field: any frontend query powering public pages should filter to `reviewStatus == "published"` so an item sitting at `sourced` or `scholarly-review` in the CMS cannot accidentally render live. This is the single most important integration rule in this document — get this filter wrong and unreviewed content ships by accident.

## Studio access

Studio-level role restriction (who can move an item's `reviewStatus` forward) should map to the roles defined in [03](03-authenticity-and-scholarly-review-policy.md) — source compilers should not have field-level permission to set `reviewStatus` to `approved`. Exact Sanity role/permission configuration is an implementation task, not specified field-by-field here.

## Validation

Extend `scripts/validate-schema.ts` (see [00](00-existing-system-audit.md)) to include Dhikr content types once real schemas exist, rather than building a parallel validation script — consistent with [17-test-and-validation-plan.md](17-test-and-validation-plan.md).

## Explicit non-goals

- No `.ts` schema file is created by this document.
- No live Sanity dataset, project config, or studio deployment change is made.
