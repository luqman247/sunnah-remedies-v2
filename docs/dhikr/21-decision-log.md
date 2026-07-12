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

---

## Open decisions (not yet resolved by this architecture pack)

| ID | Open question | Raised in | Blocking |
|---|---|---|---|
| OD-01 | Final category taxonomy naming and count (currently draft) | [05-category-taxonomy.md](05-category-taxonomy.md) | Blocks finalising `dhikrCategory` content, not engineering scaffolding |
| OD-02 | Whether counter state persists across sessions ("today's count") or resets each session | [07-repeat-counter-specification.md](07-repeat-counter-specification.md) | Blocks Phase 4 implementation detail, not Phase 4 start |
| OD-03 | Whether individual dhikr items carry rich structured data (e.g. Article-style), or omit item-level structured data in v1 | [14-seo-and-sharing.md](14-seo-and-sharing.md) | Blocks Phase 6 SEO polish, not launch itself |
| OD-04 | Exact Sanity schema subfolder grouping for `dhikrItem`/`dhikrCategory` | [12-sanity-integration-plan.md](12-sanity-integration-plan.md) | Blocks Phase 1 implementation detail only |

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
