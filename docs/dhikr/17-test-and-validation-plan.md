# 17 — Test & Validation Plan

**Status: partially implemented in Phase 2.** The schema-gating tests below exist and pass; the reader-experience tests (counter, memorisation, accessibility, localisation, audio, Arabic rendering) remain planned for Phase 3+ since no reader UI exists yet.

## Correction from the original plan

The original plan said to extend `scripts/validate-schema.ts`. Repository inspection confirmed that script validates **SEO/JSON-LD structured data**, an unrelated domain — it was not modified. The correct, already-established precedent is the plain `assert()`-based test files in `tests/ai/`, `tests/community/` (e.g. `permission-resolver.test.ts`), run via `npx tsx`. Both new Dhikr test files follow this convention exactly.

## Implemented tests (Phase 2)

`tests/dhikr/dhikr-schema-shape.test.ts` — static schema-shape checks (inspects the schema definition objects and validation-rule wiring; no live Sanity dataset):
- schema type registration (`dhikrItem`, `dhikrCategory` present in `schemaTypes`)
- exact allowed `reviewStatus` values, behaviourally verified by invoking the custom validator with each valid value and one invalid value
- default review state (`sourced`)
- `audioAsset`/`sourceReferences`/`boardApprovals` reuse the existing object/document types, not bespoke duplicates
- no content field is pre-populated
- `dhikrCategory` has no separate publication workflow
- placeholder register contains only allowed fields, no Arabic script, matches the 12 slots in [18](18-v1-content-register.md)

Risk mapping: **R-01**.

`tests/dhikr/dhikr-review-status-gating.test.ts` — behavioural tests calling the actual predicate/validator functions with constructed documents (plus two clearly-labelled static source/string-inspection checks; no live dataset or HTTP request anywhere in the file):
- `reviewStatus: "approved"` is **not** publicly eligible; only `"published"` is (with all other conditions also met)
- publication blocked when any mandatory field (`arabicText`, `translationEn`, `translationDa`, `sourceReferences`) is absent
- publication blocked without required approvals, including the specific case of **one** approval of either kind alone (both required, independently)
- the Studio publish-time validators (`governance.ts`) enforce the identical rule as the canonical predicate — no drift
- `[static check]` the public query interpolates the canonical `DHIKR_ELIGIBILITY_GROQ` constant rather than a hand-copied filter
- `[static check]` the internal-preview query applies no `reviewStatus` filter
- `[static check]` `/dhikr-review` is present in `middleware.ts`'s auth-gated pathname list

Risk mapping: **R-01**.

`tests/auth/staff-credentials.test.ts` and `tests/auth/staff-route-matcher.test.ts` — these test the repository's **shared** staff authentication system (`src/lib/auth/config.ts`, `middleware.ts`), not Dhikr-specific code. They exist here because `/dhikr-review`'s privacy depends entirely on that shared system, and are recorded rather than duplicated: the full audit, root cause, and evidence are in ADR-013 of [21-decision-log.md](21-decision-log.md), not repeated here. `staff-credentials.test.ts` is a unit test of the credential-parsing/matching logic in isolation; `staff-route-matcher.test.ts` is a static source check. **Neither proves the runtime HTTP/session flow works** — that was verified separately via live curl and browser requests against a running `next start` server, documented in ADR-013.

Risk mapping: **R-09**.

## Content-safety validation specific to this feature

The content-gating rule is release-blocking: no Dhikr release should ship without an automated test proving `reviewStatus != "published"` items — and items missing mandatory fields or required approvals even at `"published"` — are unreachable from public routes. Both implemented test files exist specifically to prove this ahead of any real content or public route.

## Test categories still planned (Phase 3+, not yet implemented)

| Category | What it verifies | Related risk(s) — see [20-risk-register.md](20-risk-register.md) |
|---|---|---|
| Counter mechanism tests | Increment/reset behave per [07](07-repeat-counter-specification.md); reset requires confirmation | R-06 |
| Memorisation state tests | State transitions and local-storage persistence per [08](08-memorisation-system.md) | R-06 |
| Accessibility tests | Keyboard operability, `lang`/`dir` attribution, ARIA live-region announcements, no-autoplay, per [15](15-accessibility-requirements.md) | R-07 |
| Localisation tests | EN/DA UI strings resolve correctly; Arabic renders unaffected by locale switch, per [13](13-localisation-plan.md) | R-04 |
| Audio-text consistency check | Recitation audio matches its item's reviewed text; audio never outpaces its item's own review clearance, per [10](10-audio-review-and-delivery.md) | R-03 |
| Arabic rendering tests | Diacritics render correctly, `dir="rtl"`/`lang="ar"` applied correctly, no image-of-text fallback, per [09](09-arabic-content-presentation.md) | R-04 |

These require a reader UI that doesn't exist yet (see [19-implementation-roadmap.md](19-implementation-roadmap.md), Phase 3), so they remain planned, not implemented.
