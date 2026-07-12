# 21 — Decision Log

ADR-style running log, scoped to Dhikr architecture decisions only. Format follows the precedent set by `docs/Phase 4/phase-4-architecture-decisions.md` (see [00-existing-system-audit.md](00-existing-system-audit.md)), applied as a new, separately-scoped log rather than appending to that Phase 4 file.

---

## ADR-001 — Dhikr is a standalone Sunnah Remedies department

**Status**: Decided
**Context**: [02-information-architecture.md](02-information-architecture.md) raised department-level vs. sub-section placement as an open question.
**Decision**: Dhikr is treated as a standalone department-level destination, reusing `DepartmentNav`, `DepartmentGateway`, `DepartmentCard`, and the `department-card` Sanity schema pattern (see [00](00-existing-system-audit.md), [11](11-route-and-component-map.md)).
**Rationale**: Dhikr is an ongoing, distinct daily-practice offering rather than a feature that topically nests inside an existing department; department-level placement gives it the same top-level navigational visibility as other departments and avoids overloading an unrelated department's information architecture.
**Assumption flag**: this is a product decision for this architecture pack, not derived directly from repository evidence beyond the existence of a reusable department pattern — flagged for product-owner confirmation before Phase 3 routing work begins (see [19](19-implementation-roadmap.md), [20-risk-register.md](20-risk-register.md) R-08).

## ADR-002 — Browser-based, not a downloadable app

**Status**: Decided
**Decision**: Dhikr ships as pages within the existing Next.js site, not as a native or downloadable application.
**Rationale**: repository evidence — the entire existing product (department system, i18n, Sanity CMS integration, per [00](00-existing-system-audit.md)) is a Next.js web app with no downloadable-app precedent anywhere in the repository. Staying browser-based reuses the full existing routing, i18n, design-token, and component architecture (see [11-route-and-component-map.md](11-route-and-component-map.md)) instead of requiring a separate technical stack and distribution channel.

## ADR-003 — Account-free for v1

**Status**: Decided
**Decision**: no login or account requirement for any Dhikr v1 functionality.
**Rationale**: stated as a non-goal in [01-product-scope.md](01-product-scope.md); keeps friction low for a reading/reciting feature and avoids the consent and data-retention obligations an account system would introduce. Directly enables ADR-005.

## ADR-004 — Non-gamified

**Status**: Decided
**Decision**: no streaks, badges, leaderboards, or social comparison of counts or progress.
**Rationale**: stated as a non-goal in [01](01-product-scope.md), [07-repeat-counter-specification.md](07-repeat-counter-specification.md), and [08-memorisation-system.md](08-memorisation-system.md). The product intent is a calm, private practice tool; gamification mechanics would conflict with the unhurried reading experience specified in [06-reader-experience-specification.md](06-reader-experience-specification.md).

## ADR-005 — Local-storage-first

**Status**: Decided
**Decision**: repeat-counter and memorisation-progress data are stored in browser local storage, not a server-side database, for v1.
**Rationale**: direct consequence of ADR-003 — without an account, there is no reliable per-visitor server-side identity to key personal data against. Local storage keeps the v1 data model simple and avoids the privacy/consent obligations a server-held personal record would carry (see [16-privacy-and-local-storage-policy.md](16-privacy-and-local-storage-policy.md)).

## ADR-006 — Subject to scholarly approval before any religious content is published

**Status**: Decided, non-negotiable for this architecture phase
**Decision**: no dhikr content — Arabic text, translation, transliteration, grading, repetition count, or audio — is published until it clears the full review pipeline defined in [03-authenticity-and-scholarly-review-policy.md](03-authenticity-and-scholarly-review-policy.md).
**Rationale**: this is the load-bearing decision underneath the entire pack. [20-risk-register.md](20-risk-register.md) (R-01) identifies unreviewed-content publication as the single most severe risk this feature carries. The `reviewStatus` gating in [04](04-dhikr-content-schema.md)/[12](12-sanity-integration-plan.md) and the release-blocking test in [17-test-and-validation-plan.md](17-test-and-validation-plan.md) exist specifically to enforce this decision technically, not just as policy on paper.

## ADR-007 — Dhikr schemas live under `documents/dhikr/`

**Status**: Decided (Phase 2 implementation)
**Decision**: `dhikrItem` and `dhikrCategory` are defined under `src/sanity/schemas/documents/dhikr/`, a new subfolder, registered in `src/sanity/schemas/index.ts` in a dedicated "Dhikr" section. Neither is added to the custom Studio desk structure (`src/sanity/structure/index.ts`).
**Rationale**: matches the per-department subfolder convention already used for `apothecary/`, `academy/`, `journeys/`, `clinical/`. Not adding desk-structure entries matches the precedent set by `clinicalProtocol`/`practitionerResource`, which also rely on Sanity's default document listing rather than custom placement.
**Resolves**: OD-04.

