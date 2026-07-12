# 19 — Implementation Roadmap

## Approach

Phased so each phase is independently testable and reversible — no phase requires an irreversible commitment (e.g. publishing content) before its own testing gate passes. Phases are written to slot conceptually alongside the existing `engineering-os/10-design`, `30-build`, `40-verify` structure (see [00-existing-system-audit.md](00-existing-system-audit.md)) without editing Engineering OS files themselves.

## Phase 0 — Architecture (this pack)

- Deliverable: `docs/dhikr/` documentation set.
- Test gate: internal review/approval of this pack (in progress).
- Reversible: yes — pure documentation, no system touched.

## Phase 1 — Schema & CMS scaffolding

- Deliverable: `dhikrItem`/`dhikrCategory` Sanity schemas per [04](04-dhikr-content-schema.md) and [12](12-sanity-integration-plan.md), with `reviewStatus` field enforced.
- Test gate: schema validation extended in `scripts/validate-schema.ts` (per [17](17-test-and-validation-plan.md)); confirm no query path can surface non-`published` items.
- Reversible: yes — schema with zero populated content carries no publishing risk; can be removed cleanly if scope changes.

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

## Explicit assumption

Phase ordering assumes editorial (Phase 2) and engineering (Phases 1, 3, 4, 5) can proceed in parallel, converging at Phase 6. This is a scheduling assumption, not a repository-evidenced fact — flagged for confirmation by whoever owns project sequencing.
