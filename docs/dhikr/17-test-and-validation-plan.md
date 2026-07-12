# 17 — Test & Validation Plan

## Approach

Extend existing test/validation infrastructure rather than building a parallel one: `scripts/validate-schema.ts` for structured-data/schema validation, and the existing `tests/` directory structure (`tests/ai/`, `tests/community/`) as the precedent for where Dhikr-specific test suites would live (see [00-existing-system-audit.md](00-existing-system-audit.md)). No test files are created by this document.

## Test categories, once implementation begins

| Category | What it verifies | Extends | Related risk(s) — see [20-risk-register.md](20-risk-register.md) |
|---|---|---|---|
| Content-gating tests | An item with `reviewStatus` below `published` never renders on a public route | New `tests/dhikr/` suite, following existing `tests/` layout | R-01 |
| Schema validation | `dhikrItem`/`dhikrCategory` documents conform to the shape in [04-dhikr-content-schema.md](04-dhikr-content-schema.md) | `scripts/validate-schema.ts` (see [12-sanity-integration-plan.md](12-sanity-integration-plan.md)) | R-01 |
| Counter mechanism tests | Increment/reset behave per [07-repeat-counter-specification.md](07-repeat-counter-specification.md); reset requires confirmation | New `tests/dhikr/` suite | R-06 |
| Memorisation state tests | State transitions and local-storage persistence per [08-memorisation-system.md](08-memorisation-system.md) | New `tests/dhikr/` suite | R-06 |
| Accessibility tests | Keyboard operability, `lang`/`dir` attribution, ARIA live-region announcements, no-autoplay, per [15-accessibility-requirements.md](15-accessibility-requirements.md) | New `tests/dhikr/` suite, automated where tooling allows plus manual screen-reader pass | R-07 |
| Localisation tests | EN/DA UI strings resolve correctly; Arabic renders unaffected by locale switch, per [13-localisation-plan.md](13-localisation-plan.md) | Existing i18n test conventions, if any exist at implementation time | R-04 |
| Audio-text consistency check | Recitation audio matches its item's reviewed text; an item's audio never goes live ahead of its own audio-review clearance, per [10-audio-review-and-delivery.md](10-audio-review-and-delivery.md) | New `tests/dhikr/` suite | R-03 |
| Arabic rendering tests | Diacritics render correctly, `dir="rtl"`/`lang="ar"` applied correctly, no image-of-text fallback, per [09-arabic-content-presentation.md](09-arabic-content-presentation.md) | New `tests/dhikr/` suite | R-04 |

## Content-safety validation specific to this feature

Because publish-gating is the single highest-risk technical failure mode for this feature (unreviewed religious content going live by accident — see [12](12-sanity-integration-plan.md) and [20-risk-register.md](20-risk-register.md)), the content-gating test category above is release-blocking: no Dhikr release should ship without an automated test proving `reviewStatus != published` items are unreachable from public routes.

## What this document does not do

- Does not write any test file.
- Does not specify a test framework choice beyond following whatever the existing `tests/` directory already uses.