## ADR-008 — Reuse `sourceReference` and `boardApproval` instead of bespoke fields

**Status**: Decided (Phase 2 implementation)
**Decision**: `dhikrItem.sourceReferences` is `array of sourceReference` (the existing object). `dhikrItem.boardApprovals` is `array of boardApproval` (the existing object), requiring both a `scholarly`-board and an `editorial`-board entry, each `approved: true`, before `reviewStatus` can reach `published`.
**Rationale**: repository inspection during Phase 2 found `sourceReference` already encodes citation + hadith grading + the "unverified attribution" rule, and `boardApproval` already has "Scholarly Review Board" and "Editorial" as board options — both are strictly better fits than the `sourceCitation`/`gradingNote`/`reviewerId`/`reviewDate` fields originally proposed in [04-dhikr-content-schema.md](04-dhikr-content-schema.md), which is updated to match. This directly satisfies "extend existing validation patterns instead of creating a parallel validation system."
**Compatibility check performed**: both objects' fields (`board`, `approved` on `boardApproval`; `citation`, `hadithGrading`, `verifiedStatus` on `sourceReference`) were inspected directly before use, not assumed from names alone. Both cleanly support the Dhikr requirement — no incompatible field was needed.

## ADR-009 — Dual-field EN/DA localisation on `dhikrItem`, provisional

**Status**: Decided, provisional — subject to review before the mature multilingual content model is finalised
**Decision**: `dhikrItem`/`dhikrCategory` use dual fields on one document (`titleEn`/`titleDa`, `translationEn`/`translationDa`) rather than the site's dominant one-document-per-`language` pattern (used by `product`, `programme`, `journey`, `article`).
**Rationale**: this is deliberate and Dhikr-specific, not an oversight or a change to the wider repository localisation model. `arabicText` must be stored exactly once per item and never duplicated between an English record and a Danish record — splitting into sibling documents-per-language would require copying (or cross-referencing) `arabicText` and `sourceReferences` across two documents, recreating the exact "two Arabics could drift" risk that the authoritative-source rule in [03](03-authenticity-and-scholarly-review-policy.md) exists to prevent.
**Scope of the deviation**: this affects `dhikrItem`/`dhikrCategory` only. No other schema, and no part of `src/i18n/`, was changed.

## ADR-010 — Publication eligibility is a compound rule, defined once

