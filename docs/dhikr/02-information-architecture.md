# 02 — Information Architecture

## Page hierarchy (conceptual — no routes created)

```
Dhikr (landing / gateway)
├── Category index (e.g. Morning, Evening, After Prayer, Travel, Distress — see 05)
│   └── Category detail (list of items in that category)
│       └── Item reader view (single dhikr — Arabic / transliteration / translation / counter)
├── Memorisation progress view (visitor's locally-tracked items — see 08, 16)
└── About / Sourcing (links out to the authenticity policy in human-readable form)
```

This mirrors the existing department pattern: a gateway/hero entry point, a section-level index, and a leaf detail view — the same shape as other departments already in the codebase (see [00](00-existing-system-audit.md)).

## Navigation placement

**Decided by default (ADR-001, see [21-decision-log.md](21-decision-log.md)): standalone department.** Dhikr appears in `DepartmentNav` alongside existing departments, entered via a `DepartmentGateway`/`DepartmentCard` on the homepage, consistent with `department-card` schema fields (`order`, `nameEn`, `nameAr`, `standfirst`, `href`). This default still requires product-owner confirmation before Phase 3 routing work begins (tracked as release-blocking risk R-08 in [20-risk-register.md](20-risk-register.md)).

The alternative considered and not selected by default: nesting Dhikr as a **sub-section of an existing department**, using `DepartmentSection`/`DepartmentFeature` for the entry point instead of a top-level card. Both options reuse existing navigation components and neither requires new navigational primitives, so reversing this decision later — if product-owner confirmation goes the other way — is low-cost.

## Cross-linking

- Category index links to item reader views; item reader views link back to category index and forward/back to sibling items in the same category (sequential reading, not just a flat list).
- Memorisation progress view links directly to each tracked item's reader view.
- Every reader view carries a lightweight, non-intrusive link to the sourcing/authenticity explanation (see [03](03-authenticity-and-scholarly-review-policy.md)) so provenance is never hidden, without cluttering the reading experience.

## Localisation and IA

Category and item labels are localised (EN/DA) using the existing `src/i18n` routing — no parallel locale system. Arabic content itself is a third, non-routed content field displayed regardless of site locale (see [09](09-arabic-content-presentation.md) and [13](13-localisation-plan.md)).

## What this document does not decide

- Exact URL slugs (see [11-route-and-component-map.md](11-route-and-component-map.md)).
- Final product-owner confirmation of the department placement decided by default in ADR-001 (see [21](21-decision-log.md)).
- Visual layout details (see [06-reader-experience-specification.md](06-reader-experience-specification.md)).
