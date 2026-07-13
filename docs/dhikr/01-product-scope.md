# 01 — Product Scope

## Working definition

"Daily Dhikr" is a reading/reciting feature that presents categorised remembrance-of-Allah content (adhkar) to visitors, with optional repeat-counting and memorisation-progress tools. It is a *reader* product, not a publishing tool: content authoring and scholarly verification happen upstream (see [03](03-authenticity-and-scholarly-review-policy.md)); this feature only specifies how verified content is structured, presented, and interacted with.

## Goals

- Give visitors a fast, calm, distraction-free way to read daily adhkar by occasion/category.
- Support unhurried repetition via a counter mechanism, without turning the page into a "gamified" app.
- Allow visitors to track which items they've memorised, privately, without an account requirement (see [16](16-privacy-and-local-storage-policy.md)).
- Present Arabic text, transliteration, and translation with typographic care consistent with the existing design manuals.
- Make every piece of published content traceable to a verified source, with the verification workflow visible in the architecture even if not visible in the UI.

## Non-goals (v1)

- Not a full hadith database or search tool.
- Not a prayer-times, qibla-direction, or Quran-reading product.
- Not a social feature (no sharing of personal counts, no leaderboards, no comments).
- Not an account/login-gated product in v1 — progress and counters are local-only (see [16](16-privacy-and-local-storage-policy.md)).
- Not a scholarly authoring tool — content is prepared and verified outside this feature and enters through the CMS integration described in [12](12-sanity-integration-plan.md).
- Not a separate brand, sub-brand, or standalone app identity — Dhikr uses the existing Sunnah Remedies brand assets, logo, and design tokens directly (see [00](00-existing-system-audit.md)), with no distinct visual identity of its own.

## Target user

A visitor to Sunnah Remedies who wants a reliable, well-sourced daily remembrance practice — ranging from someone reciting from memory who just wants a counter, to someone learning adhkar for the first time who needs transliteration and translation alongside the Arabic.

## Relationship to existing departments

Dhikr is scoped as a standalone department-level destination, reusing the existing department component set and Sanity `department-card` pattern (see [00](00-existing-system-audit.md)) rather than inventing new navigational primitives. This placement is the default decision recorded as ADR-001 in [21-decision-log.md](21-decision-log.md); it still requires product-owner confirmation before Phase 3 routing work begins.

## Success criteria (architecture-level, not analytics targets)

- A visitor can find their occasion-appropriate adhkar (e.g. morning/evening) within two navigation steps from the homepage.
- Every rendered piece of Arabic/translation content is traceable, in the CMS, to a source and a review status.
- The counter and memorisation tools function fully offline/local, with no network dependency for core reading.
- Nothing in the shipped v1 relies on content that hasn't passed the review policy in [03](03-authenticity-and-scholarly-review-policy.md).

## Explicitly deferred to scholarly/editorial process, not this architecture

- Which specific adhkar are included in v1 (tracked as empty slots in [18-v1-content-register.md](18-v1-content-register.md)).
- Exact category set and naming (draft taxonomy in [05](05-category-taxonomy.md), pending review).
- Translation wording and transliteration scheme.
- Audio reciter selection and licensing terms (framework only in [10](10-audio-review-and-delivery.md)).