**Status**: Decided (Phase 2 implementation)
**Decision**: "publicly eligible" is `reviewStatus == "published"` **AND** `arabicText`/`translationEn`/`translationDa` present **AND** at least one `sourceReference` **AND** an approved `scholarly` board approval **AND** an approved `editorial` board approval — never `reviewStatus == "published"` alone. This rule is defined exactly once, in `src/sanity/lib/dhikr-publication-gate.ts` (a GROQ fragment plus a logically-identical TypeScript predicate), and reused by the public query, the Studio publish-time validators, and the test suite.
**Rationale**: makes the safeguard architectural rather than dependent on a developer remembering to repeat a filter correctly in multiple places. Directly supersedes the earlier, weaker design (a bare `reviewStatus == "published"` filter mirroring `clinicalProtocolsQuery`'s simpler `== "approved"` gate) once it was clear the Dhikr policy in [03](03-authenticity-and-scholarly-review-policy.md) requires both review roles independently, not just a status string.
**Verified compatible**: `boardApprovals` and `sourceReferences` are inline object arrays (not references requiring dereferencing), so the identical condition is expressible in both GROQ (server/query-time) and Sanity's synchronous validation context (write-time) without divergence.

## ADR-011 — Internal review route reuses the existing `(staff)` gate, not a new one

**Status**: Decided (Phase 2 implementation)
**Decision**: the internal prototype lives at `src/app/(staff)/dhikr-review/page.tsx`, added to `middleware.ts`'s existing `authMiddleware`-gated pathname list alongside `/handbook`, `/ops`, `/intelligence`. It uses the plain `(staff)` layout styling, not `DepartmentHero`/`DepartmentSection`. Its data access uses `previewClient` (draft-visible) via a new, physically separate `src/sanity/lib/dhikr-fetch.ts` module, never the shared public `fetch.ts`.
**Rationale**: `(staff)` is already a genuinely access-controlled (NextAuth), non-indexed route group with proven siblings — reusing it is stronger than inventing a new "unlisted" convention, and was confirmed correct against `next.config.ts` (no rewrites) and a full production build, which shows `/dhikr-review` resolving exactly as expected alongside the other staff routes. `DepartmentHero`/`DepartmentSection` were not reused because they assume the `[locale]` layout's fonts/providers, which `(staff)` deliberately does not share (separate root layout) — reusing them would have created the provider/font coupling the brief asked to avoid.

## ADR-012 — `scripts/validate-schema.ts` is not the right validation target

**Status**: Decided (Phase 2 implementation)
**Decision**: Dhikr schema/gating tests were added as `tests/dhikr/*.test.ts` (following the `tests/ai/`/`tests/community/` `assert()`-based convention), not as an extension of `scripts/validate-schema.ts`.
**Rationale**: repository inspection confirmed that script validates SEO/JSON-LD structured data (product/article/medical/course schemas) — an unrelated domain to Sanity document-schema or publish-gating correctness. [12](12-sanity-integration-plan.md) and [17](17-test-and-validation-plan.md), which originally assumed otherwise, are corrected.

---

## Open decisions (not yet resolved by this architecture pack)

| ID | Open question | Raised in | Blocking |
|---|---|---|---|
| OD-01 | Final category taxonomy naming and count (currently draft) | [05-category-taxonomy.md](05-category-taxonomy.md) | Blocks finalising `dhikrCategory` content, not engineering scaffolding |
| OD-02 | Whether counter state persists across sessions ("today's count") or resets each session | [07-repeat-counter-specification.md](07-repeat-counter-specification.md) | Blocks Phase 4 implementation detail, not Phase 4 start |
| OD-03 | Whether individual dhikr items carry rich structured data (e.g. Article-style), or omit item-level structured data in v1 | [14-seo-and-sharing.md](14-seo-and-sharing.md) | Blocks Phase 6 SEO polish, not launch itself |
| ~~OD-04~~ | ~~Exact Sanity schema subfolder grouping for `dhikrItem`/`dhikrCategory`~~ | Resolved by **ADR-007** below | — |

These remain open by design — resolving them is an editorial/engineering-lead decision at implementation time, not something this architecture pack should pre-decide without that input.

---

## Pre-commit QA review — corrections applied (2026-07-12)

A full integrated review of all 23 files surfaced the following defects, corrected before commit:

1. **Contradiction — department placement.** ADR-001 recorded the standalone-department placement as decided, but [01](01-product-scope.md), [02](02-information-architecture.md), [11](11-route-and-component-map.md), and risk R-08 in [20](20-risk-register.md) still described it as fully open, unresolved either at the time ADR-001 was written. Corrected all four to state the default decision explicitly while preserving the still-needed product-owner confirmation before Phase 3 (ADR-001's own caveat) — no information was lost, only made consistent.
2. **Safeguard gap — autoplay audio.** No document stated the no-autoplay requirement. Added explicit rules to [10](10-audio-review-and-delivery.md) and [15](15-accessibility-requirements.md).
3. **Safeguard gap — Arabic as authoritative source.** Not previously stated as a governance rule (only as a presentation/typography fact). Added an explicit rule to [03](03-authenticity-and-scholarly-review-policy.md) and a cross-reference in [04](04-dhikr-content-schema.md): Arabic is authoritative, translations are derived, and discrepancies are resolved by correcting the translation.
4. **Safeguard gap — reward/virtue claims.** No rule prevented an unverified reward/virtue claim from entering through a loosely-reviewed field (category `description`, `tags`). Added an explicit rule to [03](03-authenticity-and-scholarly-review-policy.md) and tightened the `description` field note in [04](04-dhikr-content-schema.md).
5. **Safeguard gap — memorisation is not a religious ruling.** [08](08-memorisation-system.md) did not disclaim that "Memorised" is a personal self-report, not a claim of religious merit or acceptance. Added an explicit disclaimer.
6. **Clarity gap — local storage terminology and resilience.** "Local storage" and "resets per session" were used across [06](06-reader-experience-specification.md), [07](07-repeat-counter-specification.md), and [08](08-memorisation-system.md) without distinguishing persistent storage from session-scoped behaviour, and no document addressed what happens if storage is blocked. Added clarifying language to [16](16-privacy-and-local-storage-policy.md) rather than editing the three source documents, since 16 is the canonical storage policy.
7. **Traceability gap — tests not connected to risks.** [17](17-test-and-validation-plan.md)'s test categories did not reference risk IDs, and risks R-03 (audio accuracy) and R-04 (Arabic rendering) had no corresponding test category. Added a "Related risk(s)" column to 17, two new test categories (audio-text consistency, Arabic rendering), and cross-referenced them back from R-03/R-04 in [20](20-risk-register.md).
8. **Non-goal gap — separate brand identity.** No document stated that Dhikr must not become a distinct sub-brand. Added to [01](01-product-scope.md) non-goals.

No file was created, deleted, or renamed. No Arabic text, translation, hadith reference, grading, or repetition count was introduced by these corrections — all changes are structural/policy clarifications.
