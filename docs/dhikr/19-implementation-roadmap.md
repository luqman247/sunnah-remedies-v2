# 19 — Implementation Roadmap

## Approach

Phased so each phase is independently testable and reversible — no phase requires an irreversible commitment (e.g. publishing content) before its own testing gate passes. Phases are written to slot conceptually alongside the existing `engineering-os/10-design`, `30-build`, `40-verify` structure (see [00-existing-system-audit.md](00-existing-system-audit.md)) without editing Engineering OS files themselves.

## Phase 0 — Architecture (this pack)

- Deliverable: `docs/dhikr/` documentation set.
- Test gate: internal review/approval of this pack (in progress).
- Reversible: yes — pure documentation, no system touched.

## Phase 1 — Schema & CMS scaffolding

**Status: complete** (verified 2026-07-12, branch `feature/dhikr-architecture`).

- Deliverable: `dhikrItem`/`dhikrCategory` Sanity schemas at `src/sanity/schemas/documents/dhikr/`, registered in `schemas/index.ts`, per [04](04-dhikr-content-schema.md) and [12](12-sanity-integration-plan.md). `reviewStatus` enforced via a custom validator (not just the Studio dropdown).
- Test gate, as actually verified:
  - Schema/gating tests in `tests/dhikr/` (not `scripts/validate-schema.ts` — see [17](17-test-and-validation-plan.md) for the correction) — both files pass via `npx tsx`.
  - `npx tsc --noEmit -p tsconfig.json` — clean (pre-existing, unrelated `.next/` stale-cache errors excluded; confirmed via `git status` these are not part of this change).
  - `npx next build` — succeeds; route manifest confirms `/dhikr-review` resolves correctly, staff-gated, alongside `/handbook`/`/ops`/`/intelligence`.
  - `npm run lint` (`next lint`) — could not run: no `eslint.config.js` has ever existed in this repository (confirmed via `git log -p -- package.json`), a pre-existing, unrelated gap. Not fixed, per scope restriction against modifying scripts/dependencies to force a prototype to pass.
  - Confirmed no query path can surface a non-`published` item: `dhikrItemsPublicEligibleQuery` requires the full compound eligibility rule (see ADR-010 in [21](21-decision-log.md)), not `reviewStatus == "published"` alone.
- Reversible: yes — schema with zero populated content carries no publishing risk; every change is additive (see completion report for the full file list).

**Authentication readiness (staff-gate dependency), verified separately after Phase 1**: `/dhikr-review`'s privacy depends on the repository's shared staff auth system, not Dhikr-specific code. An initial fail-open *observation* in local `next dev` was investigated and found to be a Turbopack dev-server discrepancy, not a production vulnerability — production (`next start`, what Vercel runs) was verified end-to-end (unauthenticated → redirect; invalid credentials → denied; valid credentials → session; sign-out → re-gated) once the shared system's environment variables are configured. A genuinely pre-existing defect (the `/sign-in` page itself 404ing) was found and fixed in `middleware.ts`. Full detail in ADR-013, [21-decision-log.md](21-decision-log.md); residual risk in R-09, [20-risk-register.md](20-risk-register.md). **`/dhikr-review` must not be relied upon as genuinely private in any environment until that environment's `NEXTAUTH_SECRET`/`NEXTAUTH_URL`/`STAFF_CREDENTIALS` are confirmed configured.**

**Vercel environment readiness**: a full deployment checklist and a Development/Preview/Production verification matrix for this shared auth system now exist in `docs/Phase 4/phase-4-security-operations.md` §§9–10 (not duplicated here). Only local production-mode behaviour has been verified — Preview and Production remain unverified against real deployed URLs, and no code change was made in that pass.

## Phase 2 — Content sourcing & scholarly review (editorial track, parallel to engineering)

- Deliverable: real `dhikrItem` entries replacing the placeholders in [18-v1-content-register.md](18-v1-content-register.md), moved through the stages in [03-authenticity-and-scholarly-review-policy.md](03-authenticity-and-scholarly-review-policy.md).
- Test gate: every v1 item reaches `approved` status before Phase 4.
- Reversible: yes — content stays in CMS at `sourced`/`scholarly-review` status with zero public exposure until approved; can be paused or extended without blocking engineering phases.
- **Not started by this architecture pack** — this phase is scholarly/editorial work, out of scope for engineering.

## Phase 3 — Reader experience & routes

- Deliverable: routes/components per [11-route-and-component-map.md](11-route-and-component-map.md), reader UX per [06](06-reader-experience-specification.md), Arabic presentation per [09](09-arabic-content-presentation.md).
- Test gate: accessibility requirements in [15](15-accessibility-requirements.md) pass; localisation per [13](13-localisation-plan.md) verified for EN/DA UI chrome.
- Reversible: yes — can be built and tested against placeholder/staging content before any real content is published (Phase 2 and Phase 3 can run in parallel, converging at Phase 4).

