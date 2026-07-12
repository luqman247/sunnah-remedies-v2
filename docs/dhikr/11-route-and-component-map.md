# 11 — Route & Component Map

## Scope restriction

This document is a **planning map only** — no route files, page files, or components are created by this document. It describes proposed URL structure and which existing components each future page would compose.

## Proposed URL structure (conceptual, locale-prefixed per existing i18n routing)

| Conceptual path | Maps to | Notes |
|---|---|---|
| `/dhikr` | Dhikr gateway/landing | Composes `DepartmentHero`, `DepartmentStatement` |
| `/dhikr/[category]` | Category index | Composes `DepartmentSection`, list of item previews |
| `/dhikr/[category]/[item]` | Focused reader view | New leaf composition per [06](06-reader-experience-specification.md) — Arabic block, transliteration, translation, counter, audio control |
| `/dhikr/progress` | Memorisation progress view | New composition, reads local storage per [16](16-privacy-and-local-storage-policy.md) |

Exact slugs (English vs. localised path segments) follow the existing `src/i18n/routing.ts` convention — not redefined here.

## Component reuse vs. new components

| Component | Status | Notes |
|---|---|---|
| `DepartmentNav` | Reuse as-is | See [00](00-existing-system-audit.md) |
| `DepartmentHero` | Reuse as-is | For `/dhikr` landing |
| `DepartmentSection` | Reuse as-is | For category index |
| `DepartmentFeature`, `DepartmentStatement` | Reuse as-is | Supporting landing content |
| `DepartmentGateway`, `DepartmentCard` | Reuse as-is | Homepage entry point for the standalone-department placement decided by default in ADR-001 (see [21-decision-log.md](21-decision-log.md), [02](02-information-architecture.md)) |
| Arabic/transliteration/translation reader block | **New** | Follows presentation rules in [09](09-arabic-content-presentation.md); no existing component covers RTL Arabic + companion text |
| Repeat counter control | **New** | Per [07](07-repeat-counter-specification.md) |
| Memorisation toggle + progress list | **New** | Per [08](08-memorisation-system.md) |
| Audio player control | **New** (or reuse if a generic audio player already exists elsewhere in `src/components` — to be confirmed at implementation time, not assumed here) | Per [10](10-audio-review-and-delivery.md) |

## Why this stays a map, not code

Creating actual route/page files or components is explicitly excluded from this architecture phase. This map exists so implementation can proceed directly from a shared understanding of composition, without an implementer having to re-derive which pieces are new versus reused.
