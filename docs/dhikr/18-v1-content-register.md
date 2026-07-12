# 18 — v1 Content Register

This is a **placeholder register** for launch content. It tracks *slots* — category and review status only — not actual dhikr content. No Arabic text, hadith reference, grading, or repetition count appears anywhere in this document. Every entry is a stub for the source-compiler and scholarly-reviewer roles defined in [03](03-authenticity-and-scholarly-review-policy.md) to fill in through the CMS, not in this file.

## Register format

| Slot ID | Category (draft, per [05](05-category-taxonomy.md)) | Review status | Notes |
|---|---|---|---|

## v1 slots (all pending)

| Slot ID | Category | Review status | Notes |
|---|---|---|---|
| DHK-001 | Morning | `[Pending scholarly input]` | Not sourced |
| DHK-002 | Morning | `[Pending scholarly input]` | Not sourced |
| DHK-003 | Morning | `[Pending scholarly input]` | Not sourced |
| DHK-004 | Evening | `[Pending scholarly input]` | Not sourced |
| DHK-005 | Evening | `[Pending scholarly input]` | Not sourced |
| DHK-006 | Evening | `[Pending scholarly input]` | Not sourced |
| DHK-007 | After Prayer | `[Pending scholarly input]` | Not sourced |
| DHK-008 | After Prayer | `[Pending scholarly input]` | Not sourced |
| DHK-009 | Before Sleep | `[Pending scholarly input]` | Not sourced |
| DHK-010 | Travel | `[Pending scholarly input]` | Not sourced |
| DHK-011 | Distress / Difficulty | `[Pending scholarly input]` | Not sourced |
| DHK-012 | General Remembrance | `[Pending scholarly input]` | Not sourced |

The count and category distribution above (12 slots across 6 draft categories) is a *placeholder scaffold* for planning purposes — e.g. to size the [implementation roadmap](19-implementation-roadmap.md) and [test plan](17-test-and-validation-plan.md) — not a commitment to exactly 12 items or this exact distribution. The source compiler and scholarly reviewer determine the real v1 set through the process in [03](03-authenticity-and-scholarly-review-policy.md).

## How this register is used

- Each slot corresponds to a future `dhikrItem` document (see [04](04-dhikr-content-schema.md)) once content clears sourcing and review.
- `reviewStatus` values here should stay in sync with the CMS field of the same name once real content exists — this file is a planning artifact, not the system of record. Once items exist in the CMS, the CMS is authoritative and this register should be treated as historical.
- No slot may be marked anything other than `[Pending scholarly input]` by this architecture work. Updating a slot's status is an editorial/scholarly action, not an engineering one.