## Phase 4 — Counter & memorisation features

- Deliverable: repeat counter ([07](07-repeat-counter-specification.md)) and memorisation system ([08](08-memorisation-system.md)), local-storage-backed per [16](16-privacy-and-local-storage-policy.md).
- Test gate: mechanism tests per [17](17-test-and-validation-plan.md); accessibility pass for counter/progress toggle.
- Reversible: yes — purely client-side, additive to Phase 3's reader.

## Phase 5 — Audio (optional, can trail)

- Deliverable: audio pipeline per [10-audio-review-and-delivery.md](10-audio-review-and-delivery.md).
- Test gate: audio never outpaces its item's text `reviewStatus` gate.
- Reversible: yes — audio is an optional per-item field; absence degrades gracefully per [10](10-audio-review-and-delivery.md).

## Phase 6 — Public launch

- Deliverable: first `reviewStatus: approved` items flipped to `published`.
- Test gate: content-gating release-blocking test from [17](17-test-and-validation-plan.md) passes; SEO/sharing per [14](14-seo-and-sharing.md) in place.
- Reversible: content can be un-published (`reviewStatus` reverted) without a code change if an issue is found post-launch.

## Phase 4 (repository) — Public Knowledge Library integration

**Overall status: in progress.** Stages 1, 2, and 3 are complete; Stage 4 (category route scaffolding) is deferred (see below — not merely "not started"). The public landing page (Stage 3) is the complete approved public surface for the current phase.

Distinct from "Phase 4 — Counter & memorisation features" above, which remains not started (and is explicitly out of scope for this integration — no counter, no memorisation, no local-storage behaviour is part of this work). This phase supersedes ADR-001's default standalone-department placement (see ADR-014, [21-decision-log.md](21-decision-log.md)): Dhikr's public surface integrates into the existing Knowledge Library rather than becoming a fifth department.

### Stage 1 — Pre-flight and existing-system audit
**Status: complete.** Full repository verification of the Knowledge Library architecture, real route structure (English unprefixed, Danish `/dk`), the existing gate/query surface, and the `knowledgeLibrary.sections` topic-entry mechanism. Corrected the route family to `/knowledge-library/dhikr` → `/knowledge-library/dhikr/[category]` → `/knowledge-library/dhikr/[category]/[slug]` (Next.js does not permit `[category]` and `[slug]` as siblings). Identified that neither `dhikrItem` nor `dhikrCategory` had a slug field.

### Stage 2 — Public data layer
**Status: complete.** `dhikrItem.slug` and `dhikrCategory.slug` added (optional, gated only where a publish concept exists — see ADR-015). `src/sanity/lib/dhikr-public-fetch.ts` added as the sole public Dhikr data-access module (see ADR-016), consuming the existing `dhikrItemsPublicEligibleQuery` (projection extended, filter/gate untouched). No public page created. Item-detail route (`[slug]`) formally deferred — see ADR-015.

### Stage 3 — Knowledge Library landing integration
**Status: complete.** `/knowledge-library/dhikr` (English) and `/dk/knowledge-library/dhikr` (Danish) landing page built via the existing `SectionPage` shell, reusing `knowledgeLibrary`'s breadcrumb/nav/metadata conventions. One entry added to `knowledgeLibrary.sections` (`src/lib/navigation/site-structure.ts`) — no global navigation change, no fifth department. EN/DA interface and the approved empty-state copy live in a new `pages.dhikr`/`dhikr.*` message namespace. Data comes exclusively from `src/sanity/lib/dhikr-public-fetch.ts`; with zero eligible items today, the page renders the approved empty state. Verified via `next build` and `next start` (English and Danish routes both return 200; `next dev` 404s on every route including the homepage, a pre-existing Turbopack middleware limitation per ADR-013, unrelated to this page). No category or item-detail route was created.

### Stage 4 — Category route scaffolding
**Status: deferred.**

The category route is deferred until either:

1. at least one fully eligible published category exists; and
2. the sitewide locale-route `notFound()` behaviour is corrected so unknown or ineligible category URLs return a genuine HTTP 404 rather than not-found content with HTTP 200.

The public landing page remains the complete approved public surface for the current phase. See ADR-017 (revised) in [21-decision-log.md](21-decision-log.md) for the investigation record: a category route was implemented and investigated, found to work correctly in every respect except HTTP status code on an unknown/ineligible category (a pre-existing, sitewide Next.js/next-intl limitation affecting every `notFound()` call inside `src/app/[locale]/`, not specific to this route), and was reverted rather than shipped with that ambiguity. Item-detail route (`[category]/[slug]`) remains separately deferred per ADR-015.

## Explicit assumption

Phase ordering assumes editorial (Phase 2) and engineering (Phases 1, 3, 4, 5) can proceed in parallel, converging at Phase 6. This is a scheduling assumption, not a repository-evidenced fact — flagged for confirmation by whoever owns project sequencing.
